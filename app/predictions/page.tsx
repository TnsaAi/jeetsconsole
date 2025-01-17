'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'
import { Graph } from "@/components/graph"
import { ChatInterface } from "@/components/chat-interface"
import { staticPredictions } from "@/lib/static-crypto-data"

export default function PredictionsPage() {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin')
  const [predictions, setPredictions] = useState(staticPredictions)
  const router = useRouter()

  const handlePredictionsUpdate = (newPredictions: Record<string, number[]>) => {
    setPredictions(prevPredictions => ({
      ...prevPredictions,
      ...newPredictions
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/')} 
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold mb-6">Jeets Predictions</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Price Prediction Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <Graph coinId={selectedCrypto} predictions={predictions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prediction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(predictions).map(([coin, predictionArray]) => (
                <li key={coin} className="flex justify-between">
                  <span className="font-semibold">{coin.toUpperCase()}:</span>
                  <span>{predictionArray[predictionArray.length - 1].toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatInterface onPredictionsUpdate={handlePredictionsUpdate} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

