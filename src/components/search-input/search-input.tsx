import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Search } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

interface SearchInputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (value: string) => void;
  onPress?: () => void;
}

export default function SearchInput({
  placeholder,
  value,
  onChangeText,
  onPress,
}: SearchInputProps) {
  const colors = useThemeColors();
  const content = (
    <View className="flex-row items-center gap-2 bg-bgThird px-5 rounded-2xl h-14">
      <Search size={18} color={colors.textFourth} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textFourth}
        value={value}
        onChangeText={onChangeText}
        editable={!onPress}
        pointerEvents={onPress ? "none" : "auto"}
        textAlignVertical="center"
        style={{ includeFontPadding: false, paddingVertical: 0 }}
        className="flex-1 text-textFourth"
      />
    </View>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return content;
}
