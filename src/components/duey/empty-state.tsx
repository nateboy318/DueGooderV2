"use client";

import { MessageCircle, Calendar, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onSendMessage: (message: string) => void;
}

const suggestionChips = [
  "What's due this week?",
  "What should I do today?",
  "Prioritize my assignments",
  "Show urgent tasks",
  "Plan my study time"
];

export function EmptyState({ onSendMessage }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 pt-24">
      <div className="text-center max-w-2xl bg-gray-100 p-6 rounded-md">
        <div className="bg-white p-8">
          <div className="w-16 h-16 bg-myBlue/10 border-2 border-myBlue rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-myBlue" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Duey
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your academic assistant. Get help with assignments and priorities.
          </p>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestionChips.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSendMessage(suggestion)}
                  className="text-xs h-8 px-3"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
