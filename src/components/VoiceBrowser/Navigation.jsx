import { Home, Search, Bookmark, History, Settings } from "lucide-react";

const navItems = [
  { key: "home", label: "Home", icon: Home },
  { key: "search", label: "Search", icon: Search },
  { key: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { key: "history", label: "History", icon: History },
  { key: "settings", label: "Settings", icon: Settings },
];

export function Navigation({ currentView, onNavigate, getButtonStyles, speak }) {
  return (
    <nav className="flex justify-center space-x-2 mb-8 flex-wrap">
      {navItems.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => {
            onNavigate(key);
            speak(`Opening ${label}`);
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentView === key ? getButtonStyles("primary") : getButtonStyles("secondary")
          }`}
          aria-label={`Go to ${label}`}
        >
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
