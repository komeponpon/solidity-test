import React from 'react'
import { ArbitragePanel } from './components/ArbitragePanel'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Flash Loan Arbitrage System
      </h1>
      <ArbitragePanel />
    </main>
  )
} 