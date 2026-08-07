import {
  NotificationItem,
  NotificationService,
} from "@/src/services/notifications/notification.service";
import { BellRing, CheckCheck } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await NotificationService.syncPendingNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const unsubscribe = NotificationService.listenForAppStateChanges(() => {
      loadNotifications();
    });

    const unsubscribeSocket = NotificationService.subscribeToSocket(() => {
      loadNotifications();
    });

    return () => {
      unsubscribe();
      unsubscribeSocket();
    };
  }, [loadNotifications]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <View className="flex-1 bg-slate-50 px-4 pt-12">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-slate-900">
          Notificações
        </Text>
        <Text className="text-sm text-slate-500">{unreadCount} não lidas</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadNotifications} />
        }
        className="flex-1"
      >
        {notifications.length === 0 ? (
          <View className="items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
            <BellRing size={28} color="#0F766E" />
            <Text className="mt-3 text-center text-slate-600">
              Você ainda não possui notificações.
            </Text>
          </View>
        ) : (
          notifications.map((item) => (
            <TouchableOpacity
              key={item._id}
              onPress={async () => {
                await NotificationService.markAsRead(item._id);
                await loadNotifications();
              }}
              className={`mb-3 rounded-2xl border p-4 ${item.read ? "border-slate-200 bg-white" : "border-teal-200 bg-teal-50"}`}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-slate-900">
                    {item.title}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-600">
                    {item.message}
                  </Text>
                </View>
                {!item.read && <CheckCheck size={18} color="#0F766E" />}
              </View>
              <Text className="mt-3 text-xs text-slate-400">
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
