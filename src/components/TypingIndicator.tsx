export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      <div className="w-8 h-8 bg-stadium-green rounded-lg flex items-center justify-center text-sm shrink-0">
        🏏
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-stadium-green/60 rounded-full animate-bounce-dot" />
          <span
            className="w-2 h-2 bg-stadium-green/60 rounded-full animate-bounce-dot"
            style={{ animationDelay: "0.16s" }}
          />
          <span
            className="w-2 h-2 bg-stadium-green/60 rounded-full animate-bounce-dot"
            style={{ animationDelay: "0.32s" }}
          />
        </div>
      </div>
    </div>
  );
}
