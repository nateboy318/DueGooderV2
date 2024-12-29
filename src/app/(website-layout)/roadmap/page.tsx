'use client';

import { format } from 'date-fns';
import useSWR from 'swr';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "LAUNCHED" | "IN_PROGRESS" | "TODO";
}

function RoadmapSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div 
          key={i}
          className="relative pl-8 pb-12 last:pb-0"
        >
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
          
          {/* Timeline dot */}
          <div className="absolute left-[-5px] top-0 h-[10px] w-[10px] rounded-full bg-gray-200 animate-pulse" />

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2 flex-1">
                {/* Title skeleton */}
                <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse" />
                {/* Date skeleton */}
                <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse" />
              </div>
              {/* Status badge skeleton */}
              <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
            </div>
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded-md w-4/6 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function PublicRoadmapPage() {
  const { data: items, isLoading } = useSWR<RoadmapItem[]>('/api/roadmap');

  // Sort items by date (newest first)
  const sortedItems = items?.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-4">Product Roadmap</h1>
            <p className="text-gray-600">
              Track our progress and see what&apos;s coming next
            </p>
          </div>
          <Link href="/dashboard/request-a-feature">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Request a Feature
            </Button>
          </Link>
        </div>

        {/* Suggestion banner for mobile */}
        <div className="md:hidden bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">
            Have a suggestion?
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            We&apos;d love to hear your ideas for improving our platform.
          </p>
          <Link 
            href="/dashboard/request-a-feature"
            className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            <span>Request a feature</span>
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="space-y-12">
          {isLoading ? (
            <RoadmapSkeleton />
          ) : (
            sortedItems?.map((item) => (
              <div 
                key={item.id}
                className="relative pl-8 pb-12 last:pb-0"
              >
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
                
                {/* Timeline dot */}
                <div className={`absolute left-[-5px] top-0 h-[10px] w-[10px] rounded-full ${
                  item.status === 'LAUNCHED' ? 'bg-green-500' :
                  item.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`} />

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                      <time className="text-sm text-gray-500">
                        {format(new Date(item.date), 'MMMM d, yyyy')}
                      </time>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'LAUNCHED' ? 'bg-green-100 text-green-800' :
                      item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'IN_PROGRESS' ? 'In Progress' :
                       item.status === 'LAUNCHED' ? 'Launched' : 'Planned'}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 