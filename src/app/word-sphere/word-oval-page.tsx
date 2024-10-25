"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Word {
  id: number;
  word: string;
  size: string;
}

const colors = [
  'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900',
  'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900'
]

export default function WordBubblePage() {
  const [words, setWords] = useState<Word[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/words?limit=20&sort=random');
        if (!response.ok) {
          throw new Error('Failed to fetch words');
        }
        const data = await response.json();
        setWords(data);
      } catch (error) {
        console.error('Error fetching words:', error);
        // You might want to set some default words here or show an error message
      }
    };

    fetchWords();
  }, []);

  const containerWidth = windowSize.width * 0.9
  const containerHeight = windowSize.height * 0.8

  const placeBubbles = () => {
    const bubbles: JSX.Element[] = []
    const placedBubbles: { x: number, y: number, width: number, height: number }[] = []

    const checkCollision = (x: number, y: number, width: number, height: number) => {
      for (const bubble of placedBubbles) {
        if (
          x < bubble.x + bubble.width &&
          x + width > bubble.x &&
          y < bubble.y + bubble.height &&
          y + height > bubble.y
        ) {
          return true // Collision detected
        }
      }
      return false // No collision
    }

    words.forEach((word, index) => {
      const size = parseFloat(word.size)
      const bubbleSize = Math.max(80, Math.min(200, size * 250)) // Min 50px, max 200px
      let x, y, attempts = 0

      do {
        x = Math.random() * (containerWidth - bubbleSize)
        y = Math.random() * (containerHeight - bubbleSize)
        attempts++
      } while (checkCollision(x, y, bubbleSize, bubbleSize) && attempts < 50)

      if (attempts < 50) {
        placedBubbles.push({ x, y, width: bubbleSize, height: bubbleSize })

        bubbles.push(
          <Link
            key={word.id}
            href={`/word/${word.id}`}
            className={`absolute rounded-full flex items-center justify-center p-4 text-white font-bold transition-all duration-300 hover:scale-110 cursor-pointer ${colors[index % colors.length]}`}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${bubbleSize}px`,
              height: `${bubbleSize}px`,
              fontSize: `${Math.max(12, size * 24)}px`,
            }}
          >
            {word.word}
          </Link>
        )
      }
    })

    return bubbles
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="relative"
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
        }}
      >
        {placeBubbles()}
      </div>
    </div>
  )
}
