interface HeaderProps {
  onNewChat?: () => void;
  hasMessages?: boolean;
}

export default function Header({ onNewChat, hasMessages }: HeaderProps) {
  return (
    <header className="bg-stadium-green text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-2xl shrink-0">
          🏏
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">CricBot</h1>
          <p className="text-xs text-white/70">Your AI Cricket Expert</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {hasMessages && onNewChat && (
            <button
              onClick={onNewChat}
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white 
                bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all duration-200"
              aria-label="Start new chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Chat
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-ring" />
            <span className="text-xs text-white/60">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
