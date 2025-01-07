import React from 'react'
import { formatEther } from 'viem'

interface GasEstimateProps {
  gasEstimate: bigint | null
}

export function GasEstimate({ gasEstimate }: GasEstimateProps) {
  if (!gasEstimate) return null

  // ガス代を見やすい形式にフォーマット
  const formattedGas = formatEther(gasEstimate)
  const roundedGas = Number(formattedGas).toFixed(6)

  return (
    <div className="mt-4 p-4 bg-white/10 rounded-md">
      <div className="space-y-2">
        <p className="text-white font-medium">予想ガス代</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-white">
            {roundedGas}
          </span>
          <span className="text-white/70">MATIC</span>
        </div>
        <p className="text-xs text-white/70">
          ※ 実際のガス代は市場の混雑状況により変動します
        </p>
      </div>
    </div>
  )
} 