# Duey Chatbot Feature

## Overview
Duey is a ChatGPT-style assistant that helps students understand and prioritize their academic workload using their class schedule and assignments.

## Features
- **Streaming Responses**: Real-time token-by-token responses like ChatGPT
- **Class Data Grounding**: Uses the user's actual class schedule and assignments
- **Weekly Focus**: Prioritizes "today" and "this week" assignments
- **Mobile Responsive**: Works on both desktop and mobile devices
- **Rate Limiting**: 60 requests per hour per user
- **Error Handling**: Comprehensive error states and retry functionality

## Components

### MessageBubble
- Displays user and assistant messages
- Supports streaming indicator
- Different styling for user vs assistant messages

### ChatInput
- Auto-resizing textarea
- Keyboard shortcuts (Enter to send, Shift+Enter for newline, Esc to clear)
- Loading states and disabled states

### EmptyState
- Welcome screen with suggestion chips
- Quick action buttons for common queries

## API Endpoint

### POST /api/duey/chat
- **Authentication**: Required (uses withAuthRequired)
- **Rate Limiting**: 60 requests/hour per user
- **Streaming**: Server-sent events for real-time responses
- **Data Grounding**: Automatically injects user's class data into prompts

#### Request Body
```json
{
  "messages": [
    { "role": "user", "content": "What's due this week?" }
  ],
  "options": {
    "maxTokens": 600,
    "temperature": 0.3
  }
}
```

#### Response
Streaming response with data chunks:
```
data: {"content": "Here's your week at a glance..."}
data: {"done": true}
```

## Environment Variables Required
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Model to use (default: "gpt-4o-mini")

## Usage
1. Navigate to `/app/duey`
2. Ask questions about your classes and assignments
3. Get personalized, data-grounded responses

## Example Queries
- "What's due this week?"
- "What should I focus on today?"
- "Make a plan for CS201"
- "List all assignments by urgency"
- "What's my most important task?"

## Data Structureev
The chatbot uses the user's `classes` field from the database:
```typescript
classes: {
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
}[]
```

## Security
- All routes are authentication-protected
- Rate limiting prevents abuse
- Input validation and sanitization
- No data persistence (V1 design)
- Only uses current user's data
