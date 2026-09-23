import { StatusScreen } from "@/src/components/status-screen/status-screen";
import { Stack } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import "../../global.css";

import { QueryClientProvider, focusManager } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState } from "react-native";
import Toast from "react-native-toast-message";
import { NotificationPermissionModal } from "../components/notifications/notification-permission-modal";
import { NotificationAlertGate } from "../components/queue-closed/notification-alert-gate";
import { useToastConfig } from "../components/toast/toast-config";
import "../config/axios";
import { usePushNotifications } from "../hooks/use-push-notifications";
import { useThemeColors } from "../hooks/use-theme-colors";
import { useThemePreference } from "../hooks/use-theme-preference";
import { queryClient } from "../lib/react-query";

const QUEUE_CLOSED_NOTIFICATION_TYPE = "QUEUE_CLOSED";
const CHECK_IN_MISSED_NOTIFICATION_TYPE = "APPOINTMENT_AUTO_CANCELED";

export function ErrorBoundary({ retry }: { retry: () => void }) {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusScreen
        title="Algo não saiu como esperado"
        message="Já estamos de olho nisso. Tente novamente em instantes."
        actionLabel="Tentar novamente"
        onAction={retry}
      />
    </SafeAreaProvider>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function AppToast() {
  const insets = useSafeAreaInsets();
  const toastConfig = useToastConfig();

  return <Toast config={toastConfig} topOffset={insets.top + 12} />;
}

export default function RootLayout() {
  const colors = useThemeColors();
  useThemePreference();
  const { permissionModal, allowNotifications, dismissPermissionModal } =
    usePushNotifications();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      focusManager.setFocused(status === "active");
    });

    return () => subscription.remove();
  }, []);

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
          <Stack.Screen name="notifications-details/[id]" />
          <Stack.Screen name="queue-info/[id]" />
          <Stack.Screen name="search" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="appointment-confirmation/[id]"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="auto" />
        <NotificationPermissionModal
          visible={permissionModal.visible}
          canAskAgain={permissionModal.canAskAgain}
          onAllow={allowNotifications}
          onDismiss={dismissPermissionModal}
        />
        <NotificationAlertGate
          notificationType={QUEUE_CLOSED_NOTIFICATION_TYPE}
        />
        <NotificationAlertGate
          notificationType={CHECK_IN_MISSED_NOTIFICATION_TYPE}
          title="Check-in não identificado"
        />
        <AppToast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
