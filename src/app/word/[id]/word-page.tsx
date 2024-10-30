'use client'

import RelatedWordsCard from '@/components/related-words-card'
import ExplainHistoryCard from '@/components/explain_history_card'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Edit, MessageSquare, GitMerge, Sparkles, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import { motion } from 'framer-motion'

import { useConfig } from '@/hooks/useConfig'
import { updateWordDataApi } from '@/utils/api';

export interface WordData {
  id: number;
  word: string;
  explain: string;
  details: string;
  edit_since_embedding: number;
  ai_generated: boolean;
  knowledge_base: string;
  created_at: string;
}

const defaultWord: WordData = {
  id: 1,
  word: "G.A.N",
  explain: "A decoding strategy that selects the most probable word at each step in sequence generation.",
  details: "Move chat button to the same line as last updated timestamp, and remove the word \"Last Updated\", just keep the date and time. Also add a merge button alongside the chat button. Make the border bold and shaded., and add apply tag style border to related words. I'll modify the component to move the chat button to the same line as the timestamp, remove \"Last Updated\", add a merge button, make the border bold and shaded, and apply a tag style border to. Here's the updated component.",
  edit_since_embedding: 4,
  ai_generated: false,
  knowledge_base: "LLM",
  created_at: "2024-10-29T11:10:31.940Z",
};

export default function WordPage() {
  const { id } = useParams()
  const { config, saveConfig } = useConfig()
  const [wordData, setWordData] = useState<WordData | null>(null)
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

  const [refreshKey, setRefreshKey] = useState(0);

  // Function to handle word selection
  const handleSplitWordSelect = (word: string) => {
    setSelectedWords(prev =>
      prev.includes(word)
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  useEffect(() => {
    console.log('Effect running with id:', id);

    const fetchData = async () => {
      console.log('Fetching data for id:', id);
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
        const wordResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/${id}?knowledge_base=${config.knowledgeBase}`);
        if (!wordResponse.ok) {
          throw new Error('Fetch failed');
        }
        const fetchedWordData: WordData = await wordResponse.json();
        console.log("fetchedWordData", fetchedWordData);
        setWordData(fetchedWordData);
        setEditedExplain(fetchedWordData.explain);
        setEditedDetails(fetchedWordData.details || '');

        // Check if explain is empty and generate if needed
        if (fetchedWordData.explain === "") {
          console.log("Explain is empty, generating explain for", fetchedWordData.word)
          handleGenerateExplain(fetchedWordData.word)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setWordData(defaultWord);
        setEditedExplain(defaultWord.explain);
        setEditedDetails(defaultWord.details || '');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // React 18 Strict Mode Behavior:
    // In development, Strict Mode intentionally:
    // Mounts components
    // Unmounts them
    // Mounts them again
    // This is to help developers find bugs related to cleanup and effects
    return () => {
      console.log('Effect cleanup for id:', id);
    };
  }, [id])

  // Add a separate useEffect specifically for title updates
  useEffect(() => {
    if (wordData?.word) {
      window.document.title = `${wordData.word} - WordChat v0.1`;
    }
  }, [wordData?.word]); // Only depend on wordData.word instead of entire wordData object

  // Update word data
  const updateWordData = async (updatedData: Partial<WordData>) => {
    try {
      const data = await updateWordDataApi(id as string, updatedData, config.knowledgeBase);
      setWordData(data);
      setRefreshKey(prevKey => prevKey + 1); // Increment refreshKey to trigger refresh
    } catch (error) {
      console.error('Error updating word data:', error);
      setError('Failed to update word data');
    }
  };

  // Edit explain
  const handleEditExplain = () => {
    setIsEditingExplain(!isEditingExplain);
    setSplitMode(false);
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
    } else {
      setEditedExplain(editedExplain.replace(/  +/g, ' '));
    }

    setIsEditingExplain(false);
    updateWordData({ explain: editedExplain });
    console.log("Saving new explain:", editedExplain);
  }

  // Edit details
  const handleEditDetails = () => {
    setIsEditingDetails(true);
    // Wait for textarea to be rendered
    setTimeout(() => {
      if (detailsTextareaRef.current) {
        detailsTextareaRef.current.style.height = 'auto';
        detailsTextareaRef.current.style.height = `${detailsTextareaRef.current.scrollHeight}px`;
      }
    }, 0);
  };

  // Save details
  const handleSaveDetails = () => {
    if (editedDetails.trim() === '') {
      console.log('Details is empty, saving anyway.');
    }
    setIsEditingDetails(false);
    updateWordData({ details: editedDetails });
  }

  // Generate explain by AI
  const handleGenerateExplain = async (word: string) => {
    setIsGenerating(true)
    setIsEditingExplain(false)
    setSplitMode(false);

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
      console.error('Error generating explain:', error);
      setError('Failed to generate explain');
    } finally {
      setIsGenerating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-700 via-blue-800 to-cyan-900 flex items-center justify-center">
        <motion.div
          className="text-white text-2xl md:text-4xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ⚙️
          </motion.span>
          <motion.span
            className="ml-4"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading...
          </motion.span>
        </motion.div>
      </div>
    )
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
                onClick={() => {
                  setSplitMode(!splitMode);
                  setIsEditingExplain(false);
                }}
                title="Toggle split mode"
              >
                <span className="font-bold text-xs">A|B</span>
                <span className="sr-only">Split Text</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                title={`Chat about ${wordData.word}`}
              >
                <Link href={`/chat/${wordData.word}?id=${wordData.id}`}>
                  <MessageSquare className="h-4 w-4" />
                  <span className="sr-only">Chat about {wordData.word}</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                title={`Merge ${wordData.word}`}
              >
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
              <Button
                onClick={handleSaveExplain}
                title="Save (Ctrl+Enter)"
              >
                Save Explain
              </Button>
            </div>
          ) : (
            <div>
              {editedExplain.split(' ').map((word, index) => (
                splitMode ? (
                  <Button
                    key={index}
                    variant={selectedWords.includes(word) ? "default" : "outline"}
                    onClick={() => handleSplitWordSelect(word)}
                    size="sm"
                    className="m-1"
                    title={selectedWords.includes(word) ? "Click to unselect" : "Click to select"}
                  >
                    {word}
                  </Button>
                ) : (
                  <span key={index}>{word + ' '}</span>
                )
              ))}

              {selectedWords.length > 0 && splitMode && (
                <Button
                  variant="outline"
                  asChild
                  title={`Chat with: ${selectedWords.join(' ')}`}
                  className={`
                    mt-4 
                    px-4 py-6 
                    min-h-[80px]
                    border-2 border-primary 
                    rounded-lg 
                    cursor-pointer 
                    hover:bg-muted 
                    text-center 
                    block
                  `}
                >
                  <Link href={`/chat/${encodeURIComponent(selectedWords.join(' '))}?id=${wordData.id}`}>
                    <p className="font-medium">{selectedWords.join(' ')}</p>
                  </Link>
                </Button>
              )}
            </div>
          )}
          <div className="flex justify-end items-center">
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleEditExplain}
                title={isEditingExplain ? "Cancel editing" : "Edit explain"}
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
                title={isGenerating ? "Generating..." : "Generate AI explain"}
              >
                <Sparkles className="h-4 w-4" />
                <span className="sr-only">Generate explain</span>
              </Button>
              <ExplainHistoryCard wordId={wordData.id} refreshKey={refreshKey} />
            </div>
          </div>
          <div id="word-details" className="mt-4">
            {isEditingDetails ? (
              // edit mode (Details)
              <div className="flex flex-col gap-2 p-4 border-2 rounded-lg bg-muted/30">
                <Textarea
                  ref={detailsTextareaRef}
                  value={editedDetails}
                  onChange={(e) => setEditedDetails(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey && e.key === 'Enter') || (e.ctrlKey && e.key === 's')) {
                      e.preventDefault();
                      handleSaveDetails();
                    }
                  }}
                  className="w-full resize-none overflow-hidden"
                  style={{
                    minHeight: '88px',
                    height: `${detailsTextareaRef.current?.scrollHeight}px`
                  }}
                  placeholder="Enter details here..."
                />
                <div className="flex gap-2 items-center w-full">
                  <Button onClick={handleSaveDetails} title="Save details (Ctrl+Enter)" className="flex-1">Save Details</Button>
                  <Button variant="outline" onClick={() => setIsEditingDetails(false)} title="Cancel editing" className="flex-1">Cancel</Button>
                </div>
              </div>
            ) : (
              // view mode (Details)
              <div className="flex justify-between items-start p-4 border-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                <p
                  className={`
                    flex-grow 
                    whitespace-pre-line
                    leading-6
                    ${!showDetails ? 'line-clamp-2 cursor-pointer' : ''}
                    ${!editedDetails && 'text-muted-foreground italic'}
                  `}
                  onClick={() => showDetails ? setShowDetails(false) : setShowDetails(true)}
                  title={!showDetails ? "Click to show more" : undefined}
                >
                  {editedDetails || 'Details...'}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditDetails}
                  title="Edit details"
                  className="ml-2"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit details</span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <RelatedWordsCard wordId={wordData.id}
      />
    </main>
  )
}
