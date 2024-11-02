'use client'

import { useState } from 'react'
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
import {
  Card,
  CardContent,
} from "@/components/ui/card"

// Mock data for demonstration
const mockResults = [
  {
    id: 1,
    word: "Transformer Model",
    explanation: "A neural network architecture that uses self-attention mechanisms for processing sequential data.",
    knowledgeBase: "Machine Learning",
    editTime: "Recent"
  },
  {
    id: 2,
    word: "Gradient Descent",
    explanation: "An optimization algorithm used to minimize the loss function in machine learning models.",
    knowledgeBase: "Optimization",
    editTime: "This Week"
  },
  {
    id: 3,
    word: "Convolutional Neural Network",
    explanation: "A type of deep learning model particularly effective for image processing and computer vision tasks.",
    knowledgeBase: "Deep Learning",
    editTime: "This Month"
  },
]

const knowledgeBases = ["All", "Machine Learning", "Optimization", "Deep Learning"]
const timeRanges = ["All Time", "Recent", "This Week", "This Month", "This Year"]

export default function SearchResults() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState('All')
  const [selectedTimeRange, setSelectedTimeRange] = useState('All Time')
  const [results, setResults] = useState(mockResults)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter results based on search term, knowledge base, and edit time
    const filtered = mockResults.filter(result => 
      (result.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
       result.explanation.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedKnowledgeBase === 'All' || result.knowledgeBase === selectedKnowledgeBase) &&
      (selectedTimeRange === 'All Time' || result.editTime === selectedTimeRange)
    )
    setResults(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">AI Concepts Search</h1>
        
        <form onSubmit={handleSearch} className="space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="flex space-x-4">
            <Select value={selectedKnowledgeBase} onValueChange={setSelectedKnowledgeBase}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Knowledge Base" />
              </SelectTrigger>
              <SelectContent>
                {knowledgeBases.map((kb) => (
                  <SelectItem key={kb} value={kb}>{kb}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((tr) => (
                  <SelectItem key={tr} value={tr}>{tr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="space-y-4">
          {results.map((result) => (
            <Card key={result.id}>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-2">{result.word}</h3>
                <p className="text-gray-600">{result.explanation}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {results.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No results found. Try adjusting your search or filters.</p>
        )}
      </main>
    </div>
  )
}