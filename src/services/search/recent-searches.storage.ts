import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENT_SEARCHES_KEY = "recentSearches";
const MAX_RECENT_SEARCHES = 10;

export const getRecentSearches = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = async (term: string): Promise<string[]> => {
  const trimmed = term.trim();
  if (!trimmed) return getRecentSearches();

  const current = await getRecentSearches();
  const deduped = current.filter(
    (item) => item.toLowerCase() !== trimmed.toLowerCase(),
  );
  const updated = [trimmed, ...deduped].slice(0, MAX_RECENT_SEARCHES);

  await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  return updated;
};

export const removeRecentSearch = async (term: string): Promise<string[]> => {
  const current = await getRecentSearches();
  const updated = current.filter((item) => item !== term);

  await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  return updated;
};

export const clearRecentSearches = async (): Promise<void> => {
  await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
};
