"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Class {
  id: string;
  name: string;
  color: string;
  emoji?: string;
}

interface ClassFilterProps {
  classes: Class[];
  selectedClasses: string[];
  onSelectionChange: (selectedClasses: string[]) => void;
}

export function ClassFilter({ classes, selectedClasses, onSelectionChange }: ClassFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Filter by Class</h3>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedCount} of {totalCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs h-6 px-2"
            >
              Clear All
            </Button>
          )}
          {selectedCount < totalCount && (
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              className="text-xs h-6 px-2"
            >
              Select All
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {classes.map((classItem) => {
          const isSelected = selectedClasses.includes(classItem.id);
          return (
            <Button
              key={classItem.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => toggleClass(classItem.id)}
              className={`h-8 px-3 text-xs transition-all ${
                isSelected 
                  ? "shadow-sm" 
                  : "hover:bg-gray-50"
              }`}
              style={isSelected ? {
                backgroundColor: classItem.color,
                borderColor: classItem.color,
                color: 'white'
              } : {
                borderColor: classItem.color,
                color: classItem.color
              }}
            >
              <span className="flex items-center gap-1">
                {classItem.emoji && <span>{classItem.emoji}</span>}
                <span>{classItem.name}</span>
                {isSelected && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </span>
            </Button>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <div className="mt-3 pt-3 border-t">
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
  );
}
