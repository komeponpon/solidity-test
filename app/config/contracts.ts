export const ARBITRAGE_CONTRACT_ADDRESS = "0x0e6c5e7BCdb38634211D0FE0dcc6dE2625a72F31" as const

// トークンアドレスの型を定義
type TokenAddresses = {
  readonly [key: string]: `0x${string}`
}

// トークンアドレスを型安全に定義
export const TOKENS: TokenAddresses = {
  WETH: "0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323",
  USDC: "0x52D800ca262522580CeBAD275395ca6e7598C014",
  DAI: "0x1D0Db0B5751b7c0e14d755A41543fe6D2bc4cB5E",
  WBTC: "0x007E356e3F28f0eA4d2AD7FE6D3476c3736E458D",
} as const

// ペアの型を定義
interface TradingPair {
  name: string
  tokenA: `0x${string}`
  tokenB: `0x${string}`
  uniswapFee: number
}

// サポートされているペアを型安全に定義
export const SUPPORTED_PAIRS: readonly TradingPair[] = [
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