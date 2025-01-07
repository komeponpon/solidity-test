// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract FlashLoanArbitrage is FlashLoanSimpleReceiverBase {
    address public owner;

    constructor(address _addressProvider) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {
        owner = msg.sender;
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address,
        bytes calldata
    ) external override returns (bool) {
        // アービトラージロジックをここに実装
        // 1. Uniswapで取引
        // 2. SushiSwapで取引

        // ローンの返済に必要な金額を計算
        uint256 amountToRepay = amount + premium;

        // ローンの返済を承認
        IERC20(asset).approve(address(POOL), amountToRepay);

        return true;
    }

    function requestFlashLoan(address token, uint256 amount) public {
        require(msg.sender == owner, "Only owner can request flash loan");
        POOL.flashLoanSimple(
            address(this),
            token,
            amount,
            "0x",
            0
        );
    }

    function getBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}