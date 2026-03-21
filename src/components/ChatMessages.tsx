"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { type UIMessage } from "ai";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export default function ChatMessages({
  messages,
  isLoading,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Track timestamps by message id
  const timestampMap = useRef<Map<string, Date>>(new Map());
  const timestamps = useMemo(() => {
    for (const msg of messages) {
      if (!timestampMap.current.has(msg.id)) {
        timestampMap.current.set(msg.id, new Date());
      }
    }
    return timestampMap.current;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-scroll on new messages / streaming
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;

    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isLoading, scrollToBottom]);

  // Track scroll position for "scroll to bottom" button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollBtn(distanceFromBottom > 200);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative"
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role as "user" | "assistant"}
            content={getTextContent(message)}
            timestamp={timestamps.get(message.id)}
          />
        ))}

        {isLoading &&
          messages[messages.length - 1]?.role === "user" && (
            <TypingIndicator />
          )}

        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-6 z-10 w-10 h-10 rounded-full bg-stadium-green text-white 
            shadow-lg flex items-center justify-center hover:bg-stadium-green-light 
            transition-all duration-200 animate-fade-in-up"
          aria-label="Scroll to bottom"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      )}
    </div>
  );
}
