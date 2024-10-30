'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

const aiConcepts = [
  { id: 1, word: "African Bush Elephant" },
  { id: 2, word: "Chimpanzee" },
  { id: 3, word: "Bengal Tiger" },
  { id: 4, word: "Mountain Gorilla" },
  { id: 5, word: "Emperor Penguin" },
  { id: 6, word: "Bottlenose Dolphin" },
  { id: 7, word: "Red Kangaroo" },
  { id: 8, word: "Giant Panda" },
  { id: 9, word: "White Rhinoceros" },
  { id: 10, word: "Siberian Tiger" },
  { id: 11, word: "Australian Sea Lion" },
  { id: 12, word: "Reticulated Giraffe" },
  { id: 13, word: "Komodo Dragon" },
  { id: 14, word: "Galapagos Tortoise" },
  { id: 15, word: "Golden Eagle" },
  { id: 16, word: "Grey Wolf" },
  { id: 17, word: "Grizzly Bear" },
  { id: 18, word: "California Sea Lion" },
  { id: 19, word: "Snow Leopard" },
  { id: 20, word: "Orangutan" },
]

const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 80%)`
}

export default function WallBricks() {
  const [bricks, setBricks] = useState(aiConcepts.map(concept => ({
    ...concept,
    color: getRandomColor(),
  })))

  useEffect(() => {
    const handleResize = () => {
      // Trigger re-render on resize to adjust brick layout
      setBricks(prevBricks => [...prevBricks])
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center">
          {bricks.map((brick, index) => (
            <motion.div
              key={brick.id}
              className="m-1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/word/${brick.id}`}>
                <div
                  className="brick cursor-pointer text-center p-4 rounded shadow-md transition-transform hover:scale-105"
                  style={{
                    backgroundColor: brick.color,
                    width: `${Math.max(100, brick.word.length * 12)}px`,
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${Math.max(12, Math.min(18, 200 / brick.word.length))}px`,
                  }}
                >
                  {brick.word}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Link href="/add-word" passHref>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          aria-label="Add new word"
        >
          <Plus className="w-8 h-8 text-white" />
        </Button>
      </Link>
    </div>
  )
}