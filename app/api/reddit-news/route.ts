import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';

const REDDIT_API_URL = 'https://oauth.reddit.com/r/CryptoCurrency/hot?limit=10';
const CACHE_TTL = 3600; // 1 hour

interface RedditPost {
  data: {
    title: string;
    permalink: string;
    url: string;
    created_utc: number;
    author: string;
    subreddit: string;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

function isRateLimitingEnabled() {
  return process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
}

const ratelimit = isRateLimitingEnabled()
  ? new Ratelimit({
      redis: {
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      },
      limiter: Ratelimit.slidingWindow(10, '1 m'),
    })
  : null;

async function fetchRedditPosts(): Promise<RedditPost[]> {
  const clientId = 'D1jGq0gu-OhmCO-t8DLe3g';
  const clientSecret = 'jxZVel3wm29vah3Sx630G3KfY-bNRA';

  if (!clientId || !clientSecret) {
    throw new Error('Reddit API credentials are not configured.');
  }

  // Get access token
  const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to obtain Reddit access token.');
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Fetch posts
  const postsResponse = await fetch(REDDIT_API_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'Jeets.Fi/1.0.0',
    },
  });

  if (!postsResponse.ok) {
    throw new Error('Failed to fetch Reddit data.');
  }

  const data: RedditResponse = await postsResponse.json();
  return data.data.children;
}

export async function GET(request: Request) {
  if (ratelimit) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  try {
    // Fetch fresh posts from Reddit
    const posts = await fetchRedditPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Reddit posts. Please try again later.' },
      { status: 500 },
    );
  }
}

