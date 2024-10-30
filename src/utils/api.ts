import type { WordData } from "@/app/word/[id]/word-page"

export const updateWordDataApi = async (id: string, updatedData: Partial<WordData>, knowledgeBase: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/words/${id}?knowledge_base=${knowledgeBase}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...updatedData, knowledge_base: knowledgeBase }),
    });
  
    if (!response.ok) {
      throw new Error('Update failed');
    }
  
    return response.json();
  };