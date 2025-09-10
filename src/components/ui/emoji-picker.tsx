"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  currentEmoji?: string;
  className?: string;
}

// Education-focused emoji categories with more comprehensive selection
const emojiCategories = {
  "Education": [
    "📚", "📖", "📝", "✏️", "📏", "📐", "🧮", "🔢", "📊", "📈", "📉",
    "🎓", "🎒", "🏫", "👨‍🏫", "👩‍🏫", "👨‍🎓", "👩‍🎓", "🎯", "⭐", "🏆", "🥇",
    "📋", "📌", "📍", "✂️", "📎", "🔗", "📄", "📰", "📑", "📜", "🗂️"
  ],
  "Science": [
    "🔬", "🧪", "⚗️", "🧬", "🔭", "🌡️", "⚡", "💡", "🔋", "⚛️", "🧲",
    "🌍", "🌎", "🌏", "🌙", "⭐", "🌟", "☀️", "🌊", "🔥", "❄️", "💨",
    "🌱", "🌿", "🍃", "🌾", "🌻", "🌺", "🌸", "🌼", "🌷", "🌹", "🌵"
  ],
  "Math": [
    "➕", "➖", "✖️", "➗", "🔢", "📊", "📈", "📉", "🧮", "📐", "📏",
    "⚖️", "🔺", "🔻", "⭕", "🔴", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫",
    "🔸", "🔹", "🔶", "🔷", "🔳", "🔲", "⬜", "⬛", "🟨", "🟧", "🟩"
  ],
  "Languages": [
    "📝", "✍️", "📄", "📰", "📑", "📋", "📌", "📍", "✂️", "📎", "🔗",
    "🌍", "🗺️", "🏛️", "🏺", "📜", "🎭", "🎨", "🖼️", "🎪", "🎬", "📺",
    "📚", "📖", "📰", "📄", "📑", "📋", "📌", "📍", "✂️", "📎", "🔗"
  ],
  "Arts": [
    "🎨", "🖼️", "🎭", "🎪", "🎬", "📺", "🎵", "🎶", "🎤", "🎧", "🎸",
    "🎹", "🥁", "🎺", "🎻", "🎼", "🎹", "🎤", "🎧", "📷", "📹", "🎞️",
    "🖌️", "🖍️", "✏️", "✒️", "🖊️", "🖋️", "📝", "✍️", "🎨", "🖼️", "🖌️"
  ],
  "Sports": [
    "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🏒",
    "🏑", "🏏", "🎯", "🏹", "🎣", "🤸", "🤾", "🏃", "🚴", "🏊", "🏋️",
    "🏅", "🥇", "🥈", "🥉", "🏆", "🎖️", "🏵️", "🎗️", "🎀", "🎁", "🎊"
  ],
  "Technology": [
    "💻", "🖥️", "⌨️", "🖱️", "💾", "💿", "📱", "📞", "☎️", "📠", "📺",
    "📷", "📹", "🎥", "📽️", "🔌", "💡", "🔋", "⚡", "🛠️", "🔧", "⚙️",
    "💿", "💾", "💽", "💻", "🖥️", "⌨️", "🖱️", "🖨️", "📱", "📞", "☎️"
  ],
  "General": [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉",
    "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛",
    "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐"
  ]
};

const allEmojis = Object.values(emojiCategories).flat();

// Emoji search keywords for better search functionality
const emojiKeywords: Record<string, string[]> = {
  "📚": ["book", "books", "education", "study", "learning", "school"],
  "🔬": ["science", "microscope", "lab", "experiment", "research"],
  "🧮": ["math", "calculator", "numbers", "calculation"],
  "🎨": ["art", "paint", "creative", "drawing", "design"],
  "⚽": ["sports", "football", "soccer", "ball", "game"],
  "💻": ["computer", "laptop", "technology", "coding", "programming"],
  "📝": ["writing", "note", "notes", "document", "text"],
  "🎓": ["graduation", "degree", "cap", "academic", "university"],
  "🏫": ["school", "building", "education", "campus"],
  "👨‍🏫": ["teacher", "professor", "instructor", "male"],
  "👩‍🏫": ["teacher", "professor", "instructor", "female"],
  "⭐": ["star", "favorite", "important", "excellent", "rating"],
  "🏆": ["trophy", "winner", "achievement", "success", "award"],
  "🥇": ["gold", "first", "winner", "medal", "champion"],
  "📊": ["chart", "graph", "data", "statistics", "analytics"],
  "🔢": ["numbers", "math", "counting", "digits"],
  "📐": ["ruler", "measurement", "geometry", "math", "triangle"],
  "📏": ["ruler", "measurement", "length", "straight"],
  "✏️": ["pencil", "writing", "drawing", "edit"],
  "📖": ["book", "reading", "open", "page"],
  "🎯": ["target", "goal", "aim", "focus", "objective"],
  "🎒": ["backpack", "bag", "school", "student"],
  "👨‍🎓": ["graduate", "student", "male", "cap"],
  "👩‍🎓": ["graduate", "student", "female", "cap"],
  "📋": ["clipboard", "list", "checklist", "tasks"],
  "📌": ["pin", "pushpin", "mark", "location"],
  "📍": ["pin", "location", "place", "marker"],
  "✂️": ["scissors", "cut", "craft", "tools"],
  "📎": ["paperclip", "attach", "file", "document"],
  "🔗": ["link", "chain", "connect", "url"],
  "📄": ["document", "page", "paper", "file"],
  "📰": ["newspaper", "news", "article", "media"],
  "📑": ["bookmark", "page", "marker", "tab"],
  "📜": ["scroll", "document", "ancient", "paper"],
  "🗂️": ["folder", "files", "organization", "storage"]
};

export function EmojiPicker({ 
  isOpen, 
  onClose, 
  onEmojiSelect, 
  currentEmoji = "📚",
  className
}: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof emojiCategories>("Education");

  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) {
      return emojiCategories[selectedCategory];
    }
    
    const query = searchQuery.toLowerCase();
    return allEmojis.filter(emoji => {
      const keywords = emojiKeywords[emoji] || [];
      return keywords.some(keyword => keyword.includes(query));
    });
  }, [searchQuery, selectedCategory]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    onClose();
  };

  const dialogContent = (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "sm:max-w-lg bg-white text-gray-900",
          className
        )}
        style={{ zIndex: 9999 }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{currentEmoji}</span>
            Choose Emoji
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Select an emoji for your class
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search emojis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {Object.keys(emojiCategories).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category as keyof typeof emojiCategories)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Emoji Grid */}
          <div className="space-y-2">
            <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
              {filteredEmojis.map((emoji, index) => (
                <Button
                  key={`${emoji}-${index}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEmojiClick(emoji)}
                  className={cn(
                    "h-10 w-10 p-0 text-lg hover:bg-gray-100 transition-colors",
                    currentEmoji === emoji && "bg-blue-100 text-blue-600"
                  )}
                >
                  {emoji}
                </Button>
              ))}
            </div>
            
            {filteredEmojis.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No emojis found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Use portal to render the dialog outside the modal hierarchy
  if (typeof window === 'undefined') return null;
  
  return createPortal(dialogContent, document.body);
}
