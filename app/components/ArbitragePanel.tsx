'use client'

import React, { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { useArbitrage } from '../hooks/useArbitrage'
import { SUPPORTED_PAIRS } from '../config/contracts'
import { injected } from 'wagmi/connectors'

export function ArbitragePanel() {
  const { address: account } = useAccount()
  const { connect } = useConnect()
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0)
  const [amount, setAmount] = useState<string>('')
  const { executeArbitrage, isLoading, isSuccess, error } = useArbitrage()

  const selectedPair = SUPPORTED_PAIRS[selectedPairIndex]

  const handleExecute = async () => {
    if (!amount || !account) return
    
    try {
      await executeArbitrage({
        tokenA: selectedPair.tokenA,
        tokenB: selectedPair.tokenB,
        amount,
        uniswapFee: selectedPair.uniswapFee,
      })
    } catch (err) {
      console.error('Failed to execute arbitrage:', err)
    }
  }

  const handleConnect = async () => {
    try {
      await connect({ connector: injected() })
    } catch (err) {
      console.error('Failed to connect wallet:', err)
    }
  }

  if (!account) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg">
        <p className="text-center text-gray-600 mb-4">Please connect your wallet</p>
        <button
          onClick={handleConnect}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Flash Loan Arbitrage</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Token Pair
          </label>
          <select
            value={selectedPairIndex}
            onChange={(e) => setSelectedPairIndex(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {SUPPORTED_PAIRS.map((pair, index) => (
              <option key={pair.name} value={index}>
                {pair.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Flash Loan Amount ({selectedPair.name.split('/')[0]})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={`Enter amount in ${selectedPair.name.split('/')[0]}`}
            min="0"
            step="0.000000000000000001"
          />
        </div>

        <button
          onClick={handleExecute}
          disabled={isLoading || !amount}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Execute Arbitrage'}
        </button>

        {isSuccess && (
          <div className="text-green-500 text-sm mt-2">
            Transaction successful!
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error instanceof Error ? error.message : 'An error occurred'}
          </div>
        )}
      </div>
    </div>
  )
} 