'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'

interface PageData {
  title: string
  description: string
  socialLinks: {
    twitter: string
    linkedin: string
    github: string
  }
  customDomain: string
}

export default function YourPage() {
  const [pageData, setPageData] = useState<PageData | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulating data fetch from an API
    const fetchData = async () => {
      // Replace this with actual API call in production
      const mockData: PageData = {
        title: "John Doe's Crypto Page",
        description: "Welcome to my personal crypto analysis and trading page.",
        socialLinks: {
          twitter: "https://twitter.com/johndoe",
          linkedin: "https://linkedin.com/in/johndoe",
          github: "https://github.com/johndoe"
        },
        customDomain: "johndoe-crypto.com"
      }
      setPageData(mockData)
    }

    fetchData()
  }, [])

  if (!pageData) {
    return <div>Loading...</div>
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
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{pageData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{pageData.description}</p>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Connect with me:</h3>
            <ul className="list-disc list-inside">
              <li><a href={pageData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Twitter</a></li>
              <li><a href={pageData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">LinkedIn</a></li>
              <li><a href={pageData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">GitHub</a></li>
            </ul>
          </div>
          <p>Custom Domain: <span className="font-semibold">{pageData.customDomain}</span></p>
        </CardContent>
      </Card>
    </div>
  )
}

