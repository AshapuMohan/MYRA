import { useState, useEffect } from "react";

const defaultPreferences = {
  language: "en-US",
  voice_speed: 1.0,
  high_contrast: false,
  font_size: "medium",
  dyslexia_friendly: false,
};

export function useAccessibility(preferencesData) {
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    if (preferencesData?.preferences) {
      setPreferences(preferencesData.preferences);
    }
  }, [preferencesData]);

  const getContainerStyles = () => {
    const baseStyles = "min-h-screen transition-all duration-300";
    const fontSizeClass = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
      "extra-large": "text-xl",
    }[preferences.font_size];

    const fontFamily = preferences.dyslexia_friendly
      ? "font-mono"
      : "font-sans";
    const colorScheme = preferences.high_contrast
      ? "bg-black text-yellow-400"
      : "bg-gradient-to-br from-blue-900 to-purple-900 text-white";

    return `${baseStyles} ${fontSizeClass} ${fontFamily} ${colorScheme}`;
  };

  const getCardStyles = () => {
    return preferences.high_contrast
      ? "bg-gray-900 border-2 border-yellow-400 text-yellow-400"
      : "bg-white/10 backdrop-blur-md border border-white/20 text-white";
  };

  const getButtonStyles = (variant = "primary") => {
    if (preferences.high_contrast) {
      return variant === "primary"
        ? "bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300"
        : "bg-transparent text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black";
    }
    return variant === "primary"
      ? "bg-blue-600 text-white border-2 border-blue-800 hover:bg-blue-700"
      : "bg-white/20 text-white border-2 border-white/30 hover:bg-white/30";
  };
  
  return {
    preferences,
    getContainerStyles,
    getCardStyles,
    getButtonStyles,
  };
}
