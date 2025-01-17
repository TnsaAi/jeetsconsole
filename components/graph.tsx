'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PriceData {
  date: string
  price: number
  prediction?: number
}

interface GraphProps {
  coinId: string
  predictions: Record<string, number[]>
}

export function Graph({ coinId, predictions }: GraphProps) {
  const [data, setData] = useState<PriceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  useEffect(() => {
    async function fetchMarketData() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/market-data?coinId=${coinId}&days=${selectedTimeframe === '7d' ? 7 : 30}`)
        if (!response.ok) {
          throw new Error('Failed to fetch market data')
        }
        const marketData = await response.json()
        
        // Add predictions to the market data
        const dataWithPredictions = marketData.map((item: PriceData, index: number) => ({
          ...item,
          prediction: predictions[coinId] && predictions[coinId][index] ? item.price * (1 + predictions[coinId][index] / 100) : undefined
        }))
        
        setData(dataWithPredictions)
      } catch (err) {
        setError('Failed to load market data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
  }, [coinId, selectedTimeframe, predictions])

  const combinedData = data.map((item, index) => ({
    ...item,
    prediction: predictions[coinId] ? predictions[coinId][index] : null
  }))

  return (
    <Card className="w-full h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price</CardTitle>
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend wrapperStyle={{ bottom: 0 }} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                dot={false}
                name="Actual Price"
              />
              <Line 
                type="monotone" 
                dataKey="prediction" 
                stroke="hsl(var(--secondary))" 
                strokeDasharray="5 5"
                dot={false}
                name="Predicted Price"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

