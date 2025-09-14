"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Shuffle, BarChart3, Home, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLASS_COLORS } from "@/lib/colors";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  type: string;
  createdAt: Date;
}

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  setName: string;
}

export function FlashcardViewer({ flashcards, setName }: FlashcardViewerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledCards, setShuffledCards] = useState(flashcards);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  const currentCard = shuffledCards[currentIndex];
  const totalCards = shuffledCards.length;
  const progressPercentage = Math.round((studiedCards.size / totalCards) * 100);

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  const nextCard = () => {
    if (currentIndex < totalCards - 1) {
      // Mark current card as studied
      setStudiedCards(prev => new Set([...prev, currentCard.id]));
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const finishSet = () => {
    // Mark current card as studied
    setStudiedCards(prev => new Set([...prev, currentCard.id]));
    // Show confetti immediately
    setShowConfetti(true);
    // Show congrats modal immediately
    setShowCongratsModal(true);
    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 10000);
  };

  const keepStudying = () => {
    setShowCongratsModal(false);
    setShowConfetti(false);
    // Reshuffle and start over
    shuffleCards();
    setStudiedCards(new Set());
  };

  const backToHome = () => {
    router.push("/app/flashcards");
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const shuffleCards = () => {
    const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
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

  if (totalCards === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No flashcards found in this set.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      <div className="relative">
        {/* Shuffle and Progress Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          variant="outline"
          onClick={shuffleCards}
          className="flex items-center gap-2"
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </Button>
        
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <BarChart3 className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Card {currentIndex + 1} of {totalCards} • {studiedCards.size} studied ({progressPercentage}%)
          </span>
        </div>
      </div>
        {/* Flashcard Container with Flip Animation */}
        
        <div className="perspective-1000">
          <div 
            className={cn(
              "relative w-full h-[500px] transition-transform duration-700 transform-style-preserve-3d cursor-pointer",
              isFlipped && "rotate-y-180"
            )}
            onClick={flipCard}
          >
            {/* Front of Card (Question) */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="bg-white rounded-md border-18 border-gray-100 transition-all duration-200 h-full flex flex-col">
                <div className="absolute top-10 left-10">
                  <div 
                    className="text-sm border-1 p-1 px-3 font-medium rounded-sm"
                    style={getTypeColor(currentCard.type)}
                  >
                    {currentCard.type}
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center w-full">
  
                    <p className="text-2xl font-bold leading-relaxed text-gray-700">
                      {currentCard.question}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back of Card (Answer) */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div className="bg-white rounded-md border-18 border-gray-100 transition-all duration-200 h-full flex flex-col">
                <div className="">
                  <div className="absolute top-10 left-10">
                    <div 
                      className="text-sm border-1 p-1 px-3 font-medium rounded-sm"
                      style={getTypeColor(currentCard.type)}
                    >
                      {currentCard.type}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Answer
                    </h2>
                    <p className="text-xl leading-relaxed text-green-700">
                      {currentCard.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {shuffledCards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsFlipped(false);
              }}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === currentIndex 
                  ? "bg-blue-600" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>

        {currentIndex === totalCards - 1 ? (
          <Button
            onClick={finishSet}
            className="flex items-center gap-2 text-white"
          >
            Finish
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={nextCard}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
          initialVelocityY={20}
          initialVelocityX={10}
          wind={0.1}
          colors={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#ff4757', '#2ed573', '#5352ed', '#ffa502']}
        />
      )}

      {/* Congratulations Dialog */}
      <Dialog open={showCongratsModal} onOpenChange={setShowCongratsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="text-6xl mb-4 text-center">🎉</div>
            <DialogTitle className="text-3xl text-center">Congratulations!</DialogTitle>
            <DialogDescription className="text-center text-base">
              You've completed the "{setName}" flashcard set!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={keepStudying}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Keep Studying
            </Button>
            <Button
              variant="outline"
              onClick={backToHome}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
