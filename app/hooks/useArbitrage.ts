import { useContractWrite } from 'wagmi'
import { parseEther } from 'viem'
import { ARBITRAGE_CONTRACT_ADDRESS } from '../config/contracts'
import { arbitrageABI } from '../config/abis'

export function useArbitrage() {
  const { 
    writeContract,
    data: writeData,
    error: writeError,
    isPending: isWriteLoading,
    isSuccess
  } = useContractWrite()

  const executeArbitrage = async (tokenAddress: string, amount: string) => {
    if (!writeContract) throw new Error('Contract write not initialized')

    try {
      const tx = await writeContract({
        address: ARBITRAGE_CONTRACT_ADDRESS as `0x${string}`,
        abi: arbitrageABI,
        functionName: 'requestFlashLoan',
        args: [tokenAddress as `0x${string}`, parseEther(amount)]
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