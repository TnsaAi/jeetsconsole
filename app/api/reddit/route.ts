import { RedditResponse } from '@/lib/types'

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
    }
    // Wait for 1 second before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error(`Failed to fetch after ${maxRetries} retries`);
}

export async function GET() {
  const clientId = process.env.REDDIT_CLIENT_ID
  const clientSecret = process.env.REDDIT_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    console.error('Reddit API credentials are not configured')
    return Response.json(
      { error: 'Reddit API credentials are not configured' },
      { status: 500 }
    )
  }

  try {
    // Get access token
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    })

    if (!tokenResponse.ok) {
      console.error(`Failed to obtain Reddit access token: ${tokenResponse.statusText}`)
      return Response.json(
        { error: 'Failed to obtain Reddit access token' },
        { status: tokenResponse.status }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch posts
    const postsResponse = await fetchWithRetry(
      'https://oauth.reddit.com/r/CryptoCurrency/hot?limit=5',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'Jeets.Fi/1.0.0'
        },
        cache: 'no-store'
      }
    )

    if (!postsResponse.ok) {
      console.error(`Failed to fetch Reddit data: ${postsResponse.statusText}`)
      return Response.json(
        { error: 'Failed to fetch Reddit data' },
        { status: postsResponse.status }
      )
    }

    const contentType = postsResponse.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Received non-JSON response from Reddit API')
      const text = await postsResponse.text()
      console.error('Response content:', text.substring(0, 200)) // Log the first 200 characters
      return Response.json(
        { error: 'Received non-JSON response from Reddit API' },
        { status: 500 }
      )
    }

    const data: RedditResponse = await postsResponse.json()
    
    if (!data || !data.data || !Array.isArray(data.data.children)) {
      console.error('Invalid data structure received from Reddit API')
      return Response.json(
        { error: 'Invalid data structure received from Reddit API' },
        { status: 500 }
      )
    }

    return Response.json({
      posts: data.data.children.map(post => ({
        title: post.data.title,
        url: `https://reddit.com${post.data.permalink}`,
        author: post.data.author,
        subreddit: post.data.subreddit,
        created: post.data.created_utc
      }))
    })
  } catch (error) {
    console.error('Reddit API error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    )
  }
}

