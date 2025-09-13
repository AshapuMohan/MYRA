import { SearchResultItem } from "./search/SearchResultItem";

export function SearchView({
  searchQuery,
  searchResults,
  searchLoading,
  getCardStyles,
  getButtonStyles,
  preferences,
  onSelectResult,
  onOpenResult,
  onBookmarkResult,
  onReadResult,
}) {
  return (
    <div className="space-y-6">
      <div className={`${getCardStyles()} rounded-lg p-6`}>
        <h2 className="text-2xl font-bold mb-4">Search Results</h2>
        {searchQuery && <p className="text-lg mb-4">Results for: "{searchQuery}"</p>}

        {searchLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto"></div>
            <p className="mt-4">Searching...</p>
          </div>
        )}

        {searchResults?.results?.length > 0 && (
          <div className="space-y-4">
            {searchResults.results.map((result, index) => (
              <SearchResultItem
                key={index}
                result={result}
                preferences={preferences}
                getButtonStyles={getButtonStyles}
                onSelect={onSelectResult}
                onOpen={onOpenResult}
                onBookmark={onBookmarkResult}
                onRead={onReadResult}
              />
            ))}
          </div>
        )}
         {!searchLoading && !searchResults?.results && (
             <p className="text-center py-8">
                Say "Search for..." to begin.
             </p>
         )}
      </div>
    </div>
  );
}
