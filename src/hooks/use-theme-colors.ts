import { useColorScheme } from "nativewind";

import { DarkColors, LightColors } from "@/src/constants/theme";

// Usa o useColorScheme do NativeWind (não o do react-native) para que as cores
// inline (`style`/`color`) e as classes `dark:` do NativeWind leiam do mesmo
// observable e mudem no mesmo frame — evita flicker ao trocar o tema do SO.
export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? DarkColors : LightColors;
}
