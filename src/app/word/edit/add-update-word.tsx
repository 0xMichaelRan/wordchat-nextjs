'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter, useParams } from 'next/navigation'

const knowledgeBases = ["LLM", "University"]

interface WordData {
  word: string
  explain: string
  details: string | null
  knowledge_base: string
}

const testData: WordData = {
  word: "Transformer",
  explain: "A deep learning model architecture that uses self-attention mechanisms to process sequential data.",
  details: "Introduced in the 'Attention Is All You Need' paper, Transformers have become the foundation for many state-of-the-art NLP models like BERT and GPT.",
  knowledge_base: "LLM"
}

export default function AddUpdateWord() {
  const router = useRouter()
  const { id } = useParams()

  const [wordData, setWordData] = useState<WordData>(testData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (id) {
      // Fetch existing word data if we're updating
      setIsLoading(true)
      // Simulating API call with setTimeout
      setTimeout(() => {
        setWordData(testData)
        setIsLoading(false)
      }, 1000)
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setWordData(prev => ({ ...prev, knowledge_base: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulating API call with setTimeout
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: id ? "Word Updated" : "Word Added",
        description: `Successfully ${id ? 'updated' : 'added'} the word "${wordData.word}"`,
      })
      router.push('/words') // Redirect to words list page
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center">{id ? 'Update Word' : 'Add New Word'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="word" className="text-lg">Word</Label>
              <Input
                id="word"
                name="word"
                value={wordData.word}
                onChange={handleInputChange}
                required
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="explain" className="text-lg">Explanation</Label>
              <Textarea
                id="explain"
                name="explain"
                value={wordData.explain}
                onChange={handleInputChange}
                required
                className="min-h-[100px] text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details" className="text-lg">Details (optional)</Label>
              <Textarea
                id="details"
                name="details"
                value={wordData.details || ''}
                onChange={handleInputChange}
                className="min-h-[150px] text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="knowledge_base" className="text-lg">Knowledge Base</Label>
              <Select
                value={wordData.knowledge_base}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="knowledge_base" className="text-lg">
                  <SelectValue placeholder="Select a knowledge base" />
                </SelectTrigger>
                <SelectContent>
                  {knowledgeBases.map((kb) => (
                    <SelectItem key={kb} value={kb} className="text-lg">
                      {kb.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
              {isLoading ? 'Processing...' : id ? 'Update Word' : 'Add Word'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}