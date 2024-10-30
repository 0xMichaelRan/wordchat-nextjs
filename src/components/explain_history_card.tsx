import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { History } from 'lucide-react';
import { useConfig } from '@/hooks/useConfig';

interface ExplainHistoryCardProps {
  wordId: number;
}

const defaultExplainHistory = [
    {
      id: 3,
      word_id: 1,
      old_explain: "The process of selecting the most probable word at each step in sequence generation.",
      changed_at: "2023-10-03 12:00:00",
    },
    {
      id: 2,
      word_id: 1,
      old_explain: "When a model selects the most probable word at each step in sequence generation.",
      changed_at: "2023-10-03 12:00:00",
    },
];

const ExplainHistoryCard: React.FC<ExplainHistoryCardProps> = ({ wordId }) => {
    const { config } = useConfig();
  const [explainHistory, setExplainHistory] = useState<{ old_explain: string; changed_at: string }[]>(defaultExplainHistory);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExplainHistory = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/${wordId}/history?knowledge_base=${config.knowledgeBase}`)
        if (!response.ok) {
          throw new Error('Fetch explain history failed');
        }
        const data = await response.json();
        setExplainHistory(data);
      } catch (error) {
        console.error('Error fetching explain history:', error);
        setError('Failed to fetch explain history');
      }
    };

    fetchExplainHistory();
  }, [wordId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="View History"
        >
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
  );
};

export default ExplainHistoryCard;