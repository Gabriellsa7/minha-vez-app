import { Stack, router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { AppState, Linking } from "react-native";
import Toast from "react-native-toast-message";
import "../config/axios";
import { NotificationPermissionModal } from "../components/notifications/notification-permission-modal";
import { queryClient } from "../lib/react-query";
import { NotificationService } from "../services/notifications/notification.service";
import { notificationQueryKeys } from "../hooks/use-notifications";
import { GET_QUEUE_ITEMS_KEY } from "../api/get-queue-item-by-patient-id";
import { GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY } from "../api/get-queues-with-details-by-patient-id";
import { GET_APPOINTMENTS_BY_PATIENT_ID_KEY } from "../api/get-appointment-by-patient-id";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function navigateToNotification(data?: Record<string, unknown> | null) {
  const notificationId = data?.notificationId;
  if (typeof notificationId === "string" && notificationId.length > 0) {
    router.push({ pathname: "/notifications/[id]", params: { id: notificationId } });
  }
}

export default function RootLayout() {
  const [permissionModal, setPermissionModal] = useState({
    visible: false,
    canAskAgain: true,
  });

  useEffect(() => {
    const evaluateNotificationPermission = async () => {
      if (!Device.isDevice) return;
      const { status, canAskAgain } = await Notifications.getPermissionsAsync();
      if (status === "granted") {
        void NotificationService.registerForPushNotifications();
        return;
      }
      setPermissionModal({ visible: true, canAskAgain });
    };

    if (Constants.appOwnership === "expo") {
      console.warn("[push] remote push is unavailable in Expo Go; use the development build");
    } else {
      void evaluateNotificationPermission();
    }

    const invalidateNotifications = () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    };

    const unsubscribeAppState = NotificationService.listenForAppStateChanges(
      invalidateNotifications,
    );

    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state !== "active" || Constants.appOwnership === "expo") return;
      void evaluateNotificationPermission();
    });

    const tokenRotationUnsubscribe = NotificationService.registerTokenRotationListener();

    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("[push] received", {
          appState: "foreground",
          payload: notification.request.content.data,
          title: notification.request.content.title,
          body: notification.request.content.body,
        });
        invalidateNotifications();
      },
    );
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const payload = response.notification.request.content.data as
          | Record<string, unknown>
          | undefined;
        console.log("[push] user clicked notification", {
          actionIdentifier: response.actionIdentifier,
          payload,
        });
        navigateToNotification(payload);
      });
    const droppedSubscription = Notifications.addNotificationsDroppedListener(() => {
      console.warn("[push] notifications dropped by the OS/provider");
    });
    const unsubscribeSocket = NotificationService.subscribeToSocket((payload) => {
      console.log("[realtime] invalidating queue and notification cache", {
        payload,
      });
      invalidateNotifications();
      void queryClient.invalidateQueries({ queryKey: [GET_QUEUE_ITEMS_KEY] });
      void queryClient.invalidateQueries({
        queryKey: [GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY],
      });
      // A patient being called/finished/marked absent changes their
      // appointment's status too (e.g. to COMPLETED once attended), and the
      // home screen decides whether to keep showing the queue card based on
      // that appointment, not just the queue/queue-item data.
      void queryClient.invalidateQueries({
        queryKey: [GET_APPOINTMENTS_BY_PATIENT_ID_KEY],
      });
    });
    const stopSocket = NotificationService.startNotificationsSocket();

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) {
      const payload = lastResponse.notification.request.content.data as
        | Record<string, unknown>
        | undefined;
      console.log("[push] app opened from notification", { payload });
      navigateToNotification(payload);
    }

    return () => {
      unsubscribeAppState();
      appStateSubscription.remove();
      tokenRotationUnsubscribe();
      receivedSubscription.remove();
      responseSubscription.remove();
      droppedSubscription.remove();
      unsubscribeSocket();
      stopSocket();
    };
  }, []);

  const handleAllowNotifications = () => {
    setPermissionModal((prev) => ({ ...prev, visible: false }));
    if (!permissionModal.canAskAgain) {
      void Linking.openSettings();
      return;
    }
    void NotificationService.registerForPushNotifications();
  };

  const handleDismissNotifications = () => {
    setPermissionModal((prev) => ({ ...prev, visible: false }));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="notifications/[id]" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <NotificationPermissionModal
          visible={permissionModal.visible}
          canAskAgain={permissionModal.canAskAgain}
          onAllow={handleAllowNotifications}
          onDismiss={handleDismissNotifications}
        />
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
