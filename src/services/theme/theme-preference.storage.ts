import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemePreference = "auto" | "light" | "dark";

const THEME_PREFERENCE_KEY = "themePreference";

export const getThemePreference = async (): Promise<ThemePreference> => {
  const raw = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
  return raw === "light" || raw === "dark" ? raw : "auto";
};

export const setThemePreference = async (
  preference: ThemePreference,
): Promise<void> => {
  await AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference);
};
