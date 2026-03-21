interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SUGGESTIONS = [
  { text: "What are the rules of T20 cricket?", icon: "📋" },
  { text: "Who has the most Test centuries?", icon: "🏆" },
  { text: "Explain the DRS system", icon: "📺" },
  { text: "Tell me about the 2011 World Cup final", icon: "🇮🇳" },
  { text: "What is a googly?", icon: "🎯" },
  { text: "Best IPL performances of all time", icon: "⭐" },
];

export default function SuggestedQuestions({
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-stadium-green/10 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-4 animate-fade-in-up">
          🏏
        </div>
        <h2 className="text-2xl font-bold text-stadium-green mb-2 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Welcome to CricBot
        </h2>
        <p className="text-foreground-muted max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Your AI-powered cricket expert. Ask me anything about rules, players,
          tournaments, records, or iconic moments!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {SUGGESTIONS.map((suggestion, i) => (
          <button
            key={suggestion.text}
            onClick={() => onSelect(suggestion.text)}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-stadium-green/10 
              hover:border-stadium-green/30 hover:bg-stadium-green/5 hover:shadow-sm
              transition-all duration-200 text-left group animate-fade-in-up"
            style={{ animationDelay: `${0.15 + i * 0.05}s` }}
          >
            <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
              {suggestion.icon}
            </span>
            <span className="text-sm text-foreground/80 group-hover:text-stadium-green transition-colors">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
