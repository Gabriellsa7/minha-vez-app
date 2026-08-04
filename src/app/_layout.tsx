import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "../config/axios";
import { queryClient } from "../lib/react-query";
import { NotificationService } from "../services/notifications/notification.service";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    if (Constants.appOwnership !== "expo") {
      NotificationService.registerForPushNotifications();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
