"use client";

import { useChat } from "@ai-sdk/react";
import Header from "@/components/Header";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function Home() {
  const { messages, sendMessage, status, error, regenerate, stop } = useChat();

  const hasMessages = messages.length > 0;
  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="h-full flex flex-col">
      <Header />

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

        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          onStop={stop}
        />
      </main>
    </div>
  );
}
