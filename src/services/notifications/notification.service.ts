import { httpClient } from "@/src/services/api";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { AppState, Platform } from "react-native";

export interface NotificationItem {
  _id: string;
  patientId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: string;
  data?: Record<string, unknown>;
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

    console.log("Expo token:", token);

    if (!token) {
      return null;
    }

    await httpClient.post("/notifications/register-token", {
      token,
      platform: Platform.OS,
    });

    console.log("Token enviado para o backend");

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
    let socket: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let isStopped = false;

    const connect = () => {
      if (isStopped) return;

      socket = new WebSocket(
        process.env.EXPO_PUBLIC_WS_URL || "ws://localhost:3001",
      );

      socket.addEventListener("message", (event) => {
        try {
          callback(JSON.parse(event.data));
        } catch {
          // Ignore invalid socket payloads.
        }
      });

      socket.addEventListener("close", () => {
        if (!isStopped) {
          reconnectTimeout = setTimeout(connect, 1000);
        }
      });
    };

    connect();

    return () => {
      isStopped = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      socket?.close();
    };
  }
}
