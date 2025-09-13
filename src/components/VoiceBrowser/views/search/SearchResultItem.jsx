import { ExternalLink, Bookmark, Volume2 } from "lucide-react";

export function SearchResultItem({
  result,
  preferences,
  getButtonStyles,
  onSelect,
  onOpen,
  onBookmark,
  onRead,
}) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        preferences.high_contrast
          ? "border-yellow-400 hover:bg-gray-800"
          : "border-white/20 hover:bg-white/10"
      } transition-colors cursor-pointer`}
      onClick={() => onSelect(result)}
    >
      <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
      <p className="text-sm opacity-75 mb-2">{result.displayUrl}</p>
      <p className="mb-3">{result.snippet}</p>
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(result);
          }}
          className={`flex items-center space-x-1 px-3 py-1 rounded ${getButtonStyles("secondary")} text-sm`}
        >
          <ExternalLink size={16} />
          <span>Open</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark(result);
          }}
          className={`flex items-center space-x-1 px-3 py-1 rounded ${getButtonStyles("secondary")} text-sm`}
        >
          <Bookmark size={16} />
          <span>Save</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRead(result);
          }}
          className={`flex items-center space-x-1 px-3 py-1 rounded ${getButtonStyles("secondary")} text-sm`}
        >
          <Volume2 size={16} />
          <span>Read</span>
        </button>
      </div>
    </div>
  );
}
