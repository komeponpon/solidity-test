import { http, createConfig } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { createPublicClient } from 'viem'
import { injected } from 'wagmi/connectors'

// Polygon Amoy Testnetの設定
const amoyTestnet = {
  ...polygonAmoy,
  id: 80002,
  name: 'Polygon Amoy',
  network: 'amoy',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-amoy.polygon.technology']
    },
    public: {
      http: ['https://rpc-amoy.polygon.technology']
    }
  }
} as const

export const config = createConfig({
  chains: [amoyTestnet],
  connectors: [
    injected()
  ],
  transports: {
    [amoyTestnet.id]: http()
  }
})

export const publicClient = createPublicClient({
  chain: amoyTestnet,
  transport: http()
}) 