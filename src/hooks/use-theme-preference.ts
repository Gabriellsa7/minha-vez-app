import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";

import {
  ThemePreference,
  getThemePreference,
  setThemePreference,
} from "@/src/services/theme/theme-preference.storage";

// Aplica a preferência salva ao observable de tema do NativeWind (que por sua
// vez usa `Appearance.setColorScheme` do RN, sobrescrevendo o tema do SO para
// o app inteiro). "auto" limpa a sobrescrita e volta a seguir o SO.
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
