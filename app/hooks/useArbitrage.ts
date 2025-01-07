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

interface ProfitabilityResult {
  isProfitable: boolean
  expectedProfit: bigint
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

const calculateDeadline = () => {
  if (typeof window === 'undefined') return BigInt(0)
  return BigInt(Math.floor(Date.now() / 1000) + 60 * 20)
}

const SLIPPAGE_TOLERANCE = 0.5 // 0.5%

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
    if (!publicClient) throw new Error('ネットワーク接続に失敗しました')

    try {
      // 取引前に収益性をチェック
      const profitCheck = await publicClient.simulateContract({
        address: ARBITRAGE_CONTRACT_ADDRESS as `0x${string}`,
        abi: arbitrageABI,
        functionName: 'checkProfitability',
        args: [
          tokenA as `0x${string}`,
          tokenB as `0x${string}`,
          parseEther(amount),
          uniswapFee
        ]
      })

      // 収益性チェックの結果を確認
      if (!profitCheck.result) throw new Error('収益性の確認に失敗しました')

      const result = profitCheck.result as unknown as [boolean, bigint]
      const [isProfitable, expectedProfit] = result

      if (!isProfitable) {
        throw new Error('現在の価格差では収益が見込めません')
      }

      const tx = await writeContract({
        abi: arbitrageABI,
        address: ARBITRAGE_CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'executeArbitrage',
        args: [
          tokenA as `0x${string}`,
          tokenB as `0x${string}`,
          parseEther(amount),
          uniswapFee,
          calculateDeadline()
        ]
      })
      return { tx, expectedProfit }
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
          calculateDeadline()
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