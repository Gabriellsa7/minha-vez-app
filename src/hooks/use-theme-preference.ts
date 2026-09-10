import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";

import {
  ThemePreference,
  getThemePreference,
  setThemePreference,
} from "@/src/services/theme/theme-preference.storage";

export function useThemePreference() {
  const { setColorScheme } = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("auto");

  useEffect(() => {
    getThemePreference().then((stored) => {
      setPreference(stored);
      setColorScheme(stored === "auto" ? "system" : stored);
    });
  }, [setColorScheme]);

  const selectPreference = (next: ThemePreference) => {
    setPreference(next);
    setColorScheme(next === "auto" ? "system" : next);
    void setThemePreference(next);
  };

  return { preference, selectPreference };
}
