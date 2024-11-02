'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for demonstration
const mockResults = [
  {
    id: 1,
    title: "Transformer Model",
    explanation: "A neural network architecture that uses self-attention mechanisms for processing sequential data.",
    details: "Introduced in the 'Attention Is All You Need' paper, Transformers have become the foundation for many state-of-the-art NLP models.",
    knowledgeBase: "Machine Learning"
  },
  {
    id: 2,
    title: "Gradient Descent",
    explanation: "An optimization algorithm used to minimize the loss function in machine learning models.",
    details: "It works by iteratively adjusting the model's parameters in the direction of steepest descent of the loss function.",
    knowledgeBase: "Optimization"
  },
  {
    id: 3,
    title: "Convolutional Neural Network",
    explanation: "A type of deep learning model particularly effective for image processing and computer vision tasks.",
    details: "CNNs use convolutional layers to automatically and adaptively learn spatial hierarchies of features from input images.",
    knowledgeBase: "Deep Learning"
  },
  // Add more mock results here to demonstrate the concise list
]

const knowledgeBases = ["All", "Machine Learning", "Optimization", "Deep Learning"]

export default function SearchResults() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState('All')
  const [results, setResults] = useState(mockResults)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchFormRef = useRef<HTMLFormElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filtered = mockResults.filter(result => 
      (result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       result.explanation.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedKnowledgeBase === 'All' || result.knowledgeBase === selectedKnowledgeBase)
    )
    setResults(filtered)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-8">
          <Input
            type="search"
            placeholder="Search concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-white text-black placeholder-gray-500"
          />
          <Button type="submit" variant="outline" className="bg-white text-black hover:bg-gray-200">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Search Results</h2>
        <ul className="space-y-4">
          {results.map((result) => (
            <li key={result.id} className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold">{result.title}</h3>
              <p className="text-sm text-gray-600">{result.knowledgeBase}</p>
              <p className="mt-1 text-gray-800">{result.explanation.split('.')[0]}.</p>
              <p className="mt-1 text-sm text-gray-600">{result.details.split('.')[0]}.</p>
            </li>
          ))}
        </ul>
        {results.length === 0 && (
          <p className="text-center text-gray-600 mt-8">No results found. Try adjusting your search or filter.</p>
        )}
      </main>
    </div>
  )
}