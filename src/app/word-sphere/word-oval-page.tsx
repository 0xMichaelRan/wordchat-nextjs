"use client"

import { useState, useEffect } from 'react'

// Mock data with backend-provided font size values
const words = [
  { text: "ReactJs", size: 0.9 },
  { text: "JavaScript", size: 1.0 },
  { text: "TypeScript", size: 0.8 },
  { text: "HTML", size: 0.7 },
  { text: "CSS", size: 0.7 },
  { text: "Node.js", size: 0.85 },
  { text: "Express", size: 0.6 },
  { text: "MongoDB", size: 0.75 },
  { text: "GraphQL", size: 0.7 },
  { text: "Redux", size: 0.65 },
  { text: "Vue", size: 0.6 },
  { text: "Angular", size: 0.7 },
  { text: "Next.js", size: 0.8 },
  { text: "Docker", size: 0.75 },
  { text: "AWS", size: 0.85 },
  { text: "React Native", size: 0.7 },
  { text: "Svelte", size: 0.5 },
  { text: "Webpack", size: 0.6 },
  { text: "Jest", size: 0.55 },
  { text: "Cypress", size: 0.5 }
]

export default function WordOvalPage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const aspectRatio = windowSize.width / windowSize.height
  const ovalWidth = Math.min(windowSize.width * 0.9, 1200)
  const ovalHeight = ovalWidth / aspectRatio

  const renderWords = (startIndex: number, endIndex: number, radiusMultiplier: number) => {
    return words.slice(startIndex, endIndex).map((word, index, array) => {
      const angle = (index / array.length) * 2 * Math.PI
      const x = (Math.cos(angle) * ovalWidth * 0.45 * radiusMultiplier) + (ovalWidth * 0.03 * (Math.random() - 0.5))
      const y = (Math.sin(angle) * ovalHeight * 0.45 * radiusMultiplier) + (ovalHeight * 0.03 * (Math.random() - 0.5))

      const distanceFromCenter = Math.sqrt(Math.pow(x / (ovalWidth / 2), 2) + Math.pow(y / (ovalHeight / 2), 2))
      const baseFontSize = Math.max(16, Math.min(32, ovalWidth / 25))
      const fontSize = baseFontSize * word.size

      return (
        <div
          key={word.text}
          className="absolute cursor-pointer transition-all duration-300 hover:text-yellow-300 hover:scale-110"
          style={{
            left: `${x + ovalWidth / 2}px`,
            top: `${y + ovalHeight / 2}px`,
            transform: 'translate(-50%, -50%)',
            fontSize: `${fontSize}px`,
            opacity: 1 - distanceFromCenter * 0.2,
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {word.text}
        </div>
      )
    })
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