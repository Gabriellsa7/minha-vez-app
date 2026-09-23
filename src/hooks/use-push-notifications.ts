import { REALTIME_QUERY_KEYS } from "@/src/api/query-groups";
import { invalidateQueryKeys } from "@/src/helpers/react-query";
import { notificationQueryKeys } from "@/src/hooks/use-notifications";
import { queryClient } from "@/src/lib/react-query";
import { NotificationService } from "@/src/services/notifications/notification.service";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

const isExpoGo = Constants.appOwnership === "expo";

function navigateToNotification(data?: Record<string, unknown> | null) {
  const notificationId = data?.notificationId;
  if (typeof notificationId === "string" && notificationId.length > 0) {
    router.push({
      pathname: "/notifications-details/[id]",
      params: { id: notificationId },
    });
  }
}

function getNotificationPayload(
  response: Notifications.NotificationResponse,
) {
  return response.notification.request.content.data as
    | Record<string, unknown>
    | undefined;
}

const invalidateNotifications = () =>
  queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });

export function usePushNotifications() {
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

    if (isExpoGo) {
      console.warn(
        "[push] remote push is unavailable in Expo Go; use the development build",
      );
    } else {
      void evaluateNotificationPermission();
    }

    const unsubscribeAppState = NotificationService.listenForAppStateChanges(
      invalidateNotifications,
    );

    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state !== "active" || isExpoGo) return;
        void evaluateNotificationPermission();
      },
    );

    const tokenRotationUnsubscribe =
      NotificationService.registerTokenRotationListener();

    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("[push] received", {
          appState: "foreground",
          payload: notification.request.content.data,
          title: notification.request.content.title,
          body: notification.request.content.body,
        });
        void invalidateNotifications();
      },
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const payload = getNotificationPayload(response);
        console.log("[push] user clicked notification", {
          actionIdentifier: response.actionIdentifier,
          payload,
        });
        navigateToNotification(payload);
      });

    const droppedSubscription = Notifications.addNotificationsDroppedListener(
      () => {
        console.warn("[push] notifications dropped by the OS/provider");
      },
    );

    const unsubscribeSocket = NotificationService.subscribeToSocket(
      (payload) => {
        console.log("[realtime] invalidating queue and notification cache", {
          payload,
        });
        void invalidateNotifications();
        void invalidateQueryKeys(queryClient, REALTIME_QUERY_KEYS);
      },
    );

    const stopSocket = NotificationService.startNotificationsSocket();

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) {
      const payload = getNotificationPayload(lastResponse);
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

  const allowNotifications = () => {
    setPermissionModal((prev) => ({ ...prev, visible: false }));
    if (!permissionModal.canAskAgain) {
      void Linking.openSettings();
      return;
    }
    void NotificationService.registerForPushNotifications();
  };

  const dismissPermissionModal = () => {
    setPermissionModal((prev) => ({ ...prev, visible: false }));
  };

  return { permissionModal, allowNotifications, dismissPermissionModal };
}
