'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Loader2, Send, Trash2, Download, ExternalLink } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

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

interface ChatInterfaceProps {
  onPredictionsUpdate: (predictions: Record<string, number[]>) => void
  fullPage?: boolean
}

export function ChatInterface({ onPredictionsUpdate, fullPage = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [latestPosts, setLatestPosts] = useState<RedditPost[]>([])
  const [generatedText, setGeneratedText] = useState('')
  const messageContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetch('/api/chat-history')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const history = await response.json()
        setMessages(history)
      } catch (error) {
        console.error('Failed to load chat history:', error)
        toast({
          title: "Error",
          description: "Failed to load chat history. Please try refreshing the page.",
          variant: "destructive",
        })
      }
    }
    loadChatHistory()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setGeneratedText('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      if (!data.response) {
        throw new Error('No response data received')
      }

      // Check if the response includes predictions
      if (data.predictions) {
        onPredictionsUpdate(data.predictions)
      }

      // Simulate word-by-word generation
      const words = data.response.split(' ')
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50)) // Adjust delay as needed
        setGeneratedText(prev => prev + (prev ? ' ' : '') + words[i])
      }

      const assistantMessage: Message = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMessage])
      setLatestPosts(data.latestPosts)
      saveChatHistory([...messages, userMessage, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to send message: ${errorMessage}`,
        variant: "destructive",
      })
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an error: ${errorMessage}` }])
    } finally {
      setIsLoading(false)
      setGeneratedText('')
    }
  }

  const clearChat = () => {
    setMessages([])
    setLatestPosts([])
    saveChatHistory([])
  }

  const downloadChat = () => {
    const chatContent = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n')
    const blob = new Blob([chatContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chat_history.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const saveChatHistory = async (history: Message[]) => {
    try {
      const response = await fetch('/api/chat-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(history),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error('Failed to save chat history')
      }
    } catch (error) {
      console.error('Error saving chat history:', error)
      toast({
        title: "Error",
        description: "Failed to save chat history.",
        variant: "destructive",
      })
    }
  }

  const GenerationAnimation = ({ text }: { text: string }) => (
    <motion.div
      className="bg-secondary p-2 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {text}
    </motion.div>
  )

  return (
    <Card className={`bg-card flex flex-col ${fullPage ? 'h-[calc(100vh-16rem)]' : 'h-[calc(100vh-4rem)] max-h-[800px] w-[400px]'} shadow-[inset_0_0_20px_rgba(249,115,22,0.4)]`}>
      <CardHeader className="p-4 flex flex-row justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-orange-500">Jeets AI Assistant</h2>
          <p className="text-sm text-muted-foreground">How can I assist you today?</p>
        </div>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={clearChat}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={downloadChat}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-hidden" style={{ height: 'calc(100% - 140px)' }}>
        <ScrollArea className="h-full pr-4">
          <div ref={messageContainerRef} className="space-y-4">
            {latestPosts.length > 0 && (
              <Card className="bg-secondary p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Latest Reddit Posts</h3>
                <ul className="space-y-2">
                  {latestPosts.slice(0, 3).map((post, index) => (
                    <li key={index}>
                      <a
                        href={`https://reddit.com${post.data.permalink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start group"
                      >
                        <span className="text-sm text-card-foreground group-hover:text-orange-500 transition-colors">
                          {post.data.title}
                        </span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2 group-hover:text-orange-500 transition-colors" />
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className={message.role === 'assistant' ? 'bg-orange-500' : 'bg-primary'}>
                    <AvatarFallback>{message.role === 'assistant' ? 'AI' : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-2 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <Avatar className="bg-orange-500">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <GenerationAnimation text={generatedText} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t bg-card">
        <form onSubmit={handleSubmit} className="w-full flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

