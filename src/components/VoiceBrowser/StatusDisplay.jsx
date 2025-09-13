export function StatusDisplay({ isListening, isSpeaking, transcript, getCardStyles }) {
  if (!isListening && !isSpeaking && !transcript) return null;
  
  return (
    <div className={`${getCardStyles()} rounded-lg p-4 mb-6 text-center`}>
      {isListening && <p className="text-lg">🎤 Listening...</p>}
      {isSpeaking && <p className="text-lg">🔊 Speaking...</p>}
      {transcript && (
        <p className="text-lg">
          <strong>You said:</strong> "{transcript}"
        </p>
      )}
    </div>
  );
}
