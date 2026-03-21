"use client";

import { useChat } from "@ai-sdk/react";
import Header from "@/components/Header";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function Home() {
  const { messages, sendMessage, status, error, regenerate, stop, setMessages } = useChat();

  const hasMessages = messages.length > 0;
  const isLoading = status === "submitted" || status === "streaming";
  const isStreaming = status === "streaming";

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-full flex flex-col">
      <Header onNewChat={handleNewChat} hasMessages={hasMessages} />

      <main className="flex-1 flex flex-col min-h-0 pitch-pattern">
        {hasMessages ? (
          <ChatMessages messages={messages} isLoading={isLoading} />
        ) : (
          <SuggestedQuestions onSelect={handleSend} />
        )}

        {/* Error display */}
        {error && (
          <div className="max-w-3xl mx-auto px-4 pb-2 w-full">
            <ErrorDisplay error={error} onRetry={() => regenerate()} />
          </div>
        )}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="max-w-3xl mx-auto px-4 w-full">
            <div className="flex items-center gap-2 py-1">
              <span className="w-1.5 h-1.5 bg-stadium-green rounded-full animate-pulse" />
              <span className="text-xs text-foreground-muted/60">CricBot is typing...</span>
            </div>
          </div>
        )}

        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          onStop={stop}
        />
      </main>
    </div>
  );
}
