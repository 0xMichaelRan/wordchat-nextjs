'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronDown, ChevronUp, Edit, History, MessageSquare, GitMerge } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface WordData {
  id: number;
  word: string;
  explain: string;
  details: string;
  created_at: string;
}

const defaultResponse: WordData = {
  id: 12,
  word: "Greedy Decoding",
  explain: "A decoding strategy that selects the most probable word at each step in sequence generation.",
  details: "This site can’t be reached192.168.2.172 refused to connect. SQLITE_CONSTRAINT: UNIQUE constraint failed: This site can’t be reached192.168.2.172 refused to connect. SQLITE_CONSTRAINT: UNIQUE constraint failed This site can’t be reached192.168.2.172 refused to connect. SQLITE_CONSTRAINT: UNIQUE constraint failed",
  created_at: "2024-06-25 22:40:19",
};

const defaultRelatedWords = [
  { related_word_id: 2, correlation: 0.8, related_word: "GPT (Generative Pre-trained Transformer)" },
  { related_word_id: 3, correlation: 0.7, related_word: "Sequence-to-Sequence Model" },
  { related_word_id: 6, correlation: 0.6, related_word: "Fine-Tuning" },
  { related_word_id: 10, correlation: 0.5, related_word: "Beam" },
];

const defaultExplainHistory = [
  {
    id: null,
    word_id: 1,
    previous_explain: "Initial explanation for word 3",
    changed_at: "2023-10-03 12:00:00",
  },
  {
    id: null,
    word_id: 1,
    previous_explain: "Initial explanation for word 3",
    changed_at: "2023-10-03 12:00:00",
  },
];


export default function WordPage() {
  const { id } = useParams()
  const [wordData, setWordData] = useState<WordData | null>(null)
  const [relatedWords, setRelatedWords] = useState<{ related_word_id: number; correlation: number; related_word: string }[]>([])
  const [explainHistory, setExplainHistory] = useState<{ id: number | null; word_id: number; previous_explain: string; changed_at: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showDetails, setShowDetails] = useState(false)
  const [isEditingExplain, setIsEditingExplain] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [editedExplain, setEditedExplain] = useState('')
  const [editedDetails, setEditedDetails] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wordResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/${id}`)
        if (!wordResponse.ok) {
          throw new Error('Fetch failed')
        }
        const wordData = await wordResponse.json()
        setWordData(wordData)
        setEditedExplain(wordData.explain)
        setEditedDetails(wordData.details)

        const relatedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/related/${id}`)
        if (!relatedResponse.ok) {
          throw new Error('Fetch related words failed')
        }
        const relatedData = await relatedResponse.json()
        console.log("relatedData", relatedData)
        setRelatedWords(relatedData)

        const historyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/${id}/history`)
        if (!historyResponse.ok) {
          throw new Error('Fetch explain history failed')
        }
        const historyData = await historyResponse.json()
        setExplainHistory(historyData)

      } catch (error) {
        console.error('Error fetching data:', error)
        setWordData(defaultResponse)
        setEditedExplain(defaultResponse.explain)
        setEditedDetails(defaultResponse.details)
        setRelatedWords(defaultRelatedWords)
        setExplainHistory(defaultExplainHistory)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const updateWordData = async (updatedData: Partial<WordData>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const data = await response.json();
      setWordData(data);
    } catch (error) {
      console.error('Error updating word data:', error);
      setError('Failed to update word data');
    }
  };

  const handleEditExplain = () => {
    setIsEditingExplain(true)
  }

  const handleSaveExplain = () => {
    setIsEditingExplain(false)
    updateWordData({ explain: editedExplain });
    console.log("Saving new explain:", editedExplain)
  }

  const handleEditDetails = () => {
    setIsEditingDetails(true)
  }

  const handleSaveDetails = () => {
    setIsEditingDetails(false)
    updateWordData({ details: editedDetails });
    console.log("Saving new details:", editedDetails)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !wordData) {
    return <div>Error: {error || 'Word not found'}</div>
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
      <Card className="mb-6 border-2 shadow-lg">
        <CardHeader className="flex flex-col items-start">
          <CardTitle className="text-3xl font-bold">{wordData.word}</CardTitle>
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/chat/${wordData.word}?id=${wordData.id}`}>
                  <MessageSquare className="h-4 w-4" />
                  <span className="sr-only">Chat about {wordData.word}</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon">
                <GitMerge className="h-4 w-4" />
                <span className="sr-only">Merge {wordData.word}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingExplain ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={editedExplain}
                onChange={(e) => setEditedExplain(e.target.value)}
                className="w-full h-32" // Added height class
                maxLength={188}
              />
              <div className="text-sm text-muted-foreground">
                {editedExplain.length}/188 characters
              </div>
              <Button onClick={handleSaveExplain}>Save Explain</Button>
            </div>
          ) : (
            <p className="text-lg mb-4">
              {editedExplain.split(' ').map((word, index) =>
                ['Tokenization', 'Transformer', 'Fine-Tuning', 'Beam'].includes(word) ?
                  <Badge key={index} variant="outline" className="mx-1">{word}</Badge> :
                  ` ${word} `
              )}
            </p>
          )}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              aria-expanded={showDetails}
              aria-controls="word-details"
              className="text-muted-foreground"
            >
              {showDetails ? "Less" : "More"}
              {showDetails ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
            <div className="flex gap-2 items-center">
              <Button variant="outline" size="icon" onClick={handleEditExplain}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit explain</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <History className="h-4 w-4" />
                    <span className="sr-only">View explain history</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[300px]">
                  {explainHistory.map((explain, index) => (
                    <DropdownMenuItem key={index} className="flex flex-col items-start">
                      <span className="font-medium">{explain.previous_explain}</span>
                      <span className="text-sm text-muted-foreground">{explain.changed_at}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {showDetails && (
            <div id="word-details" className="mt-4">
              {isEditingDetails ? (
                <div className="flex flex-col gap-2">
                  <Textarea
                    value={editedDetails || ''}  // Ensure value is a string
                    onChange={(e) => setEditedDetails(e.target.value)}
                    className="w-full"
                    rows={8}
                  />
                  <Button onClick={handleSaveDetails}>Save Details</Button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <p className="flex-grow whitespace-pre-line">{editedDetails}</p>
                  <Button variant="ghost" size="sm" onClick={handleEditDetails} className="ml-2">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit details</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Related Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 justify-center">
            {relatedWords.map(({ related_word_id, correlation, related_word }, index) => (
              <Link href={`/word/${related_word_id}`} key={`${related_word_id}-${index}`}>
                <Button
                  variant="ghost"
                  className="px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                  style={{ fontSize: '16px' }}
                >
                  {related_word} ({correlation.toFixed(2)})
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
