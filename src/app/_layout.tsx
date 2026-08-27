import { Stack, router, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";

import { QueryClientProvider, focusManager } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { AppState, Linking } from "react-native";
import Toast from "react-native-toast-message";
import {
  GET_APPOINTMENTS_BY_PATIENT_ID_INFINITE_KEY,
  GET_APPOINTMENTS_BY_PATIENT_ID_KEY,
} from "../api/get-appointment-by-patient-id";
import {
  GET_EXAM_BOOKINGS_BY_PATIENT_ID_INFINITE_KEY,
  GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY,
} from "../api/get-exam-bookings-by-patient-id";
import {
  GET_EXAMS_BY_PATIENT_ID_INFINITE_KEY,
  GET_EXAMS_BY_PATIENT_ID_KEY,
} from "../api/get-exams-by-patient-id";
import { GET_QUEUE_ITEMS_KEY } from "../api/get-queue-item-by-patient-id";
import { GET_QUEUE_ITEMS_BY_QUEUE_ID_KEY } from "../api/get-queue-item-by-queue-id";
import { GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY } from "../api/get-queues-with-details-by-patient-id";
import { NotificationPermissionModal } from "../components/notifications/notification-permission-modal";
import { QueueClosedModal } from "../components/queue-closed/queue-closed-modal";
import "../config/axios";
import {
  notificationQueryKeys,
  useMarkNotificationAsRead,
  useUnreadNotifications,
} from "../hooks/use-notifications";
import { useThemeColors } from "../hooks/use-theme-colors";
import { useThemePreference } from "../hooks/use-theme-preference";
import { queryClient } from "../lib/react-query";
import {
  NotificationItem,
  NotificationService,
} from "../services/notifications/notification.service";

const QUEUE_CLOSED_NOTIFICATION_TYPE = "QUEUE_CLOSED";

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
    router.push({
      pathname: "/notifications-details/[id]",
      params: { id: notificationId },
    });
  }
}

// Reads notification state via react-query hooks, so it must be rendered as
// a descendant of <QueryClientProvider> — not inline in RootLayout's body,
// which runs before that provider exists.
function QueueClosedNotificationGate() {
  const [queueClosedNotification, setQueueClosedNotification] =
    useState<NotificationItem | null>(null);
  // markAsRead is async: the "unread" list can still contain the
  // just-dismissed notification for a moment after closing (the mutation's
  // invalidation hasn't finished refetching yet), which would otherwise
  // reopen the same modal right after it's closed. Tracking dismissed ids
  // locally makes the close instant and final regardless of that race.
  const dismissedNotificationIdsRef = useRef<Set<string>>(new Set());

  // A previous session's token can still be valid in secure storage while
  // the login screen is showing (index.tsx always renders /login first,
  // regardless of a stored session) — without this guard the modal could
  // pop up before the user actually logs in on this app run.
  const pathname = usePathname();
  const isPastLoginScreen = pathname !== "/" && pathname !== "/login";

  const { data: unreadNotifications } = useUnreadNotifications({
    enabled: isPastLoginScreen,
  });
  const markNotificationAsRead = useMarkNotificationAsRead();

  useEffect(() => {
    if (queueClosedNotification) return;

    const pendingQueueClosedNotification = unreadNotifications?.find(
      (notification) =>
        notification.type === QUEUE_CLOSED_NOTIFICATION_TYPE &&
        !dismissedNotificationIdsRef.current.has(notification._id),
    );

    if (pendingQueueClosedNotification) {
      setQueueClosedNotification(pendingQueueClosedNotification);
    }
  }, [queueClosedNotification, unreadNotifications]);

  const handleCloseQueueClosedModal = () => {
    if (!queueClosedNotification) return;
    const notificationId = queueClosedNotification._id;
    dismissedNotificationIdsRef.current.add(notificationId);
    setQueueClosedNotification(null);
    void markNotificationAsRead.mutateAsync(notificationId);
  };

  const closedQueueHealthUnitId =
    typeof queueClosedNotification?.data?.healthUnitId === "string"
      ? queueClosedNotification.data.healthUnitId
      : undefined;

  const handleFindAnotherDoctor = () => {
    if (!closedQueueHealthUnitId) return;
    handleCloseQueueClosedModal();
    router.push({
      pathname: "/agenda",
      params: { unitId: closedQueueHealthUnitId },
    });
  };

  return (
    <QueueClosedModal
      visible={Boolean(queueClosedNotification)}
      message={queueClosedNotification?.message ?? ""}
      onClose={handleCloseQueueClosedModal}
      onFindAnotherDoctor={
        closedQueueHealthUnitId ? handleFindAnotherDoctor : undefined
      }
    />
  );
}

export default function RootLayout() {
  const colors = useThemeColors();
  useThemePreference();
  const [permissionModal, setPermissionModal] = useState({
    visible: false,
    canAskAgain: true,
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      focusManager.setFocused(status === "active");
    });

    return () => subscription.remove();
  }, []);

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
      console.warn(
        "[push] remote push is unavailable in Expo Go; use the development build",
      );
    } else {
      void evaluateNotificationPermission();
    }

    const invalidateNotifications = () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    };

    const unsubscribeAppState = NotificationService.listenForAppStateChanges(
      invalidateNotifications,
    );

    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state !== "active" || Constants.appOwnership === "expo") return;
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
        invalidateNotifications();
        void queryClient.invalidateQueries({ queryKey: [GET_QUEUE_ITEMS_KEY] });
        void queryClient.invalidateQueries({
          queryKey: [GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY],
        });
        void queryClient.invalidateQueries({
          queryKey: [GET_QUEUE_ITEMS_BY_QUEUE_ID_KEY],
        });
        void queryClient.invalidateQueries({
          queryKey: [GET_APPOINTMENTS_BY_PATIENT_ID_KEY],
        });
        void queryClient.invalidateQueries({
          queryKey: [GET_APPOINTMENTS_BY_PATIENT_ID_INFINITE_KEY],
        });
        void queryClient.invalidateQueries({
          queryKey: [GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY],
        });
        void queryClient.invalidateQueries({
          queryKey: [GET_EXAM_BOOKINGS_BY_PATIENT_ID_INFINITE_KEY],
        });
        void queryClient.invalidateQueries({
          queryKey: [GET_EXAMS_BY_PATIENT_ID_KEY],
        });
        void queryClient.invalidateQueries({
          queryKey: [GET_EXAMS_BY_PATIENT_ID_INFINITE_KEY],
        });
      },
    );

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
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bgPrimary },
          }}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="notifications/[id]" />
          <Stack.Screen name="queue-info/[id]" />
          <Stack.Screen name="search" options={{ presentation: "modal" }} />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="auto" />
        <NotificationPermissionModal
          visible={permissionModal.visible}
          canAskAgain={permissionModal.canAskAgain}
          onAllow={handleAllowNotifications}
          onDismiss={handleDismissNotifications}
        />
        <QueueClosedNotificationGate />
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
