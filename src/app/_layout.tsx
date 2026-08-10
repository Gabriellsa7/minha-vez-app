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
import { notificationQueryKeys } from "../hooks/use-notifications";

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

    const invalidateNotifications = () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    };

    const unsubscribeAppState = NotificationService.listenForAppStateChanges(
      invalidateNotifications,
    );
    const disconnectSocket = NotificationService.connectToNotificationsSocket(
      invalidateNotifications,
    );
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      invalidateNotifications,
    );

    return () => {
      unsubscribeAppState();
      disconnectSocket();
      receivedSubscription.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="notifications/[id]" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
