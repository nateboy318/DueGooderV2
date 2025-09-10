import React from 'react';

// Clean, simple markdown renderer for chat messages
export function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split by lines to handle different markdown elements
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <pre key={i} className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-x-auto my-3 text-sm font-mono">
            <code>{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Handle empty lines
    if (line.trim() === '') {
      elements.push(<br key={i} />);
      continue;
    }

    // Handle headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
          {line.substring(4)}
        </h3>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-gray-900 mt-4 mb-3">
          {line.substring(3)}
        </h2>
      );
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-2xl font-bold text-gray-900 mt-4 mb-3">
          {line.substring(2)}
        </h1>
      );
      continue;
    }

    // Handle blockquotes
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-blue-200 pl-4 py-2 my-3 bg-blue-50 text-gray-700 italic">
          {renderInlineMarkdown(line.substring(2))}
        </blockquote>
      );
      continue;
    }

    // Handle bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1">
          <span className="text-gray-400 mt-1">•</span>
          <span>{renderInlineMarkdown(line.substring(2))}</span>
        </div>
      );
      continue;
    }

    // Handle numbered lists
    if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.+)/);
      if (match) {
        elements.push(
          <div key={i} className="flex items-start gap-2 my-1">
            <span className="text-gray-600 font-medium min-w-[20px]">{match[1]}.</span>
            <span>{renderInlineMarkdown(match[2])}</span>
          </div>
        );
      }
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="mb-2 leading-relaxed">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  // Handle any remaining code block
  if (inCodeBlock && codeBlockContent.length > 0) {
    elements.push(
      <pre key="final-code" className="bg-gray-50 border border-gray-200 p-4 rounded-lg overflow-x-auto my-3 text-sm font-mono">
        <code>{codeBlockContent.join('\n')}</code>
      </pre>
    );
  }

  return <div className="space-y-1">{elements}</div>;
}

// Clean inline markdown renderer
function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Handle bold text
  let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // Handle italic text
  processedText = processedText.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');
  
  // Handle inline code
  processedText = processedText.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>');
  
  // Handle links
  processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Split by HTML tags and render
  const parts = processedText.split(/(<[^>]+>)/);
  return parts.map((part, index) => {
    if (part.startsWith('<')) {
      return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    }
    return part;
  });
}