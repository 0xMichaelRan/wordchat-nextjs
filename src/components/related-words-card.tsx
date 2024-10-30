import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';
import { useConfig } from '@/hooks/useConfig';

interface RelatedWordsCardProps {
  wordId: number;
}

const defaultRelatedWords = [
  { id: 1, word: "Beam Search", correlation: 0.9, ai_generated: false, knowledge_base: "LLM" },
  { id: 2, word: "GPT (Generative Pre-trained Transformer)", correlation: 0.98, ai_generated: false, knowledge_base: "LLM" },
  { id: 3, word: "Sequence-to-Sequence Model", correlation: 0.7, ai_generated: false, knowledge_base: "LLM" },
  { id: 6, word: "Fine-Tuning", correlation: 0.6, ai_generated: false, knowledge_base: "LLM" },
];

const RelatedWordsCard: React.FC<RelatedWordsCardProps> = ({ wordId }) => {
  const { config } = useConfig();
  const [relatedWords, setRelatedWords] = useState<{ id: number; correlation: number; word: string }[]>(defaultRelatedWords);
  const [isRedoingEmbedding, setIsRedoingEmbedding] = useState(false);

  useEffect(() => {
    const fetchRelatedWords = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/related/${wordId}?knowledge_base=${config.knowledgeBase}`);
        if (!response.ok) {
          throw new Error('Fetch related words failed');
        }
        const data = await response.json();
        setRelatedWords(data);
      } catch (error) {
        console.error('Error fetching related words:', error);
      }
    };

    fetchRelatedWords();
  }, [wordId, config.knowledgeBase]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Related Words</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 justify-start">
          {relatedWords.map(({ id, correlation, word }) => (
            <Button
              key={id}
              variant="outline"
              asChild
              className={`
                px-2 py-1 
                hover:bg-primary hover:text-primary-foreground 
                transition-colors
                border rounded-lg
              `}
              style={{
                fontSize: `${-70 + (correlation * 100)}px`,
                padding: `${-6 + (correlation * 18)}px ${8 + (correlation * 8)}px`,
                borderWidth: '2px',
                opacity: -3.2 + (correlation * 5)
              }}
            >
              <Link
                href={`/word/${id}`}
                className="transition-all duration-200"
              >
                {word} ({correlation.toFixed(2)})
              </Link>
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {}} // Adjust as needed
            disabled={isRedoingEmbedding}
            title={isRedoingEmbedding ? "Redoing Embedding..." : "Redo Embedding"}
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">Generate explain</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedWordsCard;