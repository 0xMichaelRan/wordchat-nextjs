'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function ConfigPage() {
  const [baseUrl, setBaseUrl] = useState("https://api.openai.com/v1")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gpt-3.5-turbo")
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState("150")
  const [words, setWords] = useState([
    { id: 1, word: "Serendipity", definition: "The occurrence and development of events by chance in a happy or beneficial way." },
    { id: 2, word: "Ephemeral", definition: "Lasting for a very short time." },
    { id: 3, word: "Eloquent", definition: "Fluent or persuasive in speaking or writing." },
  ])
  const [newWord, setNewWord] = useState("")
  const [newDefinition, setNewDefinition] = useState("")
  const [models, setModels] = useState(["gpt-3.5-turbo", "gpt-4", "text-davinci-003"])

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault()
    if (newWord && newDefinition) {
      setWords([...words, { id: Date.now(), word: newWord, definition: newDefinition }])
      setNewWord("")
      setNewDefinition("")
    }
  }

  const handleDeleteWord = (id: number) => {
    setWords(words.filter(word => word.id !== id))
  }

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the configuration to your app's state or make an API call
    console.log("Saving configuration:", { baseUrl, apiKey, model, temperature: temperature[0], maxTokens })
  }

  const handleRefreshModels = async () => {
    // This is a mock function. In a real application, you would make an API call to fetch the models.
    console.log("Refreshing models for base URL:", baseUrl)
    // Simulating an API call
    setTimeout(() => {
      setModels(["gpt-3.5-turbo", "gpt-4", "text-davinci-003", "gpt-3.5-turbo-16k"])
    }, 1000)
  }

  return (
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Configuration</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>LLM API Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <Label htmlFor="baseUrl">Base URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="baseUrl"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="Enter the base URL for the API"
                  />
                  <Button type="button" onClick={handleRefreshModels} className="flex-shrink-0">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Models
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="temperature">Temperature: {temperature}</Label>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onValueChange={setTemperature}
                />
              </div>
              <div>
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="1"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                />
              </div>
              <Button type="submit">Save API Settings</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Word List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>Definition</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {words.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell>{word.word}</TableCell>
                    <TableCell>{word.definition}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteWord(word.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete {word.word}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <form onSubmit={handleAddWord} className="mt-4 space-y-4">
              <div>
                <Label htmlFor="newWord">New Word</Label>
                <Input
                  id="newWord"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Enter a new word"
                />
              </div>
              <div>
                <Label htmlFor="newDefinition">Definition</Label>
                <Textarea
                  id="newDefinition"
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="Enter the definition"
                  rows={3}
                />
              </div>
              <Button type="submit">Add Word</Button>
            </form>
          </CardContent>
        </Card>
      </main>
  )
}