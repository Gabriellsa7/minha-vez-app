import { useGetUser } from "@/src/api/get-user-me";
import { Avatar } from "@/src/components/avatar/avatar";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Href, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
interface HeaderProps {
  text: string;
  backHref?: Href;
}

export default function Header({ text, backHref }: HeaderProps) {
  const { data: user } = useGetUser();
  const colors = useThemeColors();
  return (
    <View className="flex-row justify-between items-center p-4 bg-bgThird">
      <View className="flex-row items-center gap-4">
        <Pressable
          onPress={() => (backHref ? router.replace(backHref) : router.back())}
        >
          <ArrowLeft size={26} color={colors.textSecondary} />
        </Pressable>
        <Text className="text-textSecondary text-lg font-bold">{text}</Text>
      </View>
      <Pressable onPress={() => router.push("/profile")}>
        <Avatar uri={user?.avatar} name={user?.name} variant="sm" />
      </Pressable>
    </View>
  );
}
