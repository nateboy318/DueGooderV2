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
import { Pencil, Loader2 } from "lucide-react";

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
      onClose();
    }
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
            <Input
              id="classEmoji"
              value={editedEmoji}
              onChange={(e) => setEditedEmoji(e.target.value)}
              placeholder="Enter emoji (e.g., 📚, 🧮, 🔬)"
              className="w-full"
              maxLength={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
            />
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
    </Dialog>
  );
}
