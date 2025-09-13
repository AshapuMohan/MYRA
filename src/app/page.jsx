import { useState, useCallback, useRef, useEffect } from "react";
import useUser from "@/utils/useUser";
import { useApi } from "@/hooks/useApi";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useVoiceControl } from "@/hooks/useVoiceControl";

import { LoadingView } from "@/components/common/LoadingView";
import { UnauthenticatedView } from "@/components/Auth/UnauthenticatedView";
import { Header } from "@/components/VoiceBrowser/Header";
import { VoiceControls } from "@/components/VoiceBrowser/VoiceControls";
import { StatusDisplay } from "@/components/VoiceBrowser/StatusDisplay";
import { Navigation } from "@/components/VoiceBrowser/Navigation";
import { HomeView } from "@/components/VoiceBrowser/views/HomeView";
import { SearchView } from "@/components/VoiceBrowser/views/SearchView";
import { BookmarksView } from "@/components/VoiceBrowser/views/BookmarksView";
import { HistoryView } from "@/components/VoiceBrowser/views/HistoryView";
import { SettingsView } from "@/components/VoiceBrowser/views/SettingsView";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [currentView, setCurrentView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  const commandHandlerRef = useRef(() => {});

  const {
    preferencesData,
    bookmarksData,
    historyData,
    searchResults,
    searchLoading,
    performSearch,
    addBookmark,
    addToHistory,
    updatePreferences,
  } = useApi(user);

  const { preferences, getContainerStyles, getCardStyles, getButtonStyles } =
    useAccessibility(preferencesData);

  const { isListening, isSpeaking, transcript, speak, stopSpeaking } =
    useVoiceControl({
      user,
      isVoiceEnabled,
      language: preferences.language,
      voice_speed: preferences.voice_speed,
      onCommand: (command) => commandHandlerRef.current(command),
    });

  const processVoiceCommand = useCallback(
    (command) => {
      console.log("Processing command:", command);

      if (command.includes("search for") || command.includes("find")) {
        const searchTerm = command.replace(/^(search for|find)\s+/, "");
        setSearchQuery(searchTerm);
        performSearch(searchTerm);
        setCurrentView("search");
        speak(`Searching for ${searchTerm}`);
      } else if (
        command.includes("bookmark this") ||
        command.includes("save bookmark")
      ) {
        if (selectedResult) {
          addBookmark.mutate(
            {
              title: selectedResult.title,
              url: selectedResult.url,
              voice_tag: null,
            },
            { onSuccess: () => speak("Bookmark added successfully") },
          );
        } else {
          speak("No page selected to bookmark");
        }
      } else if (
        command.includes("show bookmarks") ||
        command.includes("open bookmarks")
      ) {
        setCurrentView("bookmarks");
        speak("Opening bookmarks");
      } else if (
        command.includes("show history") ||
        command.includes("open history")
      ) {
        setCurrentView("history");
        speak("Opening history");
      } else if (command.includes("go home") || command.includes("home page")) {
        setCurrentView("home");
        speak("Going to home page");
      } else if (
        command.includes("settings") ||
        command.includes("preferences")
      ) {
        setCurrentView("settings");
        speak("Opening settings");
      } else if (
        command.includes("open result") &&
        searchResults?.results?.length > 0
      ) {
        const firstResult = searchResults.results[0];
        setSelectedResult(firstResult);
        speak(`Opening ${firstResult.title}`);
        window.open(firstResult.url, "_blank");
        addToHistory.mutate({
          title: firstResult.title,
          url: firstResult.url,
          search_query: searchQuery,
        });
      } else if (
        command.includes("read result") &&
        searchResults?.results?.length > 0
      ) {
        const firstResult = searchResults.results[0];
        speak(`${firstResult.title}. ${firstResult.snippet}`);
      } else if (
        command.includes("stop speaking") ||
        command.includes("stop reading")
      ) {
        stopSpeaking();
      } else if (
        command.includes("open") &&
        command.includes("link") &&
        searchResults?.results?.length > 0
      ) {
        const numberWords = {
          first: 1, second: 2, third: 3, fourth: 4, fifth: 5, "1st": 1, "2nd": 2, "3rd": 3, "4th": 4, "5th": 5,
        };
        let resultIndex = -1;
        for (const [word, index] of Object.entries(numberWords)) {
          if (command.includes(word)) {
            resultIndex = index - 1;
            break;
          }
        }
        if (resultIndex >= 0 && resultIndex < searchResults.results.length) {
          const result = searchResults.results[resultIndex];
          setSelectedResult(result);
          speak(`Opening ${result.title}`);
          window.open(result.url, "_blank");
          addToHistory.mutate({ title: result.title, url: result.url, search_query: searchQuery });
        } else {
            speak("Please specify which link to open, for example: open first link");
        }
      } else if (command.includes("scroll up")) {
        window.scrollBy({ top: -300, behavior: "smooth" });
        speak("Scrolling up");
      } else if (command.includes("scroll down")) {
        window.scrollBy({ top: 300, behavior: "smooth" });
        speak("Scrolling down");
      } else {
        setSearchQuery(command);
        performSearch(command);
        setCurrentView("search");
        speak(`Searching for ${command}`);
      }
    },
    [selectedResult, searchResults, searchQuery, performSearch, addBookmark, addToHistory, speak, stopSpeaking]
  );

  useEffect(() => {
    commandHandlerRef.current = processVoiceCommand;
  }, [processVoiceCommand]);
  
  if (userLoading) return <LoadingView />;
  if (!user) return <UnauthenticatedView />;

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView getCardStyles={getCardStyles} />;
      case "search":
        return (
          <SearchView
            searchQuery={searchQuery}
            searchResults={searchResults}
            searchLoading={searchLoading}
            getCardStyles={getCardStyles}
            getButtonStyles={getButtonStyles}
            preferences={preferences}
            onSelectResult={(result) => {
              setSelectedResult(result);
              speak(`Selected ${result.title}`);
            }}
            onOpenResult={(result) => {
              window.open(result.url, "_blank");
              addToHistory.mutate({ title: result.title, url: result.url, search_query: searchQuery });
            }}
            onBookmarkResult={(result) =>
              addBookmark.mutate({ title: result.title, url: result.url }, {
                  onSuccess: () => speak("Bookmark added successfully")
              })
            }
            onReadResult={(result) => speak(`${result.title}. ${result.snippet}`)}
          />
        );
      case "bookmarks":
        return (
          <BookmarksView
            bookmarksData={bookmarksData}
            getCardStyles={getCardStyles}
            getButtonStyles={getButtonStyles}
            preferences={preferences}
            onOpenBookmark={(bookmark) => {
              window.open(bookmark.url, "_blank");
              addToHistory.mutate({ title: bookmark.title, url: bookmark.url });
            }}
          />
        );
      case "history":
        return <HistoryView historyData={historyData} getCardStyles={getCardStyles} preferences={preferences} />;
      case "settings":
        return (
          <SettingsView
            preferences={preferences}
            onUpdatePreferences={(newPrefs) => updatePreferences.mutate(newPrefs, {
                onSuccess: () => speak("Preferences updated")
            })}
            getCardStyles={getCardStyles}
            getButtonStyles={getButtonStyles}
          />
        );
      default:
        return <HomeView getCardStyles={getCardStyles} />;
    }
  };

  return (
    <div className={getContainerStyles()}>
      <div className="container mx-auto px-4 py-8">
        <Header isListening={isListening} />
        <VoiceControls
          isVoiceEnabled={isVoiceEnabled}
          isListening={isListening}
          isSpeaking={isSpeaking}
          onToggleVoice={() => setIsVoiceEnabled((v) => !v)}
          onStopSpeaking={stopSpeaking}
          getButtonStyles={getButtonStyles}
        />
        <StatusDisplay
          isListening={isListening}
          isSpeaking={isSpeaking}
          transcript={transcript}
          getCardStyles={getCardStyles}
        />
        <Navigation
          currentView={currentView}
          onNavigate={setCurrentView}
          getButtonStyles={getButtonStyles}
          speak={speak}
        />
        <main className="max-w-4xl mx-auto">{renderView()}</main>
      </div>
    </div>
  );
}

export default MainComponent;
