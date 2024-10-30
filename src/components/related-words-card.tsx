import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';

interface RelatedWordsCardProps {
  relatedWords: { id: number; correlation: number; word: string }[];
  wordData: { word: string } | null;
  isGenerating: boolean;
  handleGenerateExplain: (word: string) => void;
}

const RelatedWordsCard: React.FC<RelatedWordsCardProps> = ({ relatedWords, wordData, isGenerating, handleGenerateExplain }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Related Words</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 justify-start">
          {relatedWords.map(({ id, correlation, word }, index) => (
            <Button
              key={`${id}-${index}`}
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
            onClick={() => wordData && handleGenerateExplain(wordData.word)}
            disabled={isGenerating}
            title={isGenerating ? "Generating..." : "Generate AI explain"}
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