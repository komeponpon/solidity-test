export const ARBITRAGE_CONTRACT_ADDRESS = "0x0e6c5e7BCdb38634211D0FE0dcc6dE2625a72F31"

// トークンアドレス
export const TOKENS = {
  WETH: "0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323", // Wrapped ETH on Amoy
  USDC: "0x52D800ca262522580CeBAD275395ca6e7598C014", // USDC on Amoy
  DAI: "0x1D0Db0B5751b7c0e14d755A41543fe6D2bc4cB5E",  // DAI on Amoy
  WBTC: "0x007E356e3F28f0eA4d2AD7FE6D3476c3736E458D", // Wrapped BTC on Amoy
} as const

// サポートされているトークンペア
export const SUPPORTED_PAIRS = [
  {
    name: "WETH/USDC",
    tokenA: TOKENS.WETH,
    tokenB: TOKENS.USDC,
    uniswapFee: 500, // 0.05%
  },
  {
    name: "WETH/DAI",
    tokenA: TOKENS.WETH,
    tokenB: TOKENS.DAI,
    uniswapFee: 500,
  },
  {
    name: "WBTC/WETH",
    tokenA: TOKENS.WBTC,
    tokenB: TOKENS.WETH,
    uniswapFee: 500,
  },
] as const 