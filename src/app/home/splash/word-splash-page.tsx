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

const defaultData = [
    { "id": 1, "word": "Machine Learning", "size": "0.584" },
    { "id": 2, "word": "Deep Learning", "size": "0.645" },
    { "id": 3, "word": "Neural Network", "size": "0.510" },
    { "id": 4, "word": "Natural Language Processing", "size": "0.271" },
    { "id": 5, "word": "Computer Vision", "size": "0.228" },
    { "id": 6, "word": "Reinforcement Learning", "size": "0.577" },
    { "id": 7, "word": "Generative AI", "size": "0.41" },
    { "id": 8, "word": "Transformer", "size": "0.382" },
    { "id": 9, "word": "GANs (Generative Adversarial Networks)", "size": "0.838" },
    { "id": 10, "word": "Transfer Learning", "size": "0.57" }
];

export default function WordSplashPage() {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words?limit=20&sort=most-edited`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWords(data);
      } catch (error) {
        console.error('Fetch failed, using default data:', error);
        const data = defaultData;
        setWords(data);
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
      const margin = 18; // Adjust this value to control the strictness of collision detection

      for (const bubble of placedBubbles) {
        if (
          x < bubble.x + bubble.width - margin &&
          x + width > bubble.x + margin &&
          y < bubble.y + bubble.height - margin &&
          y + height > bubble.y + margin
        ) {
          return true; // Collision detected
        }
      }
      return false; // No collision
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
