export function Header({ isListening }) {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-2">Voice Browser</h1>
      <p className="text-xl opacity-90">Navigate the web with your voice</p>
      {isListening && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-lg font-semibold">Voice Assistant Active</span>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      )}
    </header>
  );
}
