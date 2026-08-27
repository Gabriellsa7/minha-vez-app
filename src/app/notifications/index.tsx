import {
  useClearNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotifications,
} from "@/src/hooks/use-notifications";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { router } from "expo-router";
import {
  ArrowLeft,
  BellRing,
  CheckCheck,
  RefreshCw,
  Trash2,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const colors = useThemeColors();
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useNotifications();
  const { data: unreadNotifications } = useUnreadNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const clearNotifications = useClearNotifications();
  const unreadCount = unreadNotifications?.length ?? 0;

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleClearNotifications = () => {
    Alert.alert(
      "Limpar notificações",
      "Tem certeza que deseja apagar todas as suas notificações? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => clearNotifications.mutate(),
        },
      ],
    );
  };

  const openNotification = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id);
    } finally {
      router.push({ pathname: "/notifications/[id]", params: { id } });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary px-4 pt-4">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.textSecondary} />
          </Pressable>
          <Text className="text-xl font-semibold text-textBlack">
            Notificações
          </Text>
        </View>
        <Text className="text-sm text-textFifth">{unreadCount} não lidas</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color={colors.textSecondary} />
          <Text className="text-textFifth">Carregando notificações...</Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-center text-textFifth">
            Não foi possível carregar suas notificações.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => refetch()}
            className="flex-row items-center gap-2 rounded-lg bg-bgSecondary px-4 py-3"
          >
            <RefreshCw size={16} color={colors.textPrimary} />
            <Text className="font-bold text-textPrimary">Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          {notifications?.length === 0 ? (
            <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
              <BellRing size={28} color={colors.tabActive} />
              <Text className="mt-3 text-center text-textFifth">
                Você não possui notificações.
              </Text>
            </View>
          ) : (
            notifications?.map((item) => (
              <Pressable
                key={item._id}
                accessibilityRole="button"
                accessibilityLabel={`${item.read ? "Lida" : "Não lida"}: ${item.title}`}
                onPress={() => void openNotification(item._id)}
                className={`mb-3 rounded-2xl border p-4 ${item.read ? "border-borderPrimary bg-bgThird" : "border-highlightBorder bg-highlightBg"}`}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between gap-2">
                      <Text className="flex-1 text-base font-semibold text-textBlack">
                        {item.title}
                      </Text>
                      <Text className="text-xs text-textFifth">
                        {item.read ? "Lida" : "Não lida"}
                      </Text>
                    </View>
                    <Text className="mt-1 text-sm text-textFifth">
                      {item.message}
                    </Text>
                  </View>
                  {!item.read && (
                    <CheckCheck size={18} color={colors.tabActive} />
                  )}
                </View>
                <Text className="mt-3 text-xs text-textFourth">
                  {formatDateTime(item.createdAt)}
                </Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}

      {!!notifications?.length && (
        <View className="mb-4 mt-3 flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Marcar todas as notificações como lidas"
            disabled={markAllAsRead.isPending || unreadCount === 0}
            onPress={handleMarkAllAsRead}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-borderPrimary py-3 disabled:opacity-50"
          >
            <CheckCheck size={16} color={colors.textSecondary} />
            <Text className="font-semibold text-textBlack">
              {markAllAsRead.isPending ? "Marcando..." : "Marcar como lidas"}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar todas as notificações"
            disabled={clearNotifications.isPending}
            onPress={handleClearNotifications}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-borderPrimary py-3"
          >
            <Trash2 size={16} color={colors.textDanger} />
            <Text className="font-semibold text-textDanger">
              {clearNotifications.isPending
                ? "Limpando..."
                : "Limpar notificações"}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
