"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import useSWR from 'swr';

interface Class {
  id: string;
  name: string;
  colorHex: string;
  emoji: string;
  assignments: {
    id: string;
    name: string;
    dueDate: string;
    description?: string;
    completed: boolean;
  }[];
}

interface AppDataContextType {
  classes: Class[];
  classesLoading: boolean;
  classesError: any;
  mutateClasses: (data?: any, shouldRevalidate?: boolean) => Promise<any>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { data: classesResponse, error: classesError, mutate: mutateClasses } = useSWR<{success: boolean, classes: Class[], count: number}>('/api/app/classes');
  
  const value = {
    classes: classesResponse?.classes || [],
    classesLoading: !classesResponse && !classesError,
    classesError,
    mutateClasses,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
