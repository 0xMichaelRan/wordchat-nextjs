'use client'

import { useState } from 'react'
import Link from 'next/link'
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

export default function WordPage() {
  // Placeholder data
  const word = "Serendipity"
  const definition = "The occurrence and development of events by chance in a happy or beneficial way."
  const details = "Coined by Horace Walpole in 1754. Inspired by a Persian fairy tale, 'The Three Princes of Serendip,' whose heroes often made discoveries by accident."
  const relatedWords = [
    { word: "Chance", correlation: 0.9 },
    { word: "Luck", correlation: 0.8 },
    { word: "Fortuitous", correlation: 0.7 },
    { word: "Happenstance", correlation: 0.6 },
    { word: "Coincidence", correlation: 0.5 },
    { word: "Fluke", correlation: 0.4 },
    { word: "Providence", correlation: 0.3 },
    { word: "Fortuity", correlation: 0.2 }
  ];
  const definitionHistory = [
    { text: "The faculty of making fortunate discoveries by accident.", date: "2023-06-01" },
    { text: "The phenomenon of finding valuable things not sought for.", date: "2023-06-15" },
    { text: "A happy accident or pleasant surprise; a fortunate mistake.", date: "2023-06-30" }
  ]

  const [showDetails, setShowDetails] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [newWord, setNewWord] = useState("")
  const [newDefinition, setNewDefinition] = useState("")
  const [newDetails, setNewDetails] = useState("")
  const [isEditingDefinition, setIsEditingDefinition] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [editedDefinition, setEditedDefinition] = useState(definition)
  const [editedDetails, setEditedDetails] = useState(details)

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

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Word</Link>
          <div className="flex gap-4">
            <Link href="/?word=jfkd3" className="hover:underline">Word</Link>
            <Link href="/chat" className="hover:underline">Chat</Link>
            <Link href="/config" className="hover:underline">Config</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        <Card className="mb-6">
          <CardHeader className="flex flex-col items-start">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-3xl font-bold">{word}</CardTitle>
              <Button variant="outline" size="icon" asChild>
                <Link href={`/chat?word=${word}`}>
                  <MessageSquare className="h-4 w-4" />
                  <span className="sr-only">Chat about {word}</span>
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
                />
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
                    {definitionHistory.map((def, index) => (
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
                    />
                    <Button onClick={handleSaveDetails}>Save Details</Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <p className="flex-grow">{editedDetails}</p>
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
              {relatedWords.map(({ word, correlation }, index) => {
                const fontSize = Math.max(12, Math.floor(correlation * 24)); // Scale font size between 12px and 24px
                return (
                  <Link href={`/?word=${word}`}>
                    <Button
                      key={index}
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