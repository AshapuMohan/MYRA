export function HomeView({ getCardStyles }) {
  return (
    <div className={`${getCardStyles()} rounded-lg p-8 text-center`}>
      <h2 className="text-2xl font-bold mb-4">Welcome to Voice Browser</h2>
      <div className="space-y-4 text-left max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold">Voice Commands:</h3>
        <ul className="space-y-2">
          <li>• "Search for [topic]" - Search the web</li>
          <li>• "Show bookmarks" - View saved bookmarks</li>
          <li>• "Show history" - View browsing history</li>
          <li>• "Open result" - Open first search result</li>
          <li>• "Open first link" - Open first search result</li>
          <li>• "Open second link" - Open second search result</li>
          <li>• "Open third link" - Open third search result</li>
          <li>• "Read result" - Read search result aloud</li>
          <li>• "Bookmark this" - Save current page</li>
          <li>• "Scroll up" - Move up on the page</li>
          <li>• "Scroll down" - Move down on the page</li>
          <li>• "Settings" - Open accessibility settings</li>
          <li>• "Stop speaking" - Stop text-to-speech</li>
        </ul>
        <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">💡 Pro Tips:</h4>
          <ul className="space-y-1 text-sm">
            <li>• You can open up to the fifth search result by number</li>
            <li>• Voice assistant stays always on while you're signed in</li>
            <li>• All commands work hands-free for accessibility</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
