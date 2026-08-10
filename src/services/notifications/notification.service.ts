import { getToken } from "@/src/services/auth/auth.storage";
import { httpClient } from "@/src/services/api";
import Constants from "expo-constants";
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

type SocketSubscriber = (payload: Record<string, unknown>) => void;

export class NotificationService {
  private static socket: WebSocket | null = null;
  private static reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private static shouldReconnect = false;
  private static subscribers = new Set<SocketSubscriber>();

  static async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.warn("[push] registration skipped: physical device required");
      return null;
    }

    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("queue-updates", {
          name: "Atualizações da fila",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          sound: "default",
        });
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      console.log("[push] permission status", { existingStatus, finalStatus });
      if (finalStatus !== "granted") return null;

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
      if (!projectId) throw new Error("EAS projectId is not configured");

      const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;
      console.log("[push] Expo token obtained", { token, projectId });
      await this.registerTokenWithBackend(token);
      return token;
    } catch (error) {
      console.error("[push] registration failed", { error });
      return null;
    }
  }

  static async registerTokenWithBackend(token: string) {
    const authToken = await getToken();
    if (!authToken) {
      console.log(
        "[push] token registration deferred: user not authenticated yet",
      );
      return;
    }
    try {
      await httpClient.post("/notifications/register-token", {
        token,
        platform: Platform.OS,
      });
      console.log("[push] Expo token registered in backend", { token });
    } catch (error) {
      console.error("[push] token registration failed", { error });
    }
  }

  static registerTokenRotationListener() {
    const subscription = Notifications.addPushTokenListener((event) => {
      console.log("[push] token rotated", { token: event.data });
      void this.registerTokenWithBackend(event.data);
    });
    return () => subscription.remove();
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

  static async clearNotifications() {
    const response = await httpClient.delete("/notifications");
    return response.data;
  }

  static async syncPendingNotifications() {
    return this.listNotifications();
  }

  static listenForAppStateChanges(callback: () => void) {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") callback();
    });
    return () => subscription.remove();
  }

  static subscribeToSocket(callback: SocketSubscriber) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  static startNotificationsSocket() {
    this.shouldReconnect = true;
    this.connect();
    return () => this.stopNotificationsSocket();
  }

  static stopNotificationsSocket() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.socket?.close();
    this.socket = null;
  }

  private static connect() {
    if (!this.shouldReconnect || this.socket) return;
    const url = process.env.EXPO_PUBLIC_WS_URL;
    if (!url) {
      console.error("[socket] missing EXPO_PUBLIC_WS_URL");
      return;
    }
    console.log("[socket] connecting", { url });
    const socket = new WebSocket(url);
    this.socket = socket;

    socket.addEventListener("open", () =>
      console.log("[socket] connected", { url }),
    );
    socket.addEventListener("error", (error) =>
      console.error("[socket] error", { error, url }),
    );
    socket.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data) as Record<string, unknown>;
        console.log("[socket] message received", { payload });
        this.subscribers.forEach((subscriber) => subscriber(payload));
      } catch (error) {
        console.error("[socket] invalid message", { error, raw: event.data });
      }
    });
    socket.addEventListener("close", (event) => {
      console.warn("[socket] closed", {
        code: event.code,
        reason: event.reason,
        reconnect: this.shouldReconnect,
      });

      if (this.socket === socket) {
        this.socket = null;
      }

      if (!this.shouldReconnect) {
        return;
      }

      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, 1000);
    });
  }
}
