import { useContractWrite, usePublicClient } from 'wagmi'
import { parseEther } from 'viem'
import { ARBITRAGE_CONTRACT_ADDRESS } from '../config/contracts'
import { arbitrageABI } from '../config/abis'

interface ExecuteArbitrageParams {
  tokenA: string
  tokenB: string
  amount: string
  uniswapFee: number
}

const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('insufficient funds')) {
      return '残高が不足しています'
    }
    if (error.message.includes('user rejected')) {
      return 'トランザクションがキャンセルされました'
    }
    return `エラーが発生しました: ${error.message}`
  }
  return 'エラーが発生しました'
}

export function useArbitrage() {
  const publicClient = usePublicClient()
  const { 
    data: writeData,
    error: writeError,
    isPending: isWriteLoading,
    isSuccess,
    writeContract
  } = useContractWrite()

  const executeArbitrage = async ({
    tokenA,
    tokenB,
    amount,
    uniswapFee
  }: ExecuteArbitrageParams) => {
    if (!writeContract) throw new Error('コントラクトの初期化に失敗しました')

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20分後

    try {
      const tx = await writeContract({
        abi: arbitrageABI,
        address: ARBITRAGE_CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'executeArbitrage',
        args: [
          tokenA as `0x${string}`,
          tokenB as `0x${string}`,
          parseEther(amount),
          uniswapFee,
          BigInt(deadline)
        ]
      })
      return tx
    } catch (err) {
      console.error('アービトラージの実行に失敗しました:', err)
      throw new Error(formatError(err))
    }
  }

  const estimateGas = async (params: ExecuteArbitrageParams) => {
    if (!publicClient) return null

    try {
      const gasEstimate = await publicClient.estimateContractGas({
        address: ARBITRAGE_CONTRACT_ADDRESS as `0x${string}`,
        abi: arbitrageABI,
        functionName: 'executeArbitrage',
        args: [
          params.tokenA as `0x${string}`,
          params.tokenB as `0x${string}`,
          parseEther(params.amount),
          params.uniswapFee,
          BigInt(Math.floor(Date.now() / 1000) + 60 * 20)
        ]
      })
      return gasEstimate
    } catch (err) {
      console.error('ガス見積もりに失敗しました:', err)
      return null
    }
  }

  return {
    executeArbitrage,
    estimateGas,
    isLoading: isWriteLoading,
    isSuccess,
    error: writeError ? new Error(formatError(writeError)) : null
  }
} 