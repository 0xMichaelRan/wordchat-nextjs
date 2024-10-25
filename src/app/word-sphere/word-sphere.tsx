"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
const words = [
  "ReactJs", "JavaScript", "TypeScript", "HTML", "CSS", "Node.js", "Express",
  "MongoDB", "GraphQL", "Redux", "Vue", "Angular", "Next.js", "Docker", "AWS"
]

export default function WordSphere() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const radius = Math.min(windowSize.width, windowSize.height) * 0.35

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 overflow-hidden">
      <div 
        className="relative w-full h-full"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {words.map((word, index) => {
          const phi = Math.acos(-1 + (2 * index) / words.length)
          const theta = Math.sqrt(words.length * Math.PI) * phi

          // Add randomness to the position
          const randomFactor = Math.random() * 0.3 + 0.85 // Random factor between 0.85 and 1.15
          const x = radius * randomFactor * Math.cos(theta) * Math.sin(phi)
          const y = radius * randomFactor * Math.sin(theta) * Math.sin(phi)
          const z = radius * randomFactor * Math.cos(phi)

          // Make font size more variable
          const baseFontSize = 24 // Increased base font size
          const fontSizeVariation = Math.random() * 16 // Random variation up to 16px
          const fontSize = Math.max(baseFontSize, Math.floor(baseFontSize + fontSizeVariation - Math.abs(z) / 10))

          return (
            <Link
              href={`/word/${index + 1}`} // Assuming each word has a unique ID starting from 1
              key={word}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:text-yellow-300 hover:scale-110"
              style={{
                transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                fontSize: `${fontSize}px`,
                opacity: (fontSize - baseFontSize + 16) / 16,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
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