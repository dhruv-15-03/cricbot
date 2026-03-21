import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  if (!content) return null;

  return (
    <div
      className={`flex items-start gap-3 animate-fade-in-up ${
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

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-3 shadow-sm ${
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
    </div>
  );
}
