import { useContractWrite } from 'wagmi'
import { parseEther } from 'viem'
import { ARBITRAGE_CONTRACT_ADDRESS } from '../config/contracts'
import { arbitrageABI } from '../config/abis'

interface ExecuteArbitrageParams {
  tokenA: string
  tokenB: string
  amount: string
  uniswapFee: number
}

export function useArbitrage() {
  const { 
    writeContract,
    data: writeData,
    error: writeError,
    isPending: isWriteLoading,
    isSuccess
  } = useContractWrite()

  const executeArbitrage = async ({
    tokenA,
    tokenB,
    amount,
    uniswapFee
  }: ExecuteArbitrageParams) => {
    if (!writeContract) throw new Error('Contract write not initialized')

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from now

    try {
      const tx = await writeContract({
        address: ARBITRAGE_CONTRACT_ADDRESS as `0x${string}`,
        abi: arbitrageABI,
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
      console.error('Arbitrage execution failed:', err)
      throw err
    }
  }

  return {
    executeArbitrage,
    isLoading: isWriteLoading,
    isSuccess,
    error: writeError
  }
} 