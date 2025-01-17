import { NextResponse } from 'next/server'

interface PriceData {
  prices: [number, number][]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const coinId = searchParams.get('coinId') || 'bitcoin'
  const days = searchParams.get('days') || '7'

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch market data')
    }

    const data: PriceData = await response.json()

    const formattedData = data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price: parseFloat(price.toFixed(2)),
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching market data:', error)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}

