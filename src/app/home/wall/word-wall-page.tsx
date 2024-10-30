'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useConfig } from '@/hooks/useConfig'

interface Word {
  id: number
  word: string
  size: string
}

const DEFAULT_WORDS: Word[] = [
  { id: 1, word: "African Bush Elephant", size: "0.8" },
  { id: 2, word: "Bengal Tiger", size: "0.7" },
  { id: 3, word: "Mountain Gorilla", size: "0.9" },
  { id: 5, word: "Emperor Penguin", size: "0.75" },
  { id: 6, word: "Bottlenose Dolphin", size: "0.5" },
  { id: 7, word: "Red Kangaroo", size: "0.65" },
  { id: 8, word: "Giant Panda", size: "0.55" },
  { id: 9, word: "White Rhinoceros", size: "0.85" },
  { id: 10, word: "Siberian Tiger", size: "0.7" },
  { id: 11, word: "Australian Sea Lion", size: "0.6" },
  { id: 12, word: "Reticulated Giraffe", size: "0.8" },
  { id: 13, word: "Komodo Dragon", size: "0.5" },
  { id: 14, word: "Polar Bear", size: "0.7" },
  { id: 15, word: "Galapagos Tortoise", size: "0.6" },
  { id: 16, word: "Golden Eagle", size: "0.75" },
  { id: 17, word: "Grey Wolf", size: "0.65" },
  { id: 18, word: "Grizzly Bear", size: "0.55" },

];

export default function WordWall() {
  const { config } = useConfig()
  const [words, setWords] = useState<Word[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words?limit=18&sort=most-edited&knowledge_base=${config.knowledgeBase}`)
        if (!response.ok) {
          throw new Error('Failed to fetch words')
        }
        const data = await response.json()
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid data format')
        }
        setWords(data)
      } catch (error) {
        console.error('Error fetching words:', error)
        setWords(DEFAULT_WORDS)
      } finally {
        setIsLoading(false)
      }
    }

    if (config.baseUrl) {
      fetchWords()
    } else {
      setWords(DEFAULT_WORDS)
      setIsLoading(false)
    }
  }, [config.baseUrl])

  return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-4" style={{ minHeight: '70vh' }}>
          {words.map((word, index) => {
            const fontSize = Math.max(1, Math.min(3, Math.random() * 2 + 1))
            return (
              <Button
                key={index}
                variant="outline"
                className="rounded-lg transition-all hover:bg-primary hover:text-primary-foreground"
                style={{
                  fontSize: `${fontSize}rem`,
                  padding: `${fontSize * 0.5}rem ${fontSize * 0.75}rem`,
                }}
              >
                {word.word}
              </Button>
            )
            })}
          </div>
        )}
      </main>
  )
}
