import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useApi(user) {
  const queryClient = useQueryClient();

  // Fetch user preferences
  const { data: preferencesData } = useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const response = await fetch("/api/preferences");
      if (!response.ok) throw new Error("Failed to fetch preferences");
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch bookmarks
  const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const response = await fetch("/api/bookmarks");
      if (!response.ok) throw new Error("Failed to fetch bookmarks");
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch history
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const response = await fetch("/api/history");
      if (!response.ok) throw new Error("Failed to fetch history");
      return response.json();
    },
    enabled: !!user,
  });

  // Add to history mutation
  const addToHistory = useMutation({
    mutationFn: async (historyEntry) => {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(historyEntry),
      });
      if (!response.ok) throw new Error("Failed to add to history");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  // Perform search mutation
  const {
    data: searchResults,
    isPending: searchLoading,
    mutate: performSearch,
  } = useMutation({
    mutationFn: async (query) => {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
      );
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    onSuccess: (data, query) => {
      if (data.results?.length > 0) {
        addToHistory.mutate({
          title: `Search: ${query}`,
          url: `search:${query}`,
          search_query: query,
        });
      }
    },
  });

  // Add bookmark mutation
  const addBookmark = useMutation({
    mutationFn: async (bookmark) => {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookmark),
      });
      if (!response.ok) throw new Error("Failed to add bookmark");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  // Update preferences mutation
  const updatePreferences = useMutation({
    mutationFn: async (newPrefs) => {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrefs),
      });
      if (!response.ok) throw new Error("Failed to update preferences");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["preferences"], data);
    },
  });

  return {
    preferencesData,
    bookmarksData,
    bookmarksLoading,
    historyData,
    historyLoading,
    searchResults,
    searchLoading,
    performSearch,
    addBookmark,
    addToHistory,
    updatePreferences,
  };
}
