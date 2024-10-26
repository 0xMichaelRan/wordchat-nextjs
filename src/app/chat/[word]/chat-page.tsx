'use client'

import { useEffect, useState } from 'react'
import { Send, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from 'axios'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const preGeneratedPrompts = [
  "Explain in simpler terms",
  "Common use cases",
  "Synonyms",
  "Etymology",
  "Explain in Chinese",
]

type Message = {
  content: string
  sender: 'user' | 'ai'
}

export default function ChatPage() {
  const [currentWord, setCurrentWord] = useState('')
  const [wordId, setWordId] = useState<string | null>(null)
  const { word } = useParams()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (word) {
      setCurrentWord(decodeURIComponent(word as string))
    }
    const id = searchParams.get('id')
    if (id) {
      setWordId(id)
    }
  }, [word, searchParams])

  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")

  const sendMessage = async (content: string) => {
    const newMessage: Message = { content, sender: 'user' }
    setMessages(prev => [...prev, newMessage])

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
        model: process.env.NEXT_PUBLIC_API_MODEL,
        messages: [
          {
            role: "user",
            content: `Tell me about the word "${currentWord}" in relation to: ${content}, use simple and concise language.`
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const aiResponse: Message = {
        content: response.data.choices[0].message.content.trim(),
        sender: 'ai'
      }
      console.log('aiResponse', aiResponse)

      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        content: 'Sorry, there was an error processing your request.',
        sender: 'ai'
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setInputMessage("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      sendMessage(inputMessage)
    }
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl flex flex-col">
      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="p-0.5" asChild>
              <Link href={`/word/${wordId}`}>
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back to {currentWord}</span>
              </Link>
            </Button>
            <CardTitle className="text-3xl font-bold px-2">
              {currentWord}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow flex flex-col p-4">
          <ScrollArea className="flex-grow mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {message.content}
                </span>
              </div>
            ))}
          </ScrollArea>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {preGeneratedPrompts.map((prompt, index) => (
                <Button key={index} variant="outline" onClick={() => sendMessage(prompt)} className="text-sm">
                  {prompt}
                </Button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
              />
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
