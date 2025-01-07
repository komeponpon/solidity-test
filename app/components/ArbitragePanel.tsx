'use client'

import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useArbitrage } from '../hooks/useArbitrage'
import { SUPPORTED_TOKENS } from '../config/contracts'

export function ArbitragePanel() {
  const { address: account } = useAccount()
  const [selectedToken, setSelectedToken] = useState<string>(SUPPORTED_TOKENS.ETH)
  const [amount, setAmount] = useState<string>('')
  const { executeArbitrage, isLoading, isSuccess, error } = useArbitrage()

  const handleExecute = async () => {
    if (!amount || !selectedToken || !account) return
    
    try {
      await executeArbitrage(selectedToken, amount)
    } catch (err) {
      console.error('Failed to execute arbitrage:', err)
    }
  }

  if (!account) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg">
        <p className="text-center text-gray-600">Please connect your wallet</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Flash Loan Arbitrage</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Token
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {Object.entries(SUPPORTED_TOKENS).map(([name, address]) => (
              <option key={address} value={address}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter amount"
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