"use client"

import { useState } from "react"
// Removed icon imports - using emojis instead
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ViewSwitcher } from "@/components/calendar/view-switcher"
import { cn } from "@/lib/utils"
import type { CalendarView } from "@/components/event-calendar"
import { RiFilter3Line } from "@remixicon/react"

interface CalendarToolbarProps {
  onFilterClick: () => void
  onSearch: (query: string) => void
  onAddEvent: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  isFilterOpen?: boolean
  currentView: CalendarView
  onViewChange: (view: CalendarView) => void
}

export function CalendarToolbar({
  onFilterClick,
  onSearch,
  onAddEvent,
  searchQuery,
  onSearchChange,
  isFilterOpen = false,
  currentView,
  onViewChange,
}: CalendarToolbarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  // Hide toolbar when filter is open
  if (isFilterOpen) {
    return null
  }

  return (
    <div className="fixed bottom-0 right-0 left-0 max-w-lg mx-auto z-50 bg-gray-100 rounded-md p-4 shadow-md">
      <div className="flex items-center gap-2 bg-white rounded-md px-4 py-2">
        {/* Filter Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onFilterClick}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
        >
          <span className="text-base"><RiFilter3Line /></span>
        </Button>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <div className="relative">
            <p className="absolute left-2 top-3 transform -translate-y-1/2 h-4 w-4 text-gray-400">
              🔍
            </p>
            <Input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "w-64 pl-8 pr-4 h-8 text-sm border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300",
                isSearchFocused && "ring-1 ring-blue-300 border-blue-300"
              )}
            />
          </div>
        </form>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-200" />

        {/* View Switcher */}
        <ViewSwitcher
          currentView={currentView}
          onViewChange={onViewChange}
        />

        {/* Separator */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Add Event Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddEvent}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
        >
          <span className="text-base">➕</span>
        </Button>
      </div>
    </div>
  )
}
