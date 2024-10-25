"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

const words = [
  "ReactJs", "JavaScript", "TypeScript", "HTML", "CSS", "Node.js", "Express",
  "MongoDB", "GraphQL", "Redux", "Vue", "Angular", "Next.js", "Docker", "AWS"
]

export default function WordSpherePage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const minDimension = Math.min(windowSize.width, windowSize.height)
  const radius = minDimension * 0.3 // Reduced radius for better fit on small screens

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 overflow-hidden">
      <div 
        className="relative"
        style={{
          width: `${minDimension}px`,
          height: `${minDimension}px`,
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {words.map((word, index) => {
          const phi = Math.acos(-1 + (2 * index) / words.length)
          const theta = Math.sqrt(words.length * Math.PI) * phi

          // Add randomness to the position
          const randomFactor = Math.random() * 0.2 + 0.9 // Random factor between 0.9 and 1.1
          const x = radius * randomFactor * Math.cos(theta) * Math.sin(phi)
          const y = radius * randomFactor * Math.sin(theta) * Math.sin(phi)
          const z = radius * randomFactor * Math.cos(phi)

          // Adjust font size based on screen size
          const baseFontSize = Math.max(16, Math.floor(minDimension / 25))
          const fontSizeVariation = Math.random() * (baseFontSize / 2)
          const fontSize = Math.max(baseFontSize, Math.floor(baseFontSize + fontSizeVariation - Math.abs(z) / 15))

          return (
            <Link
              href={`/word/${index + 1}`} // Assuming each word has a unique ID starting from 1
              key={word}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:text-yellow-300 hover:scale-110"
              style={{
                transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                fontSize: `${fontSize}px`,
                opacity: (fontSize - baseFontSize + baseFontSize / 2) / (baseFontSize / 2),
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {word}
            </Link>
          )
        })}
      </div>
    </div>
  )
}