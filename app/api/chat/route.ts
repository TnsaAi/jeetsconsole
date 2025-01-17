import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { kv } from '@vercel/kv'

const REDDIT_CACHE_KEY = 'reddit_news_cache'

function isVercelKVAvailable() {
  return process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
}

async function getLatestRedditPosts() {
  if (!isVercelKVAvailable()) {
    return []
  }

  try {
    const cachedPosts = await kv.get(REDDIT_CACHE_KEY)
    return cachedPosts || []
  } catch (error) {
    console.error('Error fetching cached Reddit posts:', error)
    return []
  }
}

export async function POST(req: Request) {
  const groqApiKey = process.env.GROQ_API_KEY

  if (!groqApiKey) {
    console.error('Groq API key is not configured')
    return Response.json(
      { error: 'Internal server error: API key missing' },
      { status: 500 }
    )
  }

  try {
    const { messages } = await req.json()
    if (!Array.isArray(messages)) {
      throw new Error('Invalid messages format')
    }

    const latestPosts = await getLatestRedditPosts()
    
    const systemPrompt = `
      You are an AI assistant for a cryptocurrency trading platform. Use the following latest Reddit posts from r/CryptoCurrency to inform your responses:
      
      Latest Reddit Posts:
      ${JSON.stringify(latestPosts)}
      
      When discussing market trends or giving advice, always consider this latest information and provide risk-aware recommendations.
    `

    let text;
    try {
      const result = await generateText({
        model: groq("mixtral-8x7b-32768"),
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
      text = result.text;
    } catch (error) {
      console.error('Error generating text:', error instanceof Error ? error.message : 'Unknown error')
      return Response.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      )
    }

    return Response.json({ 
      response: text,
      latestPosts
    })
  } catch (error) {
    console.error('API error:', error instanceof Error ? error.message : 'Unknown error')
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    )
  }
}

