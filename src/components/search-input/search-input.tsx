import { Search } from "lucide-react-native";
import { TextInput, View } from "react-native";

interface SearchInputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (value: string) => void;
}

export default function SearchInput({
  placeholder,
  value,
  onChangeText,
}: SearchInputProps) {
  return (
    <View className="flex-row items-center gap-2 bg-bgPrimary py-3 px-5 rounded-2xl">
      <Search size={18} color="#888" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        className="flex-1 text-black"
      />
    </View>
  );
}
