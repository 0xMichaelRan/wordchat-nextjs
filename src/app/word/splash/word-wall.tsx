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

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Word Wall', href: '/word-wall' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const DEFAULT_WORDS: Word[] = [
  { id: 1, word: "Machine Learning", size: "0.8" },
  { id: 2, word: "Neural Networks", size: "0.7" },
  { id: 3, word: "Deep Learning", size: "0.9" },
  { id: 4, word: "AI", size: "0.6" },
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [words, setWords] = useState<Word[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words?limit=13&sort=latest`)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchTerm)
    // Implement search functionality here
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold">
                Word Wall
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mr-2 w-32 bg-primary-foreground text-primary"
                />
                <Button type="submit" variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>
            </div>
            <div className="md:hidden flex items-center">
              <form onSubmit={handleSearch} className="flex items-center mr-2">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-24 bg-primary-foreground text-primary"
                />
                <Button type="submit" variant="secondary" size="icon" className="ml-2">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Word Wall</h1>
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
              const width = Math.max(minWidth, Math.min(maxWidth, word.word.length * fontSize * 0.8))
              const height = Math.max(60, fontSize * 2.5)

              return (
                <Link
                  key={word.id}
                  href={`/word/${word.id}`}
                  className="bg-accent text-accent-foreground shadow-md flex items-center justify-center text-center transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    fontSize: `${fontSize}px`,
                    borderRadius: `${Math.min(height / 2, 20)}px`,
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
    </div>
  )
}
