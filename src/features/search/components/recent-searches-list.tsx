import { Clock, X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface RecentSearchesListProps {
  items: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
  onClear: () => void;
}

export function RecentSearchesList({
  items,
  onSelect,
  onRemove,
  onClear,
}: RecentSearchesListProps) {
  if (items.length === 0) {
    return (
      <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
        <Text className="text-sm text-textFourth">
          Suas buscas recentes vão aparecer aqui.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-textBlack">
          Buscas recentes
        </Text>
        <Pressable accessibilityRole="button" onPress={onClear}>
          <Text className="text-sm font-semibold text-textSecondary">
            Limpar
          </Text>
        </Pressable>
      </View>

      <View className="gap-1">
        {items.map((term) => (
          <View
            key={term}
            className="flex-row items-center gap-3 rounded-xl px-1 py-2.5"
          >
            <Clock size={16} color="#A8A8A8" />
            <Pressable
              className="flex-1"
              accessibilityRole="button"
              onPress={() => onSelect(term)}
            >
              <Text className="text-sm text-textBlack">{term}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => onRemove(term)}
            >
              <X size={16} color="#A8A8A8" />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
