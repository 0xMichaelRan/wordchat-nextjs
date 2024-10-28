'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Search, Brain } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'AI Concepts', href: '/ai-concepts' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const aiConcepts = [
  "Mean Squared Error",
  "Activation Function",
  "Euclidean Distance",
  "Conversational Agents",
  "Reward Function",
  "Biomedical Imaging",
  "Web Mining",
  "Object Detection",
  "Named Entity Recognition",
  "Silhouette Score",
  "L1 Regularization",
  "Gini Impurity",
  "Mean Absolute Error",
  "Underfitting",
  "Graph Neural Networks",
  "Sequence-to-Sequence Model",
  "Self-Supervised Learning",
  "Feature Scaling",
  "Knowledge Graph",
  "F1 Score"
]

const getRandomPosition = (size: number) => {
  const maxWidth = typeof window !== 'undefined' ? window.innerWidth - size : 1000
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight - size : 1000
  return {
    x: Math.random() * maxWidth,
    y: Math.random() * maxHeight
  }
}

const getRandomSize = () => {
  return Math.floor(Math.random() * (200 - 100 + 1) + 100)
}

const getRandomColor = () => {
  const colors = ['bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500']
  return colors[Math.floor(Math.random() * colors.length)]
}

export default function ConceptsWall() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredConcepts, setFilteredConcepts] = useState(aiConcepts.map(concept => ({
    text: concept,
    size: getRandomSize(),
    color: getRandomColor(),
    position: getRandomPosition(200)
  })))

  useEffect(() => {
    const handleResize = () => {
      setFilteredConcepts(prevConcepts => 
        prevConcepts.map(concept => ({
          ...concept,
          position: getRandomPosition(concept.size)
        }))
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setFilteredConcepts(
      aiConcepts
        .filter(concept => concept.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(concept => ({
          text: concept,
          size: getRandomSize(),
          color: getRandomColor(),
          position: getRandomPosition(200)
        }))
    )
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality is handled by the useEffect above
  }

  return (
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative h-screen">
        <div className="relative w-full h-full">
          {filteredConcepts.map((concept, index) => (
            <motion.div
              key={concept.text}
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
              <span className="font-semibold p-2">{concept.text}</span>
            </motion.div>
          ))}
        </div>
      </main>
  )
}