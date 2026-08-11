import { useCallback, useEffect, useState } from "react";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
} from "../services/search/recent-searches.storage";

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    void getRecentSearches().then(setRecentSearches);
  }, []);

  const addSearch = useCallback(async (term: string) => {
    const updated = await addRecentSearch(term);
    setRecentSearches(updated);
  }, []);

  const removeSearch = useCallback(async (term: string) => {
    const updated = await removeRecentSearch(term);
    setRecentSearches(updated);
  }, []);

  const clearSearches = useCallback(async () => {
    await clearRecentSearches();
    setRecentSearches([]);
  }, []);

  return { recentSearches, addSearch, removeSearch, clearSearches };
}
