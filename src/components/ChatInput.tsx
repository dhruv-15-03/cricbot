"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
}

export default function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-stadium-green/10 bg-white/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about cricket..."
              disabled={isLoading}
              rows={1}
              className="w-full resize-none rounded-xl border border-stadium-green/20 bg-white px-4 py-3 pr-12
                text-sm leading-relaxed placeholder:text-foreground-muted/50
                focus:outline-none focus:ring-2 focus:ring-stadium-green/30 focus:border-stadium-green/40
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200"
            />
            <span className="absolute right-3 bottom-3 text-xs text-foreground-muted/40">
              {input.length > 0 && `${input.length}`}
            </span>
          </div>

          {isLoading ? (
            <button
              onClick={onStop}
              className="shrink-0 w-11 h-11 rounded-xl bg-cricket-red text-white flex items-center justify-center
                hover:bg-cricket-red-light transition-colors duration-200 shadow-sm"
              aria-label="Stop generating"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="currentColor"
              >
                <rect width="14" height="14" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="shrink-0 w-11 h-11 rounded-xl bg-stadium-green text-white flex items-center justify-center
                hover:bg-stadium-green-light transition-colors duration-200 shadow-sm
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-stadium-green"
              aria-label="Send message"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-center text-xs text-foreground-muted/40 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
