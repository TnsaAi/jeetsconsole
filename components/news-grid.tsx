'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RedditPost {
  data: {
    title: string
    permalink: string
    url: string
    created_utc: number
    author: string
    subreddit: string
  }
}

export function NewsGrid() {
  const [posts, setPosts] = useState<RedditPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/reddit-news')
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setPosts(data.posts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Reddit posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-card animate-pulse">
            <CardContent className="p-4 h-24 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card col-span-full">
          <CardContent className="p-4 text-center text-muted-foreground">
            <p className="mb-4">Error: {error}</p>
            <Button onClick={fetchNews} className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Crypto News from Reddit</span>
            <Button onClick={fetchNews} size="sm" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <Card key={index} className="bg-card hover:bg-card/80 transition-colors">
            <CardContent className="p-4">
              <a 
                href={`https://reddit.com${post.data.permalink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between group"
              >
                <p className="text-sm text-card-foreground group-hover:text-orange-500 transition-colors">
                  {post.data.title}
                </p>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2 group-hover:text-orange-500 transition-colors" />
              </a>
              <div className="mt-2 text-xs text-muted-foreground">
                Posted by u/{post.data.author} in r/{post.data.subreddit}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

