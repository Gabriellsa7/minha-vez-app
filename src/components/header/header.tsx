import { IUser } from "@/src/config/entities/user/user.types";
import { ArrowLeft, User } from "lucide-react-native";
import { Text, View } from "react-native";

interface HeaderProps {
  text: string;
  user: IUser;
}

export default function Header({ text, user }: HeaderProps) {
  return (
    <View className="flex-row justify-between items-center gap-4 p-4">
      <View className="flex-row items-center gap-4 p-6">
        <ArrowLeft size={20} color="#006673" />
        <Text className="text-textSecondary text-lg">{text}</Text>
      </View>

      {/* User Profile Image */}
      <User size={32} color="#006673" />
    </View>
  );
}
