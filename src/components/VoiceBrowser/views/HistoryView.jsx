export function HistoryView({ historyData, getCardStyles, preferences }) {
  return (
    <div className={`${getCardStyles()} rounded-lg p-6`}>
      <h2 className="text-2xl font-bold mb-4">Browsing History</h2>
      {historyData?.history?.length > 0 ? (
        <div className="space-y-4">
          {historyData.history.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-lg border ${
                preferences.high_contrast ? "border-yellow-400" : "border-white/20"
              }`}
            >
              <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
              <p className="text-sm opacity-75 mb-2">{entry.url}</p>
              <p className="text-xs opacity-60">
                {new Date(entry.visited_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-8">No browsing history yet.</p>
      )}
    </div>
  );
}
