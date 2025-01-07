'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { useArbitrage } from '../hooks/useArbitrage'
import { SUPPORTED_PAIRS } from '../config/contracts'
import { injected } from 'wagmi/connectors'
import { GasEstimate } from './GasEstimate'

export function ArbitragePanel() {
  const { address: account } = useAccount()
  const { connect } = useConnect()
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0)
  const [amount, setAmount] = useState<string>('')
  const [gasEstimate, setGasEstimate] = useState<bigint | null>(null)
  const { executeArbitrage, estimateGas, isLoading, isSuccess, error } = useArbitrage()

  const selectedPair = SUPPORTED_PAIRS[selectedPairIndex]

  useEffect(() => {
    if (!amount || !selectedPair) return

    const updateGasEstimate = async () => {
      const estimate = await estimateGas({
        tokenA: selectedPair.tokenA,
        tokenB: selectedPair.tokenB,
        amount,
        uniswapFee: selectedPair.uniswapFee,
      })
      setGasEstimate(estimate)
    }

    updateGasEstimate()
  }, [amount, selectedPair, estimateGas])

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
      console.error('アービトラージの実行に失敗しました:', err)
    }
  }

  const handleConnect = async () => {
    try {
      await connect({ connector: injected() })
    } catch (err) {
      console.error('ウォレットの接続に失敗しました:', err)
    }
  }

  const handleGetTestMatic = () => {
    window.open('https://faucet.polygon.technology/', '_blank')
  }

  if (!account) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
        <p className="text-center text-white mb-4">ウォレットを接続してください</p>
        <button
          onClick={handleConnect}
          className="w-full bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-100"
        >
          ウォレットを接続
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">
        フラッシュローン アービトラージ
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            取引ペアを選択
          </label>
          <select
            value={selectedPairIndex}
            onChange={(e) => setSelectedPairIndex(Number(e.target.value))}
            className="mt-1 block w-full rounded-md bg-white/90 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            {SUPPORTED_PAIRS.map((pair, index) => (
              <option key={pair.name} value={index}>
                {pair.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            取引金額
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const value = e.target.value
                if (value === '0' || value === '00') {
                  setAmount('0')
                  return
                }
                if (!/^\d*\.?\d*$/.test(value)) return
                if ((value.match(/\./g) || []).length > 1) return
                const [integer, decimal] = value.split('.')
                if (decimal && decimal.length > 18) return
                
                setAmount(value)
              }}
              className="mt-1 block w-full rounded-md bg-white/90 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500"
              placeholder="金額を入力"
              inputMode="decimal"
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-700 text-sm font-medium">
                {selectedPair.name.split('/')[0]}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleExecute}
          disabled={isLoading || !amount}
          className="w-full bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '処理中...' : 'アービトラージを実行'}
        </button>

        {isSuccess && (
          <div className="text-green-300 text-sm mt-2">
            取引が成功しました！
          </div>
        )}

        {error && (
          <div className="text-red-300 text-sm mt-2">
            {error instanceof Error ? error.message : 'エラーが発生しました'}
          </div>
        )}

        <div className="mt-4 p-4 bg-white/10 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium">テストネット用MATIC残高</h3>
              <p className="text-sm text-white/70">
                取引にはガス代としてMATICが必要です
              </p>
            </div>
            <button
              onClick={handleGetTestMatic}
              className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
            >
              テストMATICを入手
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-white">
          <h3 className="font-medium mb-2">注意事項:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>取引前に必ず価格差を確認してください</li>
            <li>ガス代（MATIC）が必要です（約0.1 MATIC/取引）</li>
            <li>テストネットのMATICは無料で入手可能です</li>
            <li>リスクを理解した上で取引を行ってください</li>
          </ul>
        </div>

        <GasEstimate gasEstimate={gasEstimate} />
      </div>
    </div>
  )
} 