import { useGetHealthUnitsInfinite } from "@/src/api/get-health-units";
import SearchInput from "@/src/components/search-input/search-input";
import { flattenPaginatedPages } from "@/src/helpers/react-query/pagination";
import { useDebouncedValue } from "@/src/hooks/use-debounced-value";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import ExamClinicListItem from "./components/exam-clinic-list-item/exam-clinic-list-item";

export function ExamSchedulingList() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery.trim(), 400);
  const colors = useThemeColors();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetHealthUnitsInfinite({
      search: debouncedSearch || undefined,
    });

  const healthUnits = flattenPaginatedPages(data);

  return (
    <FlatList
      className="bg-bgPrimary"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 16, padding: 20 }}
      data={healthUnits}
      keyExtractor={(unit) => unit._id}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <View className="pb-4">
          <SearchInput
            placeholder="Buscar clínica, bairro ou cidade"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      }
      ListEmptyComponent={
        isLoading ? (
          <View className="rounded-2xl border border-dashed border-infoBorder bg-bgThird p-4">
            <Text className="text-sm text-textFourth">
              Carregando clínicas...
            </Text>
          </View>
        ) : (
          <View className="rounded-2xl border border-dashed border-infoBorder bg-bgThird p-4">
            <Text className="text-sm text-textFourth">
              Nenhuma clínica encontrada.
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="items-center py-4">
            <ActivityIndicator color={colors.textSecondary} />
          </View>
        ) : null
      }
      renderItem={({ item: unit }) => <ExamClinicListItem unit={unit} />}
    />
  );
}
