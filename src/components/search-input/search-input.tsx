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
  const content = (
    <View className="flex-row items-center gap-2 bg-bgThird py-3 px-5 rounded-2xl">
      <Search size={18} color="#888" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        editable={!onPress}
        pointerEvents={onPress ? "none" : "auto"}
        className="flex-1 text-black"
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
