import { useUnreadNotifications } from "@/src/hooks/use-notifications";
import { Bell } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface NotificationBellProps {
  onPress: () => void;
}

export function NotificationBell({ onPress }: NotificationBellProps) {
  const { data: unreadNotifications } = useUnreadNotifications();
  const unreadCount = unreadNotifications?.length ?? 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        unreadCount > 0
          ? `${unreadCount} notificações não lidas. Abrir notificações`
          : "Abrir notificações"
      }
      hitSlop={8}
      onPress={onPress}
      className="relative rounded-full bg-bgSecondary p-2"
    >
      <Bell size={24} color="#FFFFFF" />
      {unreadCount > 0 && (
        <View
          accessible={false}
          className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-bgFourth bg-[#BA1A1A]"
        />
      )}
    </Pressable>
  );
}
