import { Clock, Code, Trash2 } from "lucide-react";

const HistoryPanel = ({ history, onSelect }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: "🟨",
      typescript: "🔷",
      python: "🐍",
      java: "☕",
      cpp: "⚡",
      csharp: "🔷",
      go: "🐹",
      rust: "🦀",
      php: "🐘",
      ruby: "💎",
      html: "🌐",
      css: "🎨",
      sql: "🗄️",
      bash: "💻",
      json: "📄",
    };
    return icons[language] || "📝";
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
          No History Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Your code generation history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto space-y-3">
      {history.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item)}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getLanguageIcon(item.language)}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                {item.language}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              {formatDate(item.timestamp)}
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
            {truncateText(item.prompt)}
          </p>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
            <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap line-clamp-3">
              {truncateText(item.code, 150)}
            </pre>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span>{item.code.split("\n").length} lines</span>
              {item.tokensUsed && <span>{item.tokensUsed} tokens</span>}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle delete if needed
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
              title="Delete from history"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryPanel;
