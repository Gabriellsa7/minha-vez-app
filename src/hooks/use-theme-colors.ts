import { useColorScheme } from "nativewind";

import { DarkColors, LightColors } from "@/src/constants/theme";

export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? DarkColors : LightColors;
}
