"use client"

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

interface Word {
  id: number;
  text: string;
  size: number;
}

const defaultWords: Word[] = [
  { id: Math.floor(Math.random() * 39) + 1, text: "ReactJs", size: 0.9 },
  { id: Math.floor(Math.random() * 39) + 1, text: "JavaScript", size: 1.0 },
  { id: Math.floor(Math.random() * 39) + 1, text: "TypeScript", size: 0.8 },
  { id: Math.floor(Math.random() * 39) + 1, text: "HTML", size: 0.7 },
  { id: Math.floor(Math.random() * 39) + 1, text: "CSS", size: 0.7 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Node.js", size: 0.85 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Express", size: 0.6 },
  { id: Math.floor(Math.random() * 39) + 1, text: "MongoDB", size: 0.75 },
  { id: Math.floor(Math.random() * 39) + 1, text: "GraphQL", size: 0.7 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Redux", size: 0.65 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Vue", size: 0.6 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Angular", size: 0.7 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Next.js", size: 0.8 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Docker", size: 0.75 },
  { id: Math.floor(Math.random() * 39) + 1, text: "AWS", size: 0.85 },
  { id: Math.floor(Math.random() * 39) + 1, text: "React Native", size: 0.7 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Svelte", size: 0.5 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Webpack", size: 0.6 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Jest", size: 0.55 },
  { id: Math.floor(Math.random() * 39) + 1, text: "Cypress", size: 0.5 }
]

export default function WordOvalPage() {
  const [words, setWords] = useState<Word[]>(defaultWords);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const placedWords = useRef<Array<{ x: number, y: number, width: number, height: number }>>([])

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
        console.log("data", data)

        const fetchedWords: Word[] = data.map((word: any) => ({
          id: word.id,
          text: word.word,
          size: word.size
        }));
        setWords(fetchedWords);
      } catch (error) {
        console.error('Error fetching words:', error);
        // Fallback to default words if fetch fails
        setWords(defaultWords);
      }
    };

    fetchWords();
  }, []);

  const aspectRatio = windowSize.width / windowSize.height
  const ovalWidth = Math.min(windowSize.width * 0.95, 888)
  const ovalHeight = ovalWidth / aspectRatio / 1.3

  const checkCollision = (x: number, y: number, width: number, height: number) => {
    for (const word of placedWords.current) {
      if (
        x < word.x + word.width &&
        x + width > word.x &&
        y < word.y + word.height &&
        y + height > word.y
      ) {
        return true // Collision detected
      }
    }
    return false // No collision
  }

  const renderWords = (startIndex: number, endIndex: number, radiusMultiplier: number) => {
    placedWords.current = [] // Reset placed words for each render

    return words.slice(startIndex, endIndex).map((word, index, array) => {
      const minFontSize = Math.max(12, ovalWidth / 30)
      const maxFontSize = Math.max(48, ovalWidth / 10)
      const sizeFactor = Math.pow(word.size, 1.5)
      const fontSize = minFontSize + (maxFontSize - minFontSize) * sizeFactor

      // Estimate word dimensions (you may need to adjust these values)
      const wordWidth = fontSize * word.text.length * 0.6
      const wordHeight = fontSize * 1.2

      let x, y, attempts = 0
      do {
        const angle = ((index + attempts) / array.length) * 2 * Math.PI
        x = (Math.cos(angle) * ovalWidth * 0.45 * radiusMultiplier) + (ovalWidth * 0.1 * (Math.random() - 0.5))
        y = -88 + (Math.sin(angle) * ovalHeight * 0.45 * radiusMultiplier) + (ovalHeight * 0.1 * (Math.random() - 0.5))
        attempts++
      } while (checkCollision(x + ovalWidth / 2 - wordWidth / 2, y + ovalHeight / 2 - wordHeight / 2, wordWidth, wordHeight) && attempts < 50)

      if (attempts < 50) {
        placedWords.current.push({
          x: x + ovalWidth / 2 - wordWidth / 2,
          y: y + ovalHeight / 2 - wordHeight / 2,
          width: wordWidth,
          height: wordHeight
        })
      } else {
        console.warn(`Could not place word: ${word.text}`)
        return null // Skip this word if we can't place it after 50 attempts
      }

      const distanceFromCenter = Math.sqrt(Math.pow(x / (ovalWidth / 2), 2) + Math.pow(y / (ovalHeight / 2), 2))

      return (
        <Link
          key={word.text}
          href={`/word/${word.id}`}
          className="absolute cursor-pointer transition-all duration-300 hover:text-yellow-300 hover:scale-110"
          style={{
            left: `${x + ovalWidth / 2}px`,
            top: `${y + ovalHeight / 2}px`,
            transform: 'translate(-50%, -50%)',
            fontSize: `${fontSize}px`,
            opacity: 1 - distanceFromCenter * 0.2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
          }}
        >
          {word.text}
        </Link>
      )
    }).filter(Boolean) // Remove any null elements (words that couldn't be placed)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 overflow-hidden">
      <div 
        className="relative"
        style={{
          width: `${ovalWidth}px`,
          height: `${ovalHeight}px`,
        }}
      >
        {renderWords(0, Math.floor(words.length / 2), 1)} {/* Outer layer */}
        {renderWords(Math.floor(words.length / 2), words.length, 0.6)} {/* Inner layer */}
      </div>
    </div>
  )
}
