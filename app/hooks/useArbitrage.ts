import { useContractWrite, usePublicClient } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { ARBITRAGE_CONTRACT_ADDRESS } from '../config/contracts'
import { arbitrageABI } from '../config/abis'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'

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
    const errorMessage = error.message.toLowerCase()
    if (errorMessage.includes('insufficient funds')) {
      return '残高が不足しています'
    }
    if (errorMessage.includes('user rejected')) {
      return 'トランザクションがキャンセルされました'
    }
    if (errorMessage.includes('execution reverted')) {
      if (errorMessage.includes('slippage')) {
        return 'スリッページが大きすぎます。価格が急激に変動しました'
      }
      if (errorMessage.includes('insufficient liquidity')) {
        return '流動性が不足しています'
      }
      if (errorMessage.includes('deadline')) {
        return 'デッドラインを過ぎました。再度実行してください'
      }
      return '取引が失敗しました。価格が変動した可能性があります'
    }
    return `エラーが発生しました: ${error.message}`
  }
  return 'エラーが発生しました'
}

const calculateDeadline = () => {
  if (typeof window === 'undefined') {
    return BigInt(0)
  }
  
  const now = Math.floor(Date.now() / 1000)
  const deadline = now + 60 * 2
  return BigInt(deadline)
}

const SLIPPAGE_TOLERANCE = 0.5 // 0.5%
const MIN_PROFIT_THRESHOLD = parseEther('0.0001') // 最小利益閾値
const GAS_BUFFER = BigInt(120) // 20%のガスバッファー

export function useArbitrage(params?: {
  selectedPair?: {
    tokenA: string
    tokenB: string
    uniswapFee: number
  }
  amount?: string
}) {
  const publicClient = usePublicClient()
  const { address } = useAccount()
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [expectedProfit, setExpectedProfit] = useState<bigint | null>(null)
  const [deadline, setDeadline] = useState<bigint>(BigInt(0))

  useEffect(() => {
    setDeadline(calculateDeadline())
  }, [])

  // オーナー状態を更新する
  useEffect(() => {
    const updateOwnerStatus = async () => {
      if (!publicClient || !address) {
        setIsOwner(false)
        return
      }

      try {
        const owner = await publicClient.readContract({
          address: ARBITRAGE_CONTRACT_ADDRESS as `0x${string}`,
          abi: arbitrageABI,
          functionName: 'owner'
        })
        setIsOwner(owner === address)
      } catch (err) {
        console.error('オーナー確認に失敗しました:', err)
        setIsOwner(false)
      }
    }

    updateOwnerStatus()
  }, [publicClient, address])

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

    if (!isOwner) {
      throw new Error('このアドレスには実行権限がありません')
    }

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

      if (!profitCheck.result) throw new Error('収益性の確認に失敗しました')
      
      const result = profitCheck.result as unknown as [boolean, bigint]
      const [isProfitable, expectedProfit] = result

      if (!isProfitable) {
        throw new Error('現在の価格差では収益が見込めません')
      }

      // 最小利益閾値をチェック
      if (expectedProfit < MIN_PROFIT_THRESHOLD) {
        throw new Error(`予想収益が最小閾値（${formatEther(MIN_PROFIT_THRESHOLD)} ETH）を下回っています`)
      }

      // ガス代を見積もり
      const gasEstimate = await estimateGas({
        tokenA,
        tokenB,
        amount,
        uniswapFee
      })

      if (!gasEstimate) {
        throw new Error('ガス代の見積もりに失敗しました')
      }

      // ガスコストと予想収益を比較
      const gasPrice = await publicClient.getGasPrice()
      const gasCost = gasEstimate * gasPrice
      if (gasCost * BigInt(100) > expectedProfit * BigInt(80)) { // 収益の80%以上がガス代の場合は中止
        throw new Error('ガス代が高すぎるため、収益が見込めません')
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
          deadline
        ],
        gas: (gasEstimate * GAS_BUFFER) / BigInt(100),
        gasPrice: gasPrice
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
          deadline
        ]
      })
      return gasEstimate
    } catch (err) {
      console.error('ガス見積もりに失敗しました:', err)
      return null
    }
  }

  const checkProfitability = async (params: ExecuteArbitrageParams) => {
    if (!publicClient) return null
    
    try {
      const result = await publicClient.simulateContract({
        address: ARBITRAGE_CONTRACT_ADDRESS as `0x${string}`,
        abi: arbitrageABI,
        functionName: 'checkProfitability',
        args: [
          params.tokenA as `0x${string}`,
          params.tokenB as `0x${string}`,
          parseEther(params.amount),
          params.uniswapFee
        ]
      })

      if (!result.result) return null
      
      const [isProfitable, profit] = result.result as unknown as [boolean, bigint]
      return { isProfitable, profit }
    } catch (err) {
      console.error('収益性チェックに失敗しました:', err)
      return null
    }
  }

  // 金額が変更されたときに収益性をチェック
  useEffect(() => {
    const updateProfitability = async () => {
      if (!params?.selectedPair || !params?.amount) {
        setExpectedProfit(null)
        return
      }

      const result = await checkProfitability({
        tokenA: params.selectedPair.tokenA,
        tokenB: params.selectedPair.tokenB,
        amount: params.amount,
        uniswapFee: params.selectedPair.uniswapFee
      })

      setExpectedProfit(result?.profit ?? null)
    }

    updateProfitability()
  }, [params?.amount, params?.selectedPair, publicClient])

  return {
    executeArbitrage,
    estimateGas,
    isLoading: isWriteLoading,
    isSuccess,
    error: writeError ? new Error(formatError(writeError)) : null,
    isOwner,
    expectedProfit
  }
} 