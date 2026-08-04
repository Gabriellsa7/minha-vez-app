import { httpClient } from "@/src/services/api";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { AppState, Platform } from "react-native";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: string;
}

export class NotificationService {
  static async registerForPushNotifications() {
    if (!Device.isDevice) {
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    if (!token) {
      return null;
    }

    await httpClient.post("/notifications/register-token", {
      token,
      platform: Platform.OS,
    });

    return token;
  }

  static async listNotifications() {
    const response = await httpClient.get<NotificationItem[]>("/notifications");
    return response.data;
  }

  static async listUnreadNotifications() {
    const response = await httpClient.get<NotificationItem[]>(
      "/notifications/unread",
    );
    return response.data;
  }

  static async markAsRead(id: string) {
    const response = await httpClient.patch(`/notifications/${id}/read`);
    return response.data;
  }

  static async markAllAsRead() {
    const response = await httpClient.patch("/notifications/read-all");
    return response.data;
  }

  static async syncPendingNotifications() {
    const response = await httpClient.get<NotificationItem[]>("/notifications");
    return response.data;
  }

  static listenForAppStateChanges(callback: () => void) {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        callback();
      }
    });

    return () => subscription.remove();
  }

  static connectToNotificationsSocket(callback: (payload: unknown) => void) {
    const socket = new WebSocket(
      process.env.EXPO_PUBLIC_WS_URL || "ws://localhost:3002",
    );

    socket.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data);
        callback(payload);
      } catch {
        // ignore invalid payloads
      }
    });

    socket.addEventListener("close", () => {
      setTimeout(() => {
        this.connectToNotificationsSocket(callback);
      }, 1000);
    });

    return socket;
  }
}
