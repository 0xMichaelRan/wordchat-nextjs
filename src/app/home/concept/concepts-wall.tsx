'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const aiConcepts = [
  { id: 2, word: "Embedding", size: "0.80" },
  { id: 3, word: "Attention Mechanism", size: "0.87" },
  { id: 4, word: "Transformer Model", size: "0.80" },
  { id: 5, word: "BERT (Bidirectional Encoder Representations from Transformers)", size: "0.72" },
  { id: 6, word: "GPT (Generative Pre-trained Transformer)", size: "0.79" },
  { id: 7, word: "Fine-Tuning", size: "0.86" },
  { id: 8, word: "Pre-training", size: "0.65" },
  { id: 9, word: "Masked Language Model", size: "0.78" },
  { id: 10, word: "Sequence-to-Sequence Model", size: "0.76" },
  { id: 11, word: "Beam Search", size: "0.99" },
  { id: 12, word: "Greedy Decoding", size: "0.81" },
  { id: 13, word: "Self-Attention", size: "0.54" },
  { id: 14, word: "Cross-Attention", size: "0.75" },
  { id: 15, word: "Positional Encoding", size: "0.95" },
  { id: 16, word: "Layer Normalization", size: "0.61" },
  { id: 17, word: "Dropout", size: "0.97" },
  { id: 18, word: "Residual Connection", size: "0.51" },
  { id: 19, word: "Feedforward Neural Network", size: "0.84" },
  { id: 20, word: "Softmax Function", size: "0.90" },
  { id: 1, word: "Tokenization", size: "0.68" }
]

const getRandomPosition = (size: number) => {
  // Ensure we have access to window object
  if (typeof window === 'undefined') return { x: 0, y: 0 }
  
  // Account for padding and safe margins
  const padding = 20
  const maxWidth = window.innerWidth - size - (padding * 2)
  const maxHeight = window.innerHeight - size - (padding * 2)
  
  return {
    x: Math.max(padding, Math.random() * maxWidth),
    y: Math.max(padding, Math.random() * maxHeight)
  }
}

const getRandomSize = (baseSize: string) => {
  // Convert string to number and map from 0.51-0.99 range to 50-200 range
  const size = parseFloat(baseSize)
  const minInputSize = 0.51
  const maxInputSize = 0.99
  const minOutputSize = 50
  const maxOutputSize = 200
  
  const normalizedSize = (size - minInputSize) / (maxInputSize - minInputSize)
  return Math.floor(minOutputSize + (normalizedSize * (maxOutputSize - minOutputSize)))
}

const getRandomColor = () => {
  const colors = ['bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500']
  return colors[Math.floor(Math.random() * colors.length)]
}

export default function ConceptsWall() {
  const [filteredConcepts, setFilteredConcepts] = useState(aiConcepts.map(concept => ({
    id: concept.id,
    word: concept.word,
    size: getRandomSize(concept.size),
    color: getRandomColor(),
    position: getRandomPosition(88)
  })))

  useEffect(() => {
    const handleResize = () => {
      setFilteredConcepts(prevConcepts =>
        prevConcepts.map(concept => ({
          ...concept,
          position: getRandomPosition(88)
        }))
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setFilteredConcepts(
      aiConcepts
        .map(concept => ({
          id: concept.id,
          word: concept.word,
          size: getRandomSize(concept.size),
          color: getRandomColor(),
          position: getRandomPosition(88)
        }))
    )
  }, [])

  return (
    <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative h-screen">
      <div className="relative w-full h-full">
        {filteredConcepts.map((concept, index) => (
          <motion.div
            key={concept.word}
            className={`${concept.color} rounded-full absolute flex items-center justify-center text-center cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10`}
            style={{
              width: `${concept.size}px`,
              height: `${concept.size}px`,
              fontSize: `${concept.size / 10}px`,
              left: concept.position.x,
              top: concept.position.y,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.1, zIndex: 1 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
          >
            <Link href={`/word/${concept.id}`} className="font-semibold p-2">
              {concept.word}
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
