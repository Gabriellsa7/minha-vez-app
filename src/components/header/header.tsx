import { IUser } from "@/src/config/entities/user/user.types";
import { router } from "expo-router";
import { ArrowLeft, User } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
interface HeaderProps {
  text: string;
  user?: IUser;
}

export default function Header({ text, user }: HeaderProps) {
  return (
    <View className="flex-row justify-between items-center gap-4 p-6 bg-bgThird">
      <View className="flex-row items-center gap-4">
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={26} color="#006673" />
        </Pressable>
        <Text className="text-textSecondary text-lg font-bold">{text}</Text>
      </View>
      {/* User Profile Image */}
      <User size={26} color="#006673" />
    </View>
  );
}
