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
import { GET_QUEUE_ITEMS_KEY } from "../api/get-queue-item-by-patient-id";
import { GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY } from "../api/get-queues-with-details-by-patient-id";

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
    if (Constants.appOwnership === "expo") {
      console.warn("[push] remote push is unavailable in Expo Go; use the development build");
    } else {
      void NotificationService.registerForPushNotifications();
    }

    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("[push] received", {
          appState: "foreground",
          payload: notification.request.content.data,
          title: notification.request.content.title,
          body: notification.request.content.body,
        });
      },
    );
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("[push] user clicked notification", {
          actionIdentifier: response.actionIdentifier,
          payload: response.notification.request.content.data,
        });
      });
    const droppedSubscription = Notifications.addNotificationsDroppedListener(() => {
      console.warn("[push] notifications dropped by the OS/provider");
    });
    const unsubscribeSocket = NotificationService.subscribeToSocket((payload) => {
      console.log("[realtime] invalidating queue cache", { payload });
      void queryClient.invalidateQueries({ queryKey: [GET_QUEUE_ITEMS_KEY] });
      void queryClient.invalidateQueries({
        queryKey: [GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY],
      });
    });
    const stopSocket = NotificationService.startNotificationsSocket();

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) {
      console.log("[push] app opened from notification", {
        payload: lastResponse.notification.request.content.data,
      });
    }

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
      droppedSubscription.remove();
      unsubscribeSocket();
      stopSocket();
    };
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
