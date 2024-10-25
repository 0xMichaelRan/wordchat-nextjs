'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronDown, ChevronUp, Edit, History, MessageSquare, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface WordData {
  id: string;
  word: string;
  definition: string;
  details: string;
  relatedWords: { word: string; correlation: number }[];
  definitionHistory: { text: string; date: string }[];
}

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
    const fetchWordData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/words/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch word data')
        }
        const data: WordData = await response.json()
        setWordData(data)
        setEditedDefinition(data.definition)
        setEditedDetails(data.details)
      } catch (err) {
        setError('An error occurred while fetching the word data.')
      } finally {
        setLoading(false)
      }
    }

    fetchWordData()
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the new word to your app's state or database
    console.log({ newWord, newDefinition, newDetails })
    // Reset form fields
    setNewWord("")
    setNewDefinition("")
    setNewDetails("")
  }

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
    <div>
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
                    {wordData.definitionHistory.map((def, index) => (
                      <DropdownMenuItem key={index} className="flex flex-col items-start">
                        <span className="font-medium">{def.text}</span>
                        <span className="text-sm text-muted-foreground">{def.date}</span>
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
              {wordData.relatedWords.map(({ word, correlation }) => {
                const fontSize = Math.max(12, Math.floor(correlation * 24));
                return (
                  <Link href={`/word/${word}`} key={word}>
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


      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
            size="icon"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add new word</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Word</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="word">Word</Label>
              <Input
                id="word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="definition">Definition (max 188 characters)</Label>
              <Textarea
                id="definition"
                value={newDefinition}
                onChange={(e) => setNewDefinition(e.target.value)}
                maxLength={188}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                {newDefinition.length}/188 characters
              </p>
            </div>
            <div>
              <Label htmlFor="details">Detailed Information</Label>
              <Textarea
                id="details"
                value={newDetails}
                onChange={(e) => setNewDetails(e.target.value)}
              />
            </div>
            <Button type="submit">Add Word</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
