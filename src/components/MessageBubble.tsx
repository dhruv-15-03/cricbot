"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export default function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  if (!content) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeStr = timestamp
    ? timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div
      className={`flex items-start gap-3 animate-fade-in-up group ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
          isUser
            ? "bg-stadium-green text-white font-bold"
            : "bg-stadium-green text-white"
        }`}
      >
        {isUser ? "You" : "🏏"}
      </div>

      {/* Bubble + meta */}
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-4 py-3 shadow-sm ${
            isUser
              ? "bg-stadium-green text-white rounded-2xl rounded-tr-sm"
              : "bg-white text-foreground rounded-2xl rounded-tl-sm border border-gray-100"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          ) : (
            <div className="text-sm leading-relaxed bot-message">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer: timestamp + copy */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${isUser ? "flex-row-reverse" : ""}`}>
          {timeStr && (
            <span className="text-[10px] text-foreground-muted/50">{timeStr}</span>
          )}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                text-[10px] text-foreground-muted/50 hover:text-foreground-muted flex items-center gap-1"
              aria-label="Copy response"
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
