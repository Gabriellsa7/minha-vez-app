import { Search } from "lucide-react-native";
import { TextInput, View } from "react-native";

interface SearchInputProps {
  placeholder: string;
}

export default function SearchInput({ placeholder }: SearchInputProps) {
  return (
    <View className="flex-row items-center gap-2 bg-bgPrimary px-5 py-3 rounded-2xl">
      <Search size={18} color="#888" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#888"
        className="flex-1 text-black"
      />
    </View>
  );
}
