"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Loader2, Smile } from "lucide-react";
import { EmojiPicker } from "@/components/ui/emoji-picker";

interface EditNameModalProps {
  currentName: string;
  currentEmoji: string;
  classId: string;
  onNameUpdate: (newName: string, newEmoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function EditNameModal({ currentName, currentEmoji, classId, onNameUpdate, isOpen, onClose }: EditNameModalProps) {
  const [editedName, setEditedName] = useState(currentName);
  const [editedEmoji, setEditedEmoji] = useState(currentEmoji);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Sync editedName and editedEmoji with current values when they change
  useEffect(() => {
    setEditedName(currentName);
    setEditedEmoji(currentEmoji);
  }, [currentName, currentEmoji]);

  const handleSave = async () => {
    if (editedName.trim() === "" || (editedName.trim() === currentName && editedEmoji === currentEmoji)) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/app/classes/update-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: classId,
          newName: editedName.trim(),
          newEmoji: editedEmoji,
        }),
      });

      if (response.ok) {
        onNameUpdate(editedName.trim(), editedEmoji);
        onClose();
      } else {
        console.error("Failed to update class name and emoji");
        setEditedName(currentName); // Reset to original name
        setEditedEmoji(currentEmoji); // Reset to original emoji
      }
    } catch (error) {
      console.error("Error updating class name and emoji:", error);
      setEditedName(currentName); // Reset to original name
      setEditedEmoji(currentEmoji); // Reset to original emoji
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedName(currentName);
    setEditedEmoji(currentEmoji);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditedName(currentName);
      setEditedEmoji(currentEmoji);
      setShowEmojiPicker(false);
      onClose();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setEditedEmoji(emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Class Name & Emoji
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter a new name and emoji for this class.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="className">Class Name</Label>
            <Input
              id="className"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Enter class name"
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="classEmoji">Emoji</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmojiPicker(true)}
                className="h-10 px-3 text-lg hover:bg-gray-50"
              >
                {editedEmoji || "📚"}
              </Button>
              <span className="text-sm text-gray-500">Click to choose emoji</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || editedName.trim() === ""}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Emoji Picker */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleEmojiSelect}
        currentEmoji={editedEmoji}
      />
    </Dialog>
  );
}
