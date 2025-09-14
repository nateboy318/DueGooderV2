"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, ArrowUpDown } from "lucide-react";
import { FlashcardSetCard } from "@/components/flashcards/flashcard-set-card";
import { CreateFlashcardSetModal } from "@/components/flashcards/create-flashcard-set-modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FlashcardSet {
  id: number;
  name: string;
  description?: string;
  maxCards?: number;
  classId?: string;
  cardCount: number;
  createdAt: Date;
  types?: string[];
}

interface Class {
  id: string;
  name: string;
  colorHex: string;
  emoji: string;
}

type SortOption = "date-desc" | "date-asc" | "class" | "name-asc" | "name-desc";

export default function FlashcardsPage() {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const fetchFlashcardSets = async () => {
    try {
      setLoading(true);
      const [flashcardsResponse, classesResponse] = await Promise.all([
        fetch("/api/app/flashcards"),
        fetch("/api/app/classes")
      ]);
      
      if (!flashcardsResponse.ok) {
        throw new Error("Failed to fetch flashcard sets");
      }
      
      const [flashcardsData, classesData] = await Promise.all([
        flashcardsResponse.json(),
        classesResponse.ok ? classesResponse.json() : { classes: [] }
      ]);
      
      setFlashcardSets(flashcardsData.sets || []);
      setClasses(classesData.classes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  const handleCreateSuccess = (setId: number) => {
    // Refresh the list after creating a new set
    fetchFlashcardSets();
  };

  const handleDeleteSet = async (setId: number) => {
    try {
      const response = await fetch(`/api/app/flashcards/${setId}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete flashcard set");
      }

      // Refresh the list after deleting
      await fetchFlashcardSets();
    } catch (error) {
      console.error("Error deleting flashcard set:", error);
      // You might want to show a toast notification here
    }
  };

  const sortFlashcardSets = (sets: FlashcardSet[]): FlashcardSet[] => {
    const sorted = [...sets].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "class":
          const aClass = classes.find(c => c.id === a.classId);
          const bClass = classes.find(c => c.id === b.classId);
          const aClassName = aClass?.name || "No Class";
          const bClassName = bClass?.name || "No Class";
          return aClassName.localeCompare(bClassName);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
    return sorted;
  };

  const sortedFlashcardSets = sortFlashcardSets(flashcardSets);


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Flashcards</h1>
            <p className="text-muted-foreground mt-2">
              Create and study with AI-generated flashcards
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground mt-2">
            Create and study with AI-generated flashcards
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="class">By Class</SelectItem>
                <SelectItem value="name-asc">A-Z</SelectItem>
                <SelectItem value="name-desc">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CreateFlashcardSetModal onSuccess={handleCreateSuccess}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Flashcard Set
            </Button>
          </CreateFlashcardSetModal>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {flashcardSets.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No flashcard sets yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first flashcard set by uploading study materials
          </p>
          <CreateFlashcardSetModal onSuccess={handleCreateSuccess}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Set
            </Button>
          </CreateFlashcardSetModal>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFlashcardSets.map((set) => (
            <FlashcardSetCard
              key={set.id}
              id={set.id}
              name={set.name}
              description={set.description}
              maxCards={set.maxCards}
              classId={set.classId}
              cardCount={set.cardCount}
              createdAt={set.createdAt}
              types={set.types}
              classes={classes}
              onDelete={() => handleDeleteSet(set.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
