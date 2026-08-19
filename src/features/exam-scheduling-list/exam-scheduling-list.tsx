import { useGetHealthUnitsInfinite } from "@/src/api/get-health-units";
import SearchInput from "@/src/components/search-input/search-input";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { flattenPaginatedPages } from "@/src/helpers/react-query/pagination";
import { useDebouncedValue } from "@/src/hooks/use-debounced-value";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export function ExamSchedulingList() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery.trim(), 400);
  const colors = useThemeColors();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetHealthUnitsInfinite({
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

function ExamClinicListItem({ unit }: { unit: IHealthUnit }) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => router.push(`/exam-scheduling/${unit._id}`)}
      className="flex-row gap-3 rounded-2xl border border-borderPrimary bg-bgThird p-3"
    >
      <View className="h-20 w-20 overflow-hidden rounded-xl bg-borderPrimary">
        {unit.img ? (
          <Image
            source={{ uri: unit.img }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <Image
            source={require("../../../assets/images/Hospital.png")}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        )}
      </View>

      <View className="flex-1 justify-center gap-1">
        <Text className="text-base font-bold text-textBlack" numberOfLines={1}>
          {unit.name}
        </Text>
        <View className="flex-row items-center gap-1">
          <MapPin size={12} color={colors.textFourth} />
          <Text className="flex-1 text-xs text-textFourth" numberOfLines={1}>
            {unit.address.street}, {unit.address.number} -{" "}
            {unit.address.neighborhood}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
