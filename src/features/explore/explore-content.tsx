import {
  useGetHealthProfessionals,
  useGetHealthProfessionalsInfinite,
} from "@/src/api/get-health-professionals";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import Header from "@/src/components/header/header";
import SearchInput from "@/src/components/search-input/search-input";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { flattenPaginatedPages } from "@/src/helpers/react-query/pagination";
import { useDebouncedValue } from "@/src/hooks/use-debounced-value";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import {
  ALL_SPECIALTIES_OPTION,
  CategoriesSection,
} from "@/src/components/specialty-filter/specialty-filter";
import { ClinicsSection } from "./components/clinics-section";
import { ProfessionalCard } from "./components/professionals-section";

export function ExploreContent() {
  const tabBarHeight = useBottomTabBarHeight();
  const colors = useThemeColors();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery.trim(), 400);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    ALL_SPECIALTIES_OPTION,
  );

  const { data: healthUnits, isLoading: isHealthUnitsLoading } =
    useGetHealthUnits();
  const { data: healthProfessionals } = useGetHealthProfessionals();

  const {
    data: professionalsPages,
    isLoading: isProfessionalsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetHealthProfessionalsInfinite({
    search: debouncedSearch || undefined,
    specialty:
      selectedSpecialty === ALL_SPECIALTIES_OPTION
        ? undefined
        : selectedSpecialty,
  });

  const professionals = flattenPaginatedPages(professionalsPages);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredHealthUnits = useMemo(() => {
    if (!healthUnits) return healthUnits;
    if (!normalizedQuery) return healthUnits;

    return healthUnits.filter((unit) => {
      const haystack =
        `${unit.name} ${unit.address.street} ${unit.address.neighborhood} ${unit.address.city}`.toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [healthUnits, normalizedQuery]);

  const healthUnitsById = useMemo(() => {
    return new Map((healthUnits ?? []).map((unit) => [unit._id, unit]));
  }, [healthUnits]);

  const specialties = useMemo(() => {
    if (!healthProfessionals) return [];

    return Array.from(
      new Set(healthProfessionals.map((professional) => professional.specialty)),
    ).sort();
  }, [healthProfessionals]);

  return (
    <View className="flex-1">
      <Header text="Explorar" />
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 20,
        }}
        data={professionals}
        keyExtractor={(professional) => professional._id}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item: professional }: { item: IHealthProfessional }) => (
          <ProfessionalCard
            professional={professional}
            unit={healthUnitsById.get(professional.healthUnitId)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={
          <View className="pt-6 gap-8">
            <View className="gap-2">
              <View>
                <Text className="text-textBlack text-2xl">
                  Encontre o cuidado{" "}
                  <Text className="text-textSecondary">que você merece</Text>.
                </Text>
              </View>
              <View>
                <Text className="text-textFifth">
                  Busque por clínicas, especialistas ou sintomas para iniciar seu
                  atendimento.
                </Text>
              </View>
            </View>
            <SearchInput
              placeholder="Qual especialidade você procura"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <ClinicsSection
              healthUnits={filteredHealthUnits}
              isLoading={isHealthUnitsLoading}
            />
            <CategoriesSection
              specialties={specialties}
              selected={selectedSpecialty}
              onSelect={setSelectedSpecialty}
            />
            <View>
              <Text className="text-lg font-bold text-textBlack">
                Especialistas Recomendados
              </Text>
              <Text className="text-sm text-textFourth">
                Mais bem avaliados por pacientes
              </Text>
            </View>
          </View>
        }
        ListHeaderComponentStyle={{ marginBottom: 12 }}
        contentContainerClassName="px-6"
        ListEmptyComponent={
          isProfessionalsLoading ? (
            <View className="rounded-2xl border border-dashed border-infoBorder bg-bgThird p-4">
              <Text className="text-sm text-textFourth">
                Carregando especialistas...
              </Text>
            </View>
          ) : (
            <View className="rounded-2xl border border-dashed border-infoBorder bg-bgThird p-4">
              <Text className="text-sm text-textFourth">
                Nenhum especialista encontrado.
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
      />
    </View>
  );
}
