import { IUser } from "@/src/config/entities/user/user.types";
import { Avatar } from "@/src/components/avatar/avatar";
import { NotificationBell } from "@/src/components/notifications/notification-bell";
import { router } from "expo-router";
import { Text, View } from "react-native";

interface HomeHeaderProps {
  user: IUser;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function HomeHeader({ user }: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between pb-2">
      <View className="gap-3 flex-row items-center">
        <Avatar uri={user?.avatar} name={user?.name} variant="sm" />
        <View>
          <Text className="text-textPrimary font-bold text-lg">
            {getGreeting()}, {user?.name || "Usuário"}
          </Text>
          <Text className="text-textThird">Permita-nós ajuda-lo</Text>
        </View>
      </View>
      <View className="gap-3 flex-row">
        <NotificationBell onPress={() => router.push("/notifications")} />
      </View>
    </View>
  );
}
