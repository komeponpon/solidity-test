import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { createPublicClient } from 'viem'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected()
  ],
  transports: {
    [mainnet.id]: http()
  }
})

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
}) 