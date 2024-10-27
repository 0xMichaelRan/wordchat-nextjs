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
  { id: 1, word: "Machine Learning", size: "0.8" },
  { id: 2, word: "Neural Networks", size: "0.7" },
  { id: 3, word: "Deep Learning", size: "0.9" },
  { id: 5, word: "Data Science", size: "0.75" },
  { id: 6, word: "Python", size: "0.5" },
  { id: 7, word: "TensorFlow", size: "0.65" },
  { id: 8, word: "PyTorch", size: "0.55" },
  { id: 9, word: "Computer Vision", size: "0.85" },
  { id: 10, word: "NLP", size: "0.7" },
  { id: 11, word: "Robotics", size: "0.6" },
  { id: 12, word: "Reinforcement Learning", size: "0.8" },
  { id: 13, word: "Statistics", size: "0.5" },
  { id: 14, word: "Big Data", size: "0.7" },
  { id: 15, word: "Cloud Computing", size: "0.6" },
  { id: 16, word: "Ethics in AI", size: "0.75" },
  { id: 17, word: "Algorithm", size: "0.65" },
  { id: 18, word: "Data Mining", size: "0.55" },
];

export default function WordWall() {
  const { config } = useConfig()
  const [words, setWords] = useState<Word[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words?limit=20&sort=random`)
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
          <div className="flex flex-wrap gap-4 justify-center">
            {words.map((word) => {
              const fontSize = Math.max(14, Math.min(30, parseFloat(word.size) * 30))
              const minWidth = 120
              const maxWidth = 300
                
              return (
                <Link
                  key={word.id}
                  href={`/word/${word.id}`}
                  className="bg-accent text-accent-foreground shadow-md flex items-center justify-center text-center transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
                  style={{
                    width: `${Math.max(fontSize * 6, word.word.length * fontSize * 0.66)}px`,
                    height: `${fontSize * 3}px`,
                    fontSize: `${fontSize}px`,
                    borderRadius: `${fontSize * 0.88}px`,
                    padding: `${fontSize / 2}px`,
                  }}
                >
                  <span className="break-words">{word.word}</span>
                </Link>
              )
            })}
          </div>
        )}
      </main>
  )
}
