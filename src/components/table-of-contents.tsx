'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TableOfContentsProps {
  headings: Array<{
    id: string
    text: string
    level: number
  }>
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  return (
    <nav className="space-y-2 text-sm relative z-60 ">
      <p className="font-medium mb-4">Table of Contents</p>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={cn(
            'block text-muted-foreground hover:text-foreground transition-colors',
            {
              'pl-4': heading.level === 3,
              'pl-8': heading.level === 4,
              'text-foreground font-medium': activeId === heading.id,
            }
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  )
} 