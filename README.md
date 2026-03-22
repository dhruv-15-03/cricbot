# 🏏 CricBot — Your AI Cricket Expert

A purpose-built cricket chatbot powered by Google Gemini with RAG (Retrieval-Augmented Generation) from a curated cricket knowledge base. Not a generic chat wrapper — CricBot is designed specifically for cricket enthusiasts who want accurate, contextual answers about rules, players, tournaments, terminology, and iconic moments.

![CricBot Screenshot](screenshot.png)

## Why Cricket?

Cricket is a sport with incredibly deep history, complex rules, and passionate fans across the globe. There's a massive knowledge gap between casual fans and experts — understanding LBW decisions, DRS technology, DLS method, or why Bradman's 99.94 average is so extraordinary requires context that generic AI often gets wrong. CricBot bridges that gap with a curated knowledge base of 65+ detailed entries ensuring accurate, sourced answers.

## Tech Stack

| Layer          | Technology                                                      |
| -------------- | --------------------------------------------------------------- |
| **Framework**  | Next.js 16 (App Router, TypeScript)                             |
| **Styling**    | Tailwind CSS 4                                                  |
| **LLM**        | Google Gemini 2.0 Flash (free tier)                             |
| **AI SDK**     | Vercel AI SDK v6 (`ai` + `@ai-sdk/react`)                       |
| **RAG**        | In-memory cosine similarity over pre-computed Gemini embeddings |
| **Deployment** | Vercel                                                          |

## Architecture

```
User → Next.js Frontend (useChat hook)
  → API Route (/api/chat)
    → Embed user query (Gemini text-embedding-004)
    → Cosine similarity search over local JSON embeddings
    → Top-5 relevant chunks → inject into system prompt
    → streamText (Gemini 2.0 Flash) → stream response back
```

### How RAG Works

1. **Knowledge Base**: 65+ curated text chunks covering cricket rules, player records, tournament history, terminology, and iconic moments stored in `cricket-knowledge.json`
2. **Pre-computed Embeddings**: Each chunk is embedded using Gemini's `text-embedding-004` model and stored as a JSON file — no external vector database needed
3. **Query-time Retrieval**: When a user asks a question, their query is embedded and compared against all chunks using cosine similarity
4. **Context Injection**: The top-5 most relevant chunks (above a 0.3 similarity threshold) are injected into the system prompt, giving Gemini specific, accurate context to draw from
5. **Streaming Response**: Gemini streams the response token-by-token for a real-time conversational feel

## Features

- **Cricket stadium aesthetic** — Green/cream theme inspired by a cricket ground
- **RAG-powered answers** — Responses grounded in a curated knowledge base, not just generic LLM knowledge
- **Streaming responses** — Real-time token-by-token streaming with typing indicator
- **Suggested questions** — 6 starter prompts for quick exploration
- **Topic-gated** — Politely redirects non-cricket questions
- **Markdown rendering** — Rich formatting for stats, tables, lists
- **Error handling** — Cricket-themed error messages ("Looks like we got bowled out!")
- **Mobile responsive** — Full-width on mobile, centered max-width on desktop
- **Auto-scroll** — Smooth scroll to latest message

## Local Development

### Prerequisites

- Node.js 18+
- A Google Gemini API key (free at [Google AI Studio](https://aistudio.google.com/apikey))

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/cricbot.git
cd cricbot

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GOOGLE_GENERATIVE_AI_API_KEY

# Generate embeddings (one-time)
npm run generate-embeddings

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see CricBot.

### Generating Embeddings

The knowledge base embeddings need to be generated once before the chatbot can use RAG:

```bash
npm run generate-embeddings
```

This reads `src/data/cricket-knowledge.json`, calls Gemini's embedding API for each chunk, and saves the result to `src/data/cricket-embeddings.json`. The embeddings file is committed to the repo so you don't need to regenerate unless you update the knowledge base.

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts    # POST handler: RAG retrieval + Gemini streaming
│   ├── globals.css           # Cricket theme, animations, markdown styles
│   ├── layout.tsx            # Root layout with meta tags
│   └── page.tsx              # Main chat page with empty state + chat
├── components/
│   ├── ChatInput.tsx         # Input bar with send/stop buttons
│   ├── ChatMessages.tsx      # Message list with auto-scroll
│   ├── ErrorDisplay.tsx      # Cricket-themed error messages
│   ├── Header.tsx            # Top bar with CricBot branding
│   ├── MessageBubble.tsx     # User/bot message bubbles with markdown
│   ├── SuggestedQuestions.tsx # Starter question chips
│   └── TypingIndicator.tsx   # Animated loading dots
├── data/
│   ├── cricket-knowledge.json    # Curated knowledge base (65+ entries)
│   └── cricket-embeddings.json   # Pre-computed vector embeddings
└── lib/
    └── rag.ts                # Cosine similarity search + embedding
scripts/
└── generate-embeddings.ts    # One-time embedding generation script
```

## Deployed Link

**Live**: [Vercel](https://cricbot-eight.vercel.app/)

## License

MIT

