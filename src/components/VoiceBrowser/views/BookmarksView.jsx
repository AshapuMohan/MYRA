import { ExternalLink } from "lucide-react";

export function BookmarksView({
  bookmarksData,
  getCardStyles,
  getButtonStyles,
  preferences,
  onOpenBookmark,
}) {
  return (
    <div className={`${getCardStyles()} rounded-lg p-6`}>
      <h2 className="text-2xl font-bold mb-4">Bookmarks</h2>
      {bookmarksData?.bookmarks?.length > 0 ? (
        <div className="space-y-4">
          {bookmarksData.bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className={`p-4 rounded-lg border ${
                preferences.high_contrast ? "border-yellow-400" : "border-white/20"
              }`}
            >
              <h3 className="text-lg font-semibold mb-2">{bookmark.title}</h3>
              <p className="text-sm opacity-75 mb-3">{bookmark.url}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => onOpenBookmark(bookmark)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded ${getButtonStyles("secondary")} text-sm`}
                >
                  <ExternalLink size={16} />
                  <span>Open</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-8">
          No bookmarks yet. Say "bookmark this" while viewing a search result to save it.
        </p>
      )}
    </div>
  );
}
