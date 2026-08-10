import { IUser } from "@/src/config/entities/user/user.types";
import { NotificationBell } from "@/src/components/notifications/notification-bell";
import { getUserInitials } from "@/src/utils/util";
import { router } from "expo-router";
import { Text, View } from "react-native";

interface HomeHeaderProps {
  user: IUser;
}

export default function HomeHeader({ user }: HomeHeaderProps) {
  const userInitials = user ? getUserInitials(user.name) : "";
  return (
    <View className="flex-row items-center justify-between pb-2">
      <View className="gap-3 flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-bgSecondary flex items-center justify-center">
          {/*User image profile*/}
          <Text className="text-textPrimary text-lg font-bold">
            {userInitials}
          </Text>
        </View>
        <View>
          <Text className="text-textPrimary font-bold text-lg">
            Bom dia, {user?.name || "User"}
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
