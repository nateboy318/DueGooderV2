"use client"

import { useState } from "react"
// Removed icon imports - using emojis instead
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CalendarView } from "@/components/event-calendar"

interface ViewSwitcherProps {
  currentView: CalendarView
  onViewChange: (view: CalendarView) => void
  className?: string
}

const viewOptions = [
  {
    value: "month" as CalendarView,
    label: "Month",
    emoji: "📅",
    description: "Monthly overview"
  },
  {
    value: "week" as CalendarView,
    label: "Week", 
    emoji: "📆",
    description: "Weekly schedule"
  },
  {
    value: "day" as CalendarView,
    label: "Day",
    emoji: "📅",
    description: "Daily details"
  },
  {
    value: "agenda" as CalendarView,
    label: "Agenda",
    emoji: "📋",
    description: "List view"
  }
]

export function ViewSwitcher({ currentView, onViewChange, className }: ViewSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-3 hover:bg-gray-100 rounded-lg"
      >
        {(() => {
          const currentOption = viewOptions.find(option => option.value === currentView);
          return currentOption ? <span className="mr-2">{currentOption.emoji}</span> : null;
        })()}
        <span className="text-sm font-medium">
          {viewOptions.find(option => option.value === currentView)?.label}
        </span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute bottom-10 -right-16 mb-2 w-64 bg-white rounded-lg shadow-sm border border-gray-200 z-50">
            <div className="p-2">
              {viewOptions.map((option) => {
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onViewChange(option.value)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-left rounded-md transition-colors my-1",
                      currentView === option.value
                        ? "bg-gray-100 text-black"
                        : "hover:bg-gray-100 text-gray-700 hover:cursor-pointer"
                    )}
                  >
                    <span className="mr-3 text-base">{option.emoji}</span>
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
