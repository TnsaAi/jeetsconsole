import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const NEWS_CACHE_KEY = 'crypto_news_cache'
const CACHE_TTL = 600 // 10 minutes

interface NewsArticle {
  title: string
  url: string
  publishedAt: string
  source: {
    name: string
  }
}

async function fetchNewsFromAPI(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    throw new Error('NEWS_API_KEY is not set')
  }

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch news from API')
  }

  const data = await response.json()
  return data.articles
}

export async function GET() {
  try {
    // Try to get cached news
    let news = await kv.get<NewsArticle[]>(NEWS_CACHE_KEY)

    if (!news) {
      // If no cached news, fetch from API
      news = await fetchNewsFromAPI()

      // Cache the fetched news
      await kv.set(NEWS_CACHE_KEY, JSON.stringify(news), { ex: CACHE_TTL })
    }

    return NextResponse.json({ news })
  } catch (error) {
    console.error('Error fetching crypto news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crypto news. Please try again later.' },
      { status: 500 }
    )
  }
}

