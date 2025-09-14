"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FlashcardViewer } from "@/components/flashcards/flashcard-viewer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  type: string;
  createdAt: Date;
}

interface FlashcardSet {
  id: number;
  name: string;
  createdAt: Date;
}

export default function FlashcardSetPage() {
  const params = useParams();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [set, setSet] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setId = params.setId as string;

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/app/flashcards/${setId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Flashcard set not found");
          }
          throw new Error("Failed to fetch flashcard set");
        }
        
        const data = await response.json();
        setSet(data.set);
        setFlashcards(data.flashcards || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (setId) {
      fetchFlashcards();
    }
  }, [setId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.push("/app/flashcards")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Flashcards
          </Button>
        </div>
      </div>
    );
  }

  if (!set) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Flashcard Set Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The flashcard set you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push("/app/flashcards")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Flashcards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      
      <FlashcardViewer 
        flashcards={flashcards} 
        setName={set.name} 
      />
    </div>
  );
}
