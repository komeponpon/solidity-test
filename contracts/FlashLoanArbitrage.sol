// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IFlashLoanRecipient.sol";
import "@balancer-labs/v2-interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract FlashLoanArbitrage is IFlashLoanRecipient, ReentrancyGuard {
    IVault private immutable vault;
    ISwapRouter private immutable uniswapRouter;
    IUniswapV2Router02 private immutable sushiswapRouter;
    address public owner;

    // 最小利益率（例: 0.5% = 50）
    uint256 public constant MIN_PROFIT_BPS = 50;
    uint256 public constant BPS_DENOMINATOR = 10000;

    event ArbitrageExecuted(
        address[] tokens,
        uint256[] amounts,
        uint256 profit
    );

    event PriceChecked(
        address token0,
        address token1,
        uint256 uniswapPrice,
        uint256 sushiswapPrice
    );

    constructor(
        IVault _vault,
        ISwapRouter _uniswapRouter,
        IUniswapV2Router02 _sushiswapRouter
    ) {
        vault = _vault;
        uniswapRouter = _uniswapRouter;
        sushiswapRouter = _sushiswapRouter;
        owner = msg.sender;
    }

    struct ArbitrageParams {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint24 uniswapFee;
        uint256 deadline;
    }

    function receiveFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes memory userData
    ) external override {
        require(msg.sender == address(vault), "Only Balancer Vault");

        // userData からパラメータをデコード
        ArbitrageParams memory params = abi.decode(userData, (ArbitrageParams));

        // 1. Uniswap V3での取引
        uint256 amountReceived = executeUniswapTrade(
            params.tokenIn,
            params.tokenOut,
            amounts[0],
            params.uniswapFee,
            params.deadline
        );

        // 2. SushiSwap V3での逆取引
        uint256 finalAmount = executeSushiswapTrade(
            params.tokenOut,
            params.tokenIn,
            amountReceived,
            params.deadline
        );

        // 利益の計算
        uint256 profit = finalAmount - (amounts[0] + feeAmounts[0]);
        require(profit > 0, "No profit");

        // 最小利益率のチェック
        uint256 profitBps = (profit * BPS_DENOMINATOR) / amounts[0];
        require(profitBps >= MIN_PROFIT_BPS, "Insufficient profit");

        // ローンの返済
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20(tokens[i]).transfer(
                address(vault),
                amounts[i] + feeAmounts[i]
            );
        }

        // 利益を所有者に送信
        if (profit > 0) {
            IERC20(params.tokenIn).transfer(owner, profit);
        }

        emit ArbitrageExecuted(
            _convertToAddressArray(tokens),
            amounts,
            profit
        );
    }

    function executeArbitrage(
        address tokenIn,
        address tokenOut,
        uint256 amount,
        uint24 uniswapFee,
        uint256 deadline
    ) external nonReentrant {
        require(msg.sender == owner, "Only owner");
        
        // 価格チェック
        (bool isProfitable,) = checkProfitability(
            tokenIn,
            tokenOut,
            amount,
            uniswapFee
        );
        require(isProfitable, "No profitable opportunity");

        // フラッシュローンのパラメータを準備
        IERC20[] memory tokens = new IERC20[](1);
        tokens[0] = IERC20(tokenIn);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        // アービトラージパラメータのエンコード
        ArbitrageParams memory params = ArbitrageParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amount,
            uniswapFee: uniswapFee,
            deadline: deadline
        });

        // フラッシュローンの実行
        vault.flashLoan(
            this,
            tokens,
            amounts,
            abi.encode(params)
        );
    }

    function executeUniswapTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint24 fee,
        uint256 deadline
    ) internal returns (uint256 amountOut) {
        // Uniswap V3でのスワップパラメータ
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: address(this),
                deadline: deadline,
                amountIn: amountIn,
                amountOutMinimum: 0, // フラッシュローン内なのでスリッページは考慮しない
                sqrtPriceLimitX96: 0
            });

        // トークンの承認
        IERC20(tokenIn).approve(address(uniswapRouter), amountIn);

        // スワップの実行
        return uniswapRouter.exactInputSingle(params);
    }

    function executeSushiswapTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 deadline
    ) internal returns (uint256 amountOut) {
        // パスの設定
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        // トークンの承認
        IERC20(tokenIn).approve(address(sushiswapRouter), amountIn);

        // スワップの実行
        uint256[] memory amounts = sushiswapRouter.swapExactTokensForTokens(
            amountIn,
            0, // フラッシュローン内なのでスリッページは考慮しない
            path,
            address(this),
            deadline
        );

        return amounts[amounts.length - 1];
    }

    function checkProfitability(
        address tokenIn,
        address tokenOut,
        uint256 amount,
        uint24 uniswapFee
    ) public returns (bool, uint256) {
        // Uniswapでの予想取引結果
        uint256 uniswapAmount = getUniswapQuote(
            tokenIn,
            tokenOut,
            amount,
            uniswapFee
        );

        // SushiSwapでの予想取引結果
        uint256 sushiswapAmount = getSushiswapQuote(
            tokenOut,
            tokenIn,
            uniswapAmount
        );

        // Balancerのフラッシュローン手数料（0.02%）
        uint256 flashLoanFee = (amount * 2) / 10000;

        // 予想利益の計算
        if (sushiswapAmount > amount + flashLoanFee) {
            uint256 expectedProfit = sushiswapAmount - (amount + flashLoanFee);
            uint256 profitBps = (expectedProfit * BPS_DENOMINATOR) / amount;
            
            emit PriceChecked(
                tokenIn,
                tokenOut,
                uniswapAmount,
                sushiswapAmount
            );

            return (profitBps >= MIN_PROFIT_BPS, expectedProfit);
        }

        return (false, 0);
    }

    function getUniswapQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint24 fee
    ) internal pure returns (uint256) {
        // Uniswap V3のクォート取得ロジック
        // 実際の実装ではQuoterV2コントラクトを使用
        return amountIn; // 仮の実装
    }

    function getSushiswapQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) internal view returns (uint256) {
        // SushiSwapのクォート取得ロジック
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        
        return sushiswapRouter.getAmountsOut(amountIn, path)[1];
    }

    function _convertToAddressArray(IERC20[] memory tokens) internal pure returns (address[] memory) {
        address[] memory addresses = new address[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            addresses[i] = address(tokens[i]);
        }
        return addresses;
    }

    // 緊急出金関数
    function emergencyWithdraw(address token) external {
        require(msg.sender == owner, "Only owner");
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance > 0) {
            IERC20(token).transfer(owner, balance);
        }
    }
}