'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useConfig } from '@/hooks/useConfig'

const defaultBricks = [
  { id: 1, word: "Orangutan", size: "0.68" },
  { id: 2, word: "Chimpanzee", size: "0.80" },
  { id: 3, word: "African Bush Elephant", size: "0.87" },
  { id: 4, word: "Bengal Tiger", size: "0.80" },
  { id: 5, word: "Mountain Gorilla", size: "0.72" },
  { id: 6, word: "Emperor Penguin", size: "0.79" },
  { id: 7, word: "Bottlenose Dolphin", size: "0.86" },
  { id: 8, word: "Red Kangaroo", size: "0.65" },
  { id: 9, word: "Giant Panda", size: "0.78" },
  { id: 10, word: "White Rhinoceros", size: "0.76" },
  { id: 11, word: "Siberian Tiger", size: "0.99" },
  { id: 12, word: "Australian Sea Lion", size: "0.81" },
  { id: 13, word: "Reticulated Giraffe", size: "0.54" },
  { id: 14, word: "Komodo Dragon", size: "0.75" },
  { id: 15, word: "Galapagos Tortoise", size: "0.95" },
  { id: 16, word: "Golden Eagle", size: "0.61" },
  { id: 17, word: "Grey Wolf", size: "0.97" },
  { id: 18, word: "Grizzly Bear", size: "0.51" },
  { id: 19, word: "California Sea Lion", size: "0.84" },
  { id: 20, word: "Snow Leopard", size: "0.90" },
]

const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 80%)`
}

export default function WallBricks() {
  const { config, saveConfig } = useConfig()
  const [bricks, setBricks] = useState(defaultBricks.map(concept => ({
    ...concept,
    color: getRandomColor(),
  })))

  useEffect(() => {
    const fetchBricksData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words?limit=20&sort=most-edited&knowledge_base=${config.knowledgeBase}`);
        const data = await response.json();
        setBricks(data.map((word: any) => ({
          ...word,
          color: getRandomColor(),
        })));
      } catch (error) {
        console.error('Error fetching wall bricks data:', error);
        // If fetch fails, the default bricks will remain
      }
    };

    fetchBricksData();
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
                    height: `${Number(brick.size) * 100}px`,
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