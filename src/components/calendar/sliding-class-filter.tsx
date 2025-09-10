"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, ChevronRight } from "lucide-react";

interface Class {
  id: string;
  name: string;
  color: string;
  emoji?: string;
}

interface SlidingClassFilterProps {
  classes: Class[];
  selectedClasses: string[];
  onSelectionChange: (selectedClasses: string[]) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SlidingClassFilter({ classes, selectedClasses, onSelectionChange, isOpen: externalIsOpen, onClose }: SlidingClassFilterProps) {
  const [internalIsOpen, setIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const toggleClass = (classId: string) => {
    if (selectedClasses.includes(classId)) {
      onSelectionChange(selectedClasses.filter(id => id !== classId));
    } else {
      onSelectionChange([...selectedClasses, classId]);
    }
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const selectAll = () => {
    onSelectionChange(classes.map(c => c.id));
  };

  const selectedCount = selectedClasses.length;
  const totalCount = classes.length;

  return (
    <>
      {/* Toggle Button */}
      

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed h-screen inset-0 bg-black/20 z-80"
          onClick={() => onClose ? onClose() : setIsOpen(false)}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-90 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <h3 className="font-semibold">Filter by Class</h3>
              {selectedCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCount} of {totalCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose ? onClose() : setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              {selectedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs h-8"
                >
                  Clear All
                </Button>
              )}
              {selectedCount < totalCount && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                  className="text-xs h-8"
                >
                  Select All
                </Button>
              )}
            </div>

            {/* Class List */}
            <div className="space-y-2">
              {classes.map((classItem) => {
                const isSelected = selectedClasses.includes(classItem.id);
                return (
                  <div
                    key={classItem.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleClass(classItem.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                        style={{
                          backgroundColor: isSelected ? classItem.color : 'transparent',
                          borderColor: classItem.color
                        }}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {classItem.emoji && <span>{classItem.emoji}</span>}
                        <span className="font-medium text-sm">{classItem.name}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          {selectedCount > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex flex-wrap gap-1">
                {selectedClasses.map((classId) => {
                  const classItem = classes.find(c => c.id === classId);
                  if (!classItem) return null;
                  
                  return (
                    <Badge
                      key={classId}
                      variant="secondary"
                      className="text-xs h-6 px-2"
                      style={{
                        backgroundColor: `${classItem.color}20`,
                        borderColor: classItem.color,
                        color: classItem.color
                      }}
                    >
                      {classItem.emoji && <span className="mr-1">{classItem.emoji}</span>}
                      {classItem.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
