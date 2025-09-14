"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Eye, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { DeleteFlashcardSetDialog } from "./delete-flashcard-set-dialog";
import { CLASS_COLORS } from "@/lib/colors";

interface Class {
  id: string;
  name: string;
  colorHex: string;
  emoji: string;
}

interface FlashcardSetCardProps {
  id: number;
  name: string;
  description?: string;
  maxCards?: number;
  classId?: string;
  cardCount: number;
  createdAt: Date;
  types?: string[];
  classes?: Class[];
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

export function FlashcardSetCard({
  id,
  name,
  description,
  maxCards = 25,
  classId,
  cardCount,
  createdAt,
  types = [],
  classes = [],
  onView,
  onEdit,
  onDelete,
}: FlashcardSetCardProps) {
  const router = useRouter();

  const handleView = () => {
    if (onView) {
      onView();
    } else {
      router.push(`/app/flashcards/${id}`);
    }
  };

  const getTypeColor = (type: string) => {
    // Map each type to a consistent color from the first 6 colors
    const typeColorMap: { [key: string]: number } = {
      'question': 0,    // Red
      'vocab': 1,       // Green
      'definition': 2,  // Blue
      'concept': 3,     // Orange
      'formula': 4,     // Purple
      'example': 5,     // Lime
    };
    
    const colorId = typeColorMap[type] ?? 0; // Default to red if type not found
    const color = CLASS_COLORS[colorId];
    return {
      backgroundColor: `${color.hex}20`, // 20% opacity
      color: color.hex,
      borderColor: `${color.hex}`, // 40% opacity
    };
  };

  const selectedClass = classes.find(cls => cls.id === classId);

  return (
    <div className="bg-white rounded-md border-18 border-gray-100 transition-all duration-200 cursor-pointer group p-6">
      <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            {selectedClass && (
                <div 
                  className="w-5 h-5 rounded-xs border-2 bg-opacity-20"
                  style={{ backgroundColor: `${selectedClass.colorHex}33`, borderColor: selectedClass.colorHex }}
                  title={selectedClass.name}
                />
              )}
              <h3 className="text-2xl font-bold text-gray-900">
                {name}
              </h3>
              
            </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={handleView}
              title="View Flashcards"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={onEdit}
              title="Edit Set"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <DeleteFlashcardSetDialog
              setName={name}
              onDelete={onDelete || (() => Promise.resolve())}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-100 text-red-600 hover:text-red-700"
                title="Delete Set"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DeleteFlashcardSetDialog>
          </div>
        </div>
      </div>
      
      <div className="space-y-4" onClick={handleView}>
        <p className="text-gray-700 text-sm">
          {description || `You have ${cardCount} flashcards in this set.`}
        </p>
        

        <div className="space-y-1 pt-4">
          
          <div className="flex flex-col justify-between text-xs text-black font-medium">
            <span className="font-bold text-base">{cardCount}/{maxCards} cards</span>
            <span>Created {formatDistanceToNow(createdAt, { addSuffix: true })}</span>
          </div>
        </div>
        {types && types.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-0 flex flex-col">
            
            <div className="flex flex-wrap gap-2">
            {types.map((type) => {
              const typeColor = getTypeColor(type);
              return (
                <div 
                  key={type} 
                  className="text-xs border-1 p-[2px] px-[5px] font-medium rounded-sm"
                  style={typeColor}
                >
                  {type}
                  </div> 
                );
              })}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
