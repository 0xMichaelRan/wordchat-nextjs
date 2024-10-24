'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// This would typically come from your app's state or API
const words = ["Serendipity", "Ephemeral", "Eloquent", "Mellifluous", "Surreptitious"]

const preGeneratedPrompts = [
  "Can you explain this word in simpler terms?",
  "What are some common use cases for this word?",
  "Can you use this word in a sentence?",
  "What are some synonyms for this word?",
  "What's the etymology of this word?"
]

type Message = {
  content: string
  sender: 'user' | 'ai'
}

export default function ChatPage() {
  const [currentWord, setCurrentWord] = useState(words[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")

  const sendMessage = (content: string) => {
    const newMessage: Message = { content, sender: 'user' }
    setMessages(prev => [...prev, newMessage])
    // Here you would typically send the message to your AI backend
    // and then add the AI's response to the messages
    // For now, we'll just mock a response
    setTimeout(() => {
      const aiResponse: Message = {
        content: `Here's a response about "${currentWord}" to: ${content}`,
        sender: 'ai'
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
    setInputMessage("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      sendMessage(inputMessage)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Word</Link>
          <div className="flex gap-4">
            <Link href="/?word=jfkd3" className="hover:underline">Word</Link>
            <Link href="/chat" className="hover:underline">Chat</Link>
            <Link href="/config" className="hover:underline">Config</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl flex flex-col">
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-bold">Chat about: {currentWord}</CardTitle>
            <Select onValueChange={setCurrentWord} defaultValue={currentWord}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a word" />
              </SelectTrigger>
              <SelectContent>
                {words.map((word) => (
                  <SelectItem key={word} value={word}>{word}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
    </div>
  )
}