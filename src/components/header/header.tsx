import { useGetUser } from "@/src/api/get-user-me";
import { getUserInitials } from "@/src/utils/util";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
interface HeaderProps {
  text: string;
}

export default function Header({ text }: HeaderProps) {
  const { data: user } = useGetUser();
  const userInitials = user ? getUserInitials(user.name) : "";
  return (
    <View className="flex-row justify-between items-center p-4 bg-bgThird">
      <View className="flex-row items-center gap-4">
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={26} color="#006673" />
        </Pressable>
        <Text className="text-textSecondary text-lg font-bold">{text}</Text>
      </View>
      <View className="w-10 h-10 rounded-full bg-bgSecondary flex items-center justify-center">
        {/*User image profile, add a button to edit the image too*/}
        <Text className="text-textPrimary text-lg font-bold">
          {userInitials}
        </Text>
      </View>
    </View>
  );
}
