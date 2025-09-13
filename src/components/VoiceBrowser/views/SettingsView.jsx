export function SettingsView({
  preferences,
  onUpdatePreferences,
  getCardStyles,
  getButtonStyles,
}) {
  return (
    <div className={`${getCardStyles()} rounded-lg p-6`}>
      <h2 className="text-2xl font-bold mb-6">Accessibility Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold mb-2">Language</label>
          <select
            value={preferences.language}
            onChange={(e) => onUpdatePreferences({ language: e.target.value })}
            className="w-full p-3 rounded-lg bg-black/20 border border-white/30 text-white"
          >
            <option value="en-US">English (US)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="it-IT">Italian</option>
            <option value="pt-BR">Portuguese</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            Voice Speed: {preferences.voice_speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={preferences.voice_speed}
            onChange={(e) => onUpdatePreferences({ voice_speed: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Font Size</label>
          <select
            value={preferences.font_size}
            onChange={(e) => onUpdatePreferences({ font_size: e.target.value })}
            className="w-full p-3 rounded-lg bg-black/20 border border-white/30 text-white"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.high_contrast}
              onChange={(e) => onUpdatePreferences({ high_contrast: e.target.checked })}
              className="w-5 h-5"
            />
            <span className="text-lg">High Contrast Mode</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.dyslexia_friendly}
              onChange={(e) => onUpdatePreferences({ dyslexia_friendly: e.target.checked })}
              className="w-5 h-5"
            />
            <span className="text-lg">Dyslexia-Friendly Font</span>
          </label>
        </div>

        <div className="pt-4 border-t border-white/20">
          <a
            href="/account/logout"
            className={`inline-block px-6 py-3 rounded-lg ${getButtonStyles("secondary")} text-center`}
          >
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
}
