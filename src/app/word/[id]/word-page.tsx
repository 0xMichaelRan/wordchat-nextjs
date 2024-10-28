'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronDown, ChevronUp, Edit, History, MessageSquare, GitMerge, Sparkles, X, Scissors } from 'lucide-react'
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
import axios from 'axios'

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
  details: "Move chat button to the same line as last updated timestamp, and remove the word \"Last Updated\", just keep the date and time. Also add a merge button alongside the chat button. Make the border bold and shaded., and add apply tag style border to related words. I'll modify the component to move the chat button to the same line as the timestamp, remove \"Last Updated\", add a merge button, make the border bold and shaded, and apply a tag style border to related words. Here's the updated component.",
  created_at: "2024-06-25 22:40:19",
};

const defaultRelatedWords = [
  { related_word_id: 10, correlation: 0.9, related_word: "Beam" },
  { related_word_id: 2, correlation: 0.8, related_word: "GPT (Generative Pre-trained Transformer)" },
  { related_word_id: 3, correlation: 0.7, related_word: "Sequence-to-Sequence Model" },
  { related_word_id: 6, correlation: 0.6, related_word: "Fine-Tuning" },
];

const defaultExplainHistory = [
  {
    id: null,
    word_id: 1,
    old_explain: "Initial explanation for word 3",
    changed_at: "2023-10-03 12:00:00",
  },
  {
    id: null,
    word_id: 1,
    old_explain: "Initial explanation for word 3",
    changed_at: "2023-10-03 12:00:00",
  },
];


export default function WordPage() {
  const { id } = useParams()
  const [wordData, setWordData] = useState<WordData | null>(null)
  const [relatedWords, setRelatedWords] = useState<{ related_word_id: number; correlation: number; related_word: string }[]>([])
  const [explainHistory, setExplainHistory] = useState<{ id: number | null; word_id: number; old_explain: string; changed_at: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showDetails, setShowDetails] = useState(false)
  const [isEditingExplain, setIsEditingExplain] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [editedExplain, setEditedExplain] = useState('')
  const [editedDetails, setEditedDetails] = useState('')

  const detailsTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const explainTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);

  // State for split mode
  const [splitMode, setSplitMode] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // Function to handle word selection
  const handleWordSelect = (word: string) => {
    setSelectedWords(prev =>
      prev.includes(word)
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      // Get a random word with empty explain
      if (id === '-1') {
        try {
          const randomWordResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/random_empty_explain`);
          if (!randomWordResponse.ok) {
            throw new Error('Fetch random word failed');
          }
          const randomWordData = await randomWordResponse.json();
          window.location.href = `/word/${randomWordData.id}`;
          return;
        } catch (error) {
          console.error('Error fetching random word:', error);
          setError('No more random word: this feature is deprecated');
          setLoading(false);
          return;
        }
      }

      // Get a normal word
      try {
        const wordResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/${id}`)
        if (!wordResponse.ok) {
          throw new Error('Fetch failed')
        }
        const fetchedWordData = await wordResponse.json()
        setWordData(fetchedWordData)
        setEditedExplain(fetchedWordData.explain)
        setEditedDetails(fetchedWordData.details || '')

        // Update the related words fetch call
        const relatedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/related/query-by-id?id=${id}`)
        if (!relatedResponse.ok) {
          throw new Error('Fetch related words failed')
        }
        const relatedData = await relatedResponse.json()
        console.log("relatedData", relatedData)
        // Update state with new data structure
        setRelatedWords(relatedData.map(({ id, score, word }: { id: number; score: number; word: string }) => ({
          related_word_id: id,
          correlation: score,
          related_word: word
        })))

        const historyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/${id}/history`)
        if (!historyResponse.ok) {
          throw new Error('Fetch explain history failed')
        }
        const historyData = await historyResponse.json()
        setExplainHistory(historyData)

        // Check if explain is empty and generate if needed
        if (fetchedWordData.explain === "") {
          console.log("Explain is empty, generating explain for", fetchedWordData.word)
          handleGenerateExplain(fetchedWordData.word)
        }

      } catch (error) {
        console.error('Error fetching data:', error)
        setWordData(defaultResponse)
        setEditedExplain(defaultResponse.explain)
        setEditedDetails(defaultResponse.details || ''); // Use empty string if details is null
        setRelatedWords(defaultRelatedWords)
        setExplainHistory(defaultExplainHistory)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  // Update word data
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

      // Fetch explain history again
      const historyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/${id}/history`);
      if (!historyResponse.ok) {
        throw new Error('Fetch explain history failed');
      }
      const historyData = await historyResponse.json();
      setExplainHistory(historyData);

    } catch (error) {
      console.error('Error updating word data:', error);
      setError('Failed to update word data');
    }
  };

  // Edit explain
  const handleEditExplain = () => {
    setIsEditingExplain(!isEditingExplain);
    if (!isEditingExplain) {
      setShowDetails(true); // Ensure details are shown when opening the editor
      setTimeout(() => {
        explainTextareaRef.current?.focus();
      }, 0);
    }
  }

  // Save explain
  const handleSaveExplain = () => {
    if (editedExplain.trim() === '') {
      console.log('Explain field cannot be empty');
      return;
    }

    setIsEditingExplain(false);
    updateWordData({ explain: editedExplain });
    console.log("Saving new explain:", editedExplain);
  }

  // Edit details
  const handleEditDetails = () => {
    setIsEditingDetails(true);
    setTimeout(() => {
      detailsTextareaRef.current?.focus();
    }, 0); // Ensure focus is called after the state update
  };

  // Save details
  const handleSaveDetails = () => {
    if (editedDetails.trim() === '') {
      console.log('Details is empty, saving anyway.');
    }
    setIsEditingDetails(false);
    updateWordData({ details: editedDetails });
    console.log("Saving new details:", editedDetails);
  }

  // Generate explain by LLM
  const handleGenerateExplain = async (word: string) => {
    setIsGenerating(true)
    setIsEditingExplain(false)

    try {
      console.log("Generating explain for", word)
      const response = await axios.post(process.env.NEXT_PUBLIC_API_ENDPOINT! + '/chat/completions', {
        model: process.env.NEXT_PUBLIC_MODEL,
        messages: [
          {
            role: "user",
            content: `Generate a concise definition (120-170 characters) for the term "${word}" in the context of AI and machine learning. Do not include the word or any other text before the definition.`
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      let generatedExplain = response.data.choices[0].message.content.trim();

      // Remove double quotes if the text is quoted
      generatedExplain = generatedExplain.replace(/^"(.*)"$/, '$1');
      // Remove the word and optional semicolon if they appear at the beginning
      generatedExplain = generatedExplain.replace(new RegExp(`^${word}:?\\s*`, 'i'), '');

      setEditedExplain(generatedExplain);
      if (wordData) {
        updateWordData({ explain: generatedExplain });
      }
    } catch (error) {
      console.error('Error generating explanation:', error);
      setError('Failed to generate explanation');
    } finally {
      setIsGenerating(false);
    }
  };

  // Loading state
  if (loading) {
    return <div>Loading...</div>
  }

  // Error state
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
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSplitMode(!splitMode)}
                className="h-8 w-8"
              >
                <span className="font-bold text-xs">A|B</span>
                <span className="sr-only">Split Text</span>
              </Button>
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
                ref={explainTextareaRef}
                value={editedExplain}
                onChange={(e) => setEditedExplain(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey && e.key === 'Enter') || (e.ctrlKey && e.key === 's')) {
                    e.preventDefault(); // Prevent any default behavior
                    handleSaveExplain();
                  }
                }}
                className="w-full h-32"
                maxLength={188}
              />
              <div className="text-sm text-muted-foreground">
                {editedExplain.length}/188 characters. Ctrl+Enter to save.
              </div>
              <Button onClick={handleSaveExplain}>Save Explain</Button>
            </div>
          ) : (
            <div>
              {editedExplain.split(' ').map((word, index) => (
                splitMode ? (
                  <Button
                    key={index}
                    variant={selectedWords.includes(word) ? "default" : "outline"}
                    onClick={() => handleWordSelect(word)}
                    size="sm"
                    className="m-1"
                  >
                    {word}
                  </Button>
                ) : (
                  <span key={index}>{word + ' '}</span>
                )
              ))}

              {selectedWords.length > 0 && splitMode && (
                <Link
                  href={`/chat/${encodeURIComponent(selectedWords.join(' '))}?id=${wordData.id}`}
                  className="mt-4 p-4 border-2 border-primary rounded-lg cursor-pointer hover:bg-muted text-center block"
                >
                  <p className="font-medium">{selectedWords.join(' ')}</p>
                </Link>
              )}
            </div>
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
              <Button
                variant="outline"
                size="icon"
                onClick={handleEditExplain}
              >
                {isEditingExplain ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isEditingExplain ? "Cancel edit" : "Edit explain"}
                </span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => wordData && handleGenerateExplain(wordData.word)}
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4" />
                <span className="sr-only">Generate LLM explanation</span>
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
                      <span className="font-medium">{explain.old_explain}</span>
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
                    ref={detailsTextareaRef}
                    value={editedDetails}
                    onChange={(e) => setEditedDetails(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey && e.key === 'Enter') || (e.ctrlKey && e.key === 's')) {
                        e.preventDefault(); // Prevent any default behavior
                        handleSaveDetails();
                      }
                    }}
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
          <div className="flex flex-wrap gap-3 justify-start"> {/* Changed justify-center to justify-start */}
            {relatedWords
              .sort(() => Math.random() - 0.5) // Randomize the order
              .map(({ related_word_id, correlation, related_word }, index) => (
                <Link
                  href={`/word/${related_word_id}`}
                  key={`${related_word_id}-${index}`}
                  className="transition-all duration-200"
                >
                  <Button
                    variant="outline"
                    className={`
                    px-2 py-1 
                    hover:bg-primary hover:text-primary-foreground 
                    transition-colors
                    border rounded-lg
                  `}
                    style={{
                      // Scale font size between 14px and 18px based on correlation
                      fontSize: `${-70 + (correlation * 100)}px`,
                      // Scale padding based on correlation
                      padding: `${-6 + (correlation * 18)}px ${8 + (correlation * 8)}px`,
                      // Border opacity based on correlation
                      borderWidth: '2px',
                      opacity: -3.2 + (correlation * 5)
                    }}
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
