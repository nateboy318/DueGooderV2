"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, BookOpen, Briefcase, Coffee } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay, isToday, isPast } from "date-fns";

interface Timeblock {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: string;
  classId?: string;
  assignmentId?: string;
  completed: boolean;
}

interface CalendarProps {
  timeblocks: Timeblock[];
  onTimeblockClick?: (timeblock: Timeblock) => void;
  onTimeblockComplete?: (timeblockId: string) => void;
}

const typeIcons = {
  study: BookOpen,
  break: Coffee,
  exam: Briefcase,
  project: Briefcase,
  meeting: Clock,
  other: Clock,
};

const typeColors = {
  study: "bg-blue-100 border-blue-300 text-blue-800",
  break: "bg-green-100 border-green-300 text-green-800",
  exam: "bg-red-100 border-red-300 text-red-800",
  project: "bg-purple-100 border-purple-300 text-purple-800",
  meeting: "bg-orange-100 border-orange-300 text-orange-800",
  other: "bg-gray-100 border-gray-300 text-gray-800",
};

export function Calendar({ 
  timeblocks, 
  onTimeblockClick, 
  onTimeblockComplete
}: CalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>(() => {
    // Initialize with current week to prevent empty array on first render
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  useEffect(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 0 }); // Sunday
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDays(days);
  }, [currentWeek]);

  const getTimeblocksForDay = (day: Date) => {
    return timeblocks
      .filter(tb => {
        const tbDate = new Date(tb.startTime);
        return isSameDay(tbDate, day);
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const getTypeIcon = (type: string) => {
    const IconComponent = typeIcons[type as keyof typeof typeIcons] || Clock;
    return <IconComponent className="w-3 h-3" />;
  };

  const getTypeColor = (type: string) => {
    return typeColors[type as keyof typeof typeColors] || typeColors.other;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">
          {weekDays.length >= 7 ? (
            `${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`
          ) : (
            'Loading...'
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-xs"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.length >= 7 ? weekDays.map((day, index) => {
            const dayTimeblocks = getTimeblocksForDay(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div key={day.toISOString()} className="min-h-[120px]">
                <div className={`text-center text-sm font-medium mb-2 ${
                  isCurrentDay ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  <div className="text-xs uppercase tracking-wide">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-lg ${isCurrentDay ? 'font-bold' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>
                
                <div className="space-y-1">
                  {dayTimeblocks.map((timeblock) => {
                    const isPastTimeblock = isPast(new Date(timeblock.startTime));
                    const IconComponent = typeIcons[timeblock.type as keyof typeof typeIcons] || Clock;
                    
                    return (
                      <div
                        key={timeblock.id}
                        className={`p-2 rounded-md border text-xs cursor-pointer transition-all hover:shadow-sm ${
                          timeblock.completed 
                            ? 'opacity-60 line-through bg-gray-100 border-gray-300 text-gray-600'
                            : getTypeColor(timeblock.type)
                        } ${isPastTimeblock && !timeblock.completed ? 'opacity-75' : ''}`}
                        onClick={() => onTimeblockClick?.(timeblock)}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <IconComponent className="w-3 h-3" />
                          <span className="font-medium truncate">
                            {timeblock.title}
                          </span>
                        </div>
                        <div className="text-xs opacity-75">
                          {formatTime(timeblock.startTime)} - {formatTime(timeblock.endTime)}
                        </div>
                        {timeblock.description && (
                          <div className="text-xs opacity-60 truncate mt-1">
                            {timeblock.description}
                          </div>
                        )}
                        {!timeblock.completed && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 px-1 text-xs mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTimeblockComplete?.(timeblock.id);
                            }}
                          >
                            ✓
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }) : (
            // Loading state when weekDays is not ready
            Array.from({ length: 7 }, (_, index) => (
              <div key={index} className="min-h-[120px]">
                <div className="text-center text-sm text-gray-400 mb-2">
                  <div className="text-xs uppercase tracking-wide">---</div>
                  <div className="text-lg">--</div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
