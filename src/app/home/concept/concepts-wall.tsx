'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const aiConcepts = [
  { id: 2, word: "Embedding", size: "0.80" },
  { id: 3, word: "Attention Mechanism", size: "0.87" },
  { id: 4, word: "Transformer Model", size: "0.80" },
  { id: 5, word: "BERT (Bidirectional Encoder Representations from Transformers)", size: "0.72" },
  { id: 6, word: "GPT (Generative Pre-trained Transformer)", size: "0.79" },
  // { id: 7, word: "Fine-Tuning", size: "0.86" },
  // { id: 8, word: "Pre-training", size: "0.65" },
  // { id: 9, word: "Masked Language Model", size: "0.78" },
  // { id: 10, word: "Sequence-to-Sequence Model", size: "0.76" },
  // { id: 11, word: "Beam Search", size: "0.99" },
  // { id: 12, word: "Greedy Decoding", size: "0.81" },
  // { id: 13, word: "Self-Attention", size: "0.54" },
  // { id: 14, word: "Cross-Attention", size: "0.75" },
  // { id: 15, word: "Positional Encoding", size: "0.95" },
  // { id: 16, word: "Layer Normalization", size: "0.61" },
  // { id: 17, word: "Dropout", size: "0.97" },
  // { id: 18, word: "Residual Connection", size: "0.51" },
  // { id: 19, word: "Feedforward Neural Network", size: "0.84" },
  // { id: 20, word: "Softmax Function", size: "0.90" },
  // { id: 1, word: "Tokenization", size: "0.68" }
]

const getRandomPosition = (size: number) => {
  if (typeof window === 'undefined') return { x: 0, y: 0 }

  const padding = 30
  const maxWidth = window.innerWidth - size - (padding * 1)
  const maxHeight = window.innerHeight - size - (padding * 1)

  return {
    x: Math.max(padding / 10, Math.random() * maxWidth),
    y: Math.max(padding / 10, Math.random() * maxHeight)
  }
}

const getRandomSize = (baseSize: string) => {
  const size = parseFloat(baseSize)
  const minInputSize = 0.51
  const maxInputSize = 0.99
  const minOutputSize = 88
  const maxOutputSize = 188

  const normalizedSize = (size - minInputSize) / (maxInputSize - minInputSize)
  return Math.floor(minOutputSize + (normalizedSize * (maxOutputSize - minOutputSize)))
}

const getRandomColor = () => {
  const colors = ['bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500']
  return colors[Math.floor(Math.random() * colors.length)]
}

export default function ConceptsWall() {
  const [concepts, setConcepts] = useState(aiConcepts.map(concept => ({
    id: concept.id,
    word: concept.word,
    size: getRandomSize(String(concept.size)),
    color: getRandomColor(),
    position: getRandomPosition(88),
    visible: true,
    zIndex: 0
  })))

  useEffect(() => {

    const fetchWords = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words?limit=20&sort=most-edited`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        setConcepts(data.map((word: any) => ({
          id: word.id,
          word: word.word,
          size: getRandomSize(word.size),
          color: getRandomColor(),
          position: getRandomPosition(88),
          visible: true,
          zIndex: 0
        })));
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    fetchWords();

    const handleResize = () => {
      setConcepts(prevConcepts =>
        prevConcepts.map(concept => ({
          ...concept,
          position: getRandomPosition(concept.size)
        }))
      )
    }

    window.addEventListener('resize', handleResize)

    const timer = setInterval(() => {
      setConcepts(prevConcepts => {
        const indexToToggle = Math.floor(Math.random() * prevConcepts.length)
        return prevConcepts.map((concept, index) =>
          index === indexToToggle
            ? { ...concept, visible: false }
            : concept
        )
      })

      setTimeout(() => {
        setConcepts(prevConcepts => {
          const hiddenConceptIndex = prevConcepts.findIndex(c => !c.visible)
          if (hiddenConceptIndex !== -1) {
            const maxZIndex = Math.max(...prevConcepts.map(c => c.zIndex))
            return prevConcepts.map((concept, index) =>
              index === hiddenConceptIndex
                ? {
                  ...concept,
                  visible: true,
                  position: getRandomPosition(concept.size),
                  zIndex: maxZIndex + 1
                }
                : concept
            )
          }
          return prevConcepts
        })
      }, 1000)
    }, 2000 + Math.floor(Math.random() * 2000))

    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(timer)
    }
  }, [])

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <AnimatePresence>
        {concepts.map((concept) => (
          concept.visible && (
            <motion.div
              key={concept.id}
              className={`${concept.color} rounded-full absolute flex items-center justify-center text-center cursor-pointer transition-all duration-300 hover:scale-110`}
              style={{
                width: `${concept.size}px`,
                height: `${concept.size}px`,
                fontSize: `${concept.size / 10}px`,
                x: concept.position.x,
                y: concept.position.y,
                zIndex: concept.zIndex
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, zIndex: 9999 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
            >
              <Link href={`/word/${concept.id}`} className="font-semibold p-2 text-white">
                {concept.word}
              </Link>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </main>
  )
}
