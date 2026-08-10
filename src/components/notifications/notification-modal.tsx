import {
  useMarkNotificationAsRead,
  useNotifications,
} from "@/src/hooks/use-notifications";
import { formatDateTime } from "@/src/utils/format-date-time";
import { router } from "expo-router";
import { ArrowLeft, BellRing, Check, Circle, RefreshCw } from "lucide-react-native";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

const PREVIEW_LIMIT = 5;

export function NotificationModal({ visible, onClose }: NotificationModalProps) {
  const { data: notifications, isLoading, isError, refetch } = useNotifications({
    enabled: visible,
  });
  const markAsRead = useMarkNotificationAsRead();
  const recentNotifications = useMemo(
    () =>
      [...(notifications ?? [])]
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
        )
        .slice(0, PREVIEW_LIMIT),
    [notifications],
  );

  const openNotification = async (id: string) => {
    onClose();
    try {
      await markAsRead.mutateAsync(id);
    } finally {
      router.push({ pathname: "/notifications/[id]", params: { id } });
    }
  };

  const openAllNotifications = () => {
    onClose();
    router.push("/notifications");
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView className="flex-1 justify-center bg-black/50 px-4">
        <View className="max-h-[75%] rounded-2xl bg-bgThird">
          <View className="flex-row items-center justify-between border-b border-borderPrimary px-5 py-4">
            <Text className="text-lg font-bold text-textBlack">Notificações</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar e fechar notificações"
              hitSlop={8}
              onPress={onClose}
            >
              <ArrowLeft size={24} color="#006673" />
            </Pressable>
          </View>

          {isLoading ? (
            <View className="items-center gap-3 p-8">
              <ActivityIndicator color="#008096" />
              <Text className="text-textFifth">Carregando notificações...</Text>
            </View>
          ) : isError ? (
            <View className="items-center gap-3 p-8">
              <Text className="text-center text-textFifth">
                Não foi possível carregar suas notificações.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => refetch()}
                className="flex-row items-center gap-2 rounded-lg bg-bgSecondary px-4 py-2"
              >
                <RefreshCw size={16} color="#FFFFFF" />
                <Text className="font-bold text-textPrimary">Tentar novamente</Text>
              </Pressable>
            </View>
          ) : recentNotifications.length === 0 ? (
            <View className="items-center gap-3 p-8">
              <BellRing size={28} color="#006673" />
              <Text className="text-center text-textFifth">
                Você não possui notificações.
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {recentNotifications.map((notification) => (
                <Pressable
                  key={notification._id}
                  accessibilityRole="button"
                  accessibilityLabel={`${notification.read ? "Lida" : "Não lida"}: ${notification.title}`}
                  onPress={() => void openNotification(notification._id)}
                  className={`border-b border-borderPrimary px-5 py-4 ${notification.read ? "bg-bgThird" : "bg-[#E6F7F8]"}`}
                >
                  <View className="flex-row items-start gap-2">
                    {notification.read ? (
                      <Check size={18} color="#006673" />
                    ) : (
                      <Circle fill="#008096" size={14} color="#008096" />
                    )}
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between gap-2">
                        <Text className="flex-1 font-bold text-textBlack" numberOfLines={1}>
                          {notification.title}
                        </Text>
                        <Text className="text-xs text-textFifth">
                          {notification.read ? "Lida" : "Não lida"}
                        </Text>
                      </View>
                      <Text className="mt-1 text-sm text-textFifth" numberOfLines={2}>
                        {notification.message}
                      </Text>
                      <Text className="mt-2 text-xs text-textFourth">
                        {formatDateTime(notification.createdAt)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {!!notifications && notifications.length > PREVIEW_LIMIT && (
            <Pressable
              accessibilityRole="button"
              onPress={openAllNotifications}
              className="items-center px-5 py-4"
            >
              <Text className="font-bold text-textSecondary">Ver todas</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
