import React from 'react'
import { ArbitragePanel } from './components/ArbitragePanel'

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-2xl mx-auto mb-8 text-center text-gray-300">
        <p>UniswapとSushiSwap間の価格差を利用した自動取引システム</p>
        <p className="mt-2 text-sm">※ テストネット（Polygon Amoy）での動作となります</p>
      </div>
      <ArbitragePanel />
    </main>
  )
} 