import { useBottomTabBarHeight } from "expo-router/build/react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// The floating tab bar sits above the Android navigation bar, so the space it takes
// at the bottom of the screen includes the bottom safe-area inset.
export const useTabBarHeight = () =>
  useBottomTabBarHeight() + useSafeAreaInsets().bottom;
