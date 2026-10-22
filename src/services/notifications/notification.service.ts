import { refreshAccessToken } from "@/src/services/auth/auth.session";
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

// Sent by the backend when the access token used in the handshake expires.
const TOKEN_EXPIRED_CLOSE_CODE = 4401;

export class NotificationService {
  private static socket: WebSocket | null = null;
  private static reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private static shouldReconnect = false;
  private static subscribers = new Set<SocketSubscriber>();
  private static isFetchingPushToken = false;
  private static lastRegisteredToken: string | null = null;

  static async registerForPushNotifications() {
    if (this.isFetchingPushToken) return null;
    this.isFetchingPushToken = true;
    try {
      return await this.fetchAndRegisterPushToken();
    } finally {
      this.isFetchingPushToken = false;
    }
  }

  private static async fetchAndRegisterPushToken() {
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
      // Only remember the token once the backend has it: a token fetched before
      // login must still be sent after the user signs in.
      if (
        token !== this.lastRegisteredToken &&
        (await this.registerTokenWithBackend(token))
      ) {
        this.lastRegisteredToken = token;
      }
      return token;
    } catch (error) {
      console.error("[push] registration failed", { error });
      return null;
    }
  }

  static async registerTokenWithBackend(token: string): Promise<boolean> {
    const authToken = await getToken();
    if (!authToken) {
      console.log(
        "[push] token registration deferred: user not authenticated yet",
      );
      return false;
    }
    try {
      await httpClient.post("/notifications/register-token", {
        token,
        platform: Platform.OS,
      });
      console.log("[push] Expo token registered in backend", { token });
      return true;
    } catch (error) {
      console.error("[push] token registration failed", { error });
      return false;
    }
  }

  static registerTokenRotationListener() {
    const subscription = Notifications.addPushTokenListener(() => {
      console.log("[push] native device token rotated, refreshing Expo token");
      void this.registerForPushNotifications();
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
    void this.connect();
    return () => this.stopNotificationsSocket();
  }

  static stopNotificationsSocket() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.socket?.close();
    this.socket = null;
  }

  private static isConnecting = false;

  private static async connect() {
    if (!this.shouldReconnect || this.socket || this.isConnecting) return;
    const url = process.env.EXPO_PUBLIC_WS_URL;
    if (!url) {
      console.error("[socket] missing EXPO_PUBLIC_WS_URL");
      return;
    }

    this.isConnecting = true;
    let token: string | null;
    try {
      token = await getToken();
    } finally {
      this.isConnecting = false;
    }
    if (!token) {
      console.warn("[socket] skipped: no access token");
      return;
    }
    // The socket may have been stopped or opened while the token was being read.
    if (!this.shouldReconnect || this.socket) return;

    console.log("[socket] connecting", { url });
    const separator = url.includes("?") ? "&" : "?";
    const socket = new WebSocket(
      `${url}${separator}token=${encodeURIComponent(token)}`,
    );
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

      if (event.code === TOKEN_EXPIRED_CLOSE_CODE) {
        void refreshAccessToken().then((accessToken) => {
          if (!accessToken) {
            console.warn("[socket] session expired, not reconnecting");
            return;
          }
          void this.connect();
        });
        return;
      }

      this.reconnectTimer = setTimeout(() => {
        void this.connect();
      }, 1000);
    });
  }
}
