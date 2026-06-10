import { IUser } from "@/src/config/entities/user/user.types";
import { Bell, Info, User } from "lucide-react-native";
import { Text, View } from "react-native";

interface HomeHeaderProps {
  user: IUser;
}

export default function HomeHeader({ user }: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between pb-2">
      <View className="gap-3 flex-row items-center">
        {/* User Profile Image */}
        <User size={32} color="#FFFFFF" />
        <View>
          <Text className="text-textPrimary font-bold text-xl">
            Bom dia, {user?.name || "User"}
          </Text>
          <Text className="text-textThird">Permita-nós ajuda-lo</Text>
        </View>
      </View>
      <View className="gap-3 flex-row">
        <View className="rounded-full bg-bgSecondary p-2">
          <Bell size={24} color="#FFFFFF" />
        </View>
        <View className="rounded-full bg-bgSecondary p-2">
          <Info size={24} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}
