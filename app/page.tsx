'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Graph } from "@/components/graph"
import { NewsGrid } from "@/components/news-grid"
import { ChatInterface } from "@/components/chat-interface"
import { staticPredictions } from "@/lib/static-crypto-data"

export default function Home() {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin')
  const [predictions, setPredictions] = useState(staticPredictions)

  const handlePredictionsUpdate = (newPredictions: Record<string, number[]>) => {
    setPredictions(prevPredictions => ({
      ...prevPredictions,
      ...newPredictions
    }))
  }

  useEffect(() => {
    // Simulate fetching predictions from an API
    // In a real application, you would fetch this data from your backend
    setPredictions(staticPredictions)
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <Header onCryptoChange={setSelectedCrypto} />
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 overflow-auto pr-4">
          <Graph coinId={selectedCrypto} predictions={predictions} />
          <NewsGrid />
        </div>
        <ChatInterface onPredictionsUpdate={handlePredictionsUpdate} />
      </div>
    </div>
  )
}

