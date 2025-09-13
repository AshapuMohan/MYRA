import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export function VoiceControls({
  isVoiceEnabled,
  isListening,
  isSpeaking,
  onToggleVoice,
  onStopSpeaking,
  getButtonStyles,
}) {
  return (
    <div className="flex justify-center space-x-4 mb-8">
      <button
        onClick={onToggleVoice}
        className={`p-4 rounded-full transition-all duration-200 ${
          isVoiceEnabled ? getButtonStyles("primary") : getButtonStyles("secondary")
        } ${isListening ? "animate-pulse" : ""}`}
        aria-label={isVoiceEnabled ? "Voice assistant is on" : "Voice assistant is off"}
        title={isVoiceEnabled ? "Click to turn off voice assistant" : "Click to turn on voice assistant"}
      >
        {isVoiceEnabled && isListening ? <Mic size={32} /> : <MicOff size={32} />}
      </button>
      <button
        onClick={onStopSpeaking}
        className={`p-4 rounded-full ${getButtonStyles("secondary")} transition-all duration-200`}
        aria-label="Stop speaking"
        disabled={!isSpeaking}
      >
        {isSpeaking ? <VolumeX size={32} /> : <Volume2 size={32} />}
      </button>
    </div>
  );
}
