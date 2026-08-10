import {
  useMarkNotificationAsRead,
  useNotification,
} from "@/src/hooks/use-notifications";
import { formatDateTime } from "@/src/utils/format-date-time";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, BellRing, CheckCircle2, Circle } from "lucide-react-native";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const notificationTypeLabel = (type: string) =>
  type
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const relatedInformation = (data?: Record<string, unknown>) => {
  if (!data) return [];

  const labels: Record<string, string> = {
    appointmentDateTime: "Data da consulta",
    scheduledAt: "Agendada para",
    queuePosition: "Posição na fila",
    position: "Posição na fila",
  };

  return Object.entries(data)
    .filter(([key, value]) => labels[key] && typeof value !== "object")
    .map(([key, value]) => ({
      label: labels[key],
      value:
        key === "appointmentDateTime" || key === "scheduledAt"
          ? formatDateTime(String(value))
          : String(value),
    }));
};

export default function NotificationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: notification, isLoading, isError, refetch } = useNotification(id);
  const markAsRead = useMarkNotificationAsRead();

  useEffect(() => {
    if (notification && !notification.read) {
      markAsRead.mutate(notification._id);
    }
  }, [markAsRead, notification]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center gap-3 bg-bgPrimary">
        <ActivityIndicator size="large" color="#008096" />
        <Text className="text-textFifth">Carregando notificação...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !notification) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-bgPrimary px-6">
        <BellRing size={30} color="#006673" />
        <Text className="text-center text-textFifth">
          Não foi possível carregar esta notificação.
        </Text>
        <Pressable onPress={() => refetch()} className="rounded-lg bg-bgSecondary px-4 py-3">
          <Text className="font-bold text-textPrimary">Tentar novamente</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const details = relatedInformation(notification.data);

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <View className="flex-row items-center gap-4 bg-bgThird p-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
          onPress={() => router.back()}
        >
          <ArrowLeft size={26} color="#006673" />
        </Pressable>
        <Text className="text-lg font-bold text-textSecondary">Notificação</Text>
      </View>

      <View className="gap-6 p-5">
        <View className="rounded-2xl bg-bgThird p-5">
          <Text className="text-xl font-bold text-textBlack">{notification.title}</Text>
          <Text className="mt-4 text-base leading-6 text-textFifth">
            {notification.message}
          </Text>
        </View>

        <View className="gap-4 rounded-2xl bg-bgThird p-5">
          <View>
            <Text className="text-sm text-textFourth">Tipo</Text>
            <Text className="mt-1 font-semibold text-textBlack">
              {notificationTypeLabel(notification.type)}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-textFourth">Recebida em</Text>
            <Text className="mt-1 font-semibold text-textBlack">
              {formatDateTime(notification.createdAt)}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {notification.read ? (
              <CheckCircle2 size={18} color="#006673" />
            ) : (
              <Circle size={18} color="#006673" />
            )}
            <Text className="font-semibold text-textBlack">
              {notification.read ? "Lida" : "Não lida"}
            </Text>
          </View>
          {details.map((detail) => (
            <View key={detail.label}>
              <Text className="text-sm text-textFourth">{detail.label}</Text>
              <Text className="mt-1 font-semibold text-textBlack">{detail.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
