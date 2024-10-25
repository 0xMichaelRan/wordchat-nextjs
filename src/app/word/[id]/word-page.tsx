'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronDown, ChevronUp, Edit, History, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

interface WordData {
  id: number;
  word: string;
  definition: string;
  details: string;
  created_at: string;
  related_words: { id: number; word: string }[];
  definition_history: { id: number | null; word_id: number; previous_definition: string; changed_at: string }[];
}

const defaultResponse: WordData = {
  id: 1,
  word: "ephemeral",
  definition: "Lasting for a very short time",
  details: "From Greek \"ephemeros\" meaning lasting only one day meaning lasting only one day meaning lasting only one day meaning lasting only one day",
  created_at: "2024-10-25 17:03:33",
  related_words: [],
  definition_history: [],
};

export default function WordPage() {
  const { id } = useParams()
  const [wordData, setWordData] = useState<WordData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showDetails, setShowDetails] = useState(false)
  const [isEditingDefinition, setIsEditingDefinition] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [editedDefinition, setEditedDefinition] = useState('')
  const [editedDetails, setEditedDetails] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/${id}`)
        if (!response.ok) {
          throw new Error('Fetch failed')
        }
        const data = await response.json()
        setWordData(data)
        setEditedDefinition(data.definition)
        setEditedDetails(data.details)
      } catch (error) {
        console.error('Error fetching word data:', error)
        setWordData(defaultResponse)
        setEditedDefinition(defaultResponse.definition)
        setEditedDetails(defaultResponse.details)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleEditDefinition = () => {
    setIsEditingDefinition(true)
  }

  const handleSaveDefinition = () => {
    setIsEditingDefinition(false)
    // Here you would typically update your app's state or make an API call
    console.log("Saving new definition:", editedDefinition)
  }

  const handleEditDetails = () => {
    setIsEditingDetails(true)
  }

  const handleSaveDetails = () => {
    setIsEditingDetails(false)
    // Here you would typically update your app's state or make an API call
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
      <Card className="mb-6">
        <CardHeader className="flex flex-col items-start">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-3xl font-bold">{wordData.word}</CardTitle>
            <Button variant="outline" size="icon" asChild>
              <Link href={`/chat?word=${wordData.word}`}>
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Chat about {wordData.word}</span>
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</p>
        </CardHeader>
        <CardContent>
          {isEditingDefinition ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={editedDefinition}
                onChange={(e) => setEditedDefinition(e.target.value)}
                className="w-full"
                maxLength={188}
              />
              <div className="text-sm text-muted-foreground">
                {editedDefinition.length}/188 characters
              </div>
              <Button onClick={handleSaveDefinition}>Save Definition</Button>
            </div>
          ) : (
            <p className="text-lg mb-4">{editedDefinition}</p>
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
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleEditDefinition}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit definition</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <History className="h-4 w-4" />
                    <span className="sr-only">View definition history</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[300px]">
                  {wordData.definition_history.map((def, index) => (
                    <DropdownMenuItem key={index} className="flex flex-col items-start">
                      <span className="font-medium">{def.previous_definition}</span>
                      <span className="text-sm text-muted-foreground">{def.changed_at}</span>
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
                    value={editedDetails}
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
            {wordData.related_words.map(({ id, word }) => {
              // Since we don't have a correlation value, we'll use a fixed font size
              const fontSize = 16; // You can adjust this value as needed
              return (
                <Link href={`/word/${id}`} key={id}>
                  <Button
                    variant="ghost"
                    className={`px-2 py-1 hover:bg-primary hover:text-primary-foreground transition-colors`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {word}
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
