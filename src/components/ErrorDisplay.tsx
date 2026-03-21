interface ErrorDisplayProps {
  error: Error | undefined;
  onRetry: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  if (!error) return null;

  const msg = error.message || "";
  const isRateLimit = msg.includes("429");
  
  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      <div className="w-8 h-8 bg-cricket-red/10 rounded-lg flex items-center justify-center text-sm shrink-0">
        ⚠️
      </div>
      <div className="bg-cricket-red/5 border border-cricket-red/20 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
        <p className="text-sm font-medium text-cricket-red mb-1">
          {isRateLimit
            ? "Whoa, too many deliveries! 🏏"
            : "Looks like we got bowled out!"}
        </p>
        <p className="text-xs text-foreground-muted mb-3">
          {isRateLimit
            ? "The AI service is temporarily overloaded. We already retried with backup models — please wait about 30 seconds and try again."
            : msg || "Something went wrong while generating a response. Let's try that again."}
        </p>
        <button
          onClick={onRetry}
          className="text-xs font-medium text-cricket-red hover:text-cricket-red-light 
            bg-white px-3 py-1.5 rounded-lg border border-cricket-red/20 
            hover:border-cricket-red/40 transition-all duration-200"
        >
          🔄 Try Again
        </button>
      </div>
    </div>
  );
}
