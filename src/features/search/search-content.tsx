import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useSearchHealthProfessionals } from "@/src/api/search-health-professionals";
import { useSearchHealthUnits } from "@/src/api/search-health-units";
import { useDebouncedValue } from "@/src/hooks/use-debounced-value";
import { useRecentSearches } from "@/src/hooks/use-recent-searches";
import { router } from "expo-router";
import { ArrowLeft, Search, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HealthUnitResultsList } from "./components/health-unit-results-list";
import { ProfessionalResultsList } from "./components/professional-results-list";
import { RecentSearchesList } from "./components/recent-searches-list";

type SearchFilter = "clinica" | "especialidade";

export function SearchContent() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SearchFilter>("clinica");

  const debouncedQuery = useDebouncedValue(query.trim(), 400);
  const hasQuery = debouncedQuery.length > 0;

  const { recentSearches, addSearch, removeSearch, clearSearches } =
    useRecentSearches();

  const { data: healthUnits, isFetching: isSearchingUnits } =
    useSearchHealthUnits(
      { search: debouncedQuery },
      { enabled: hasQuery && filter === "clinica" },
    );

  const { data: healthProfessionals, isFetching: isSearchingProfessionals } =
    useSearchHealthProfessionals(
      { search: debouncedQuery },
      { enabled: hasQuery && filter === "especialidade" },
    );

  const { data: allHealthUnits } = useGetHealthUnits();

  const goBack = () => router.back();

  const goToHealthUnit = (unitId: string) => {
    void addSearch(debouncedQuery);
    router.push(`/health-unit-info/${unitId}`);
  };

  const goToProfessional = (professionalId: string, healthUnitId: string) => {
    void addSearch(debouncedQuery);
    router.push({
      pathname: "/agenda",
      params: { professionalId, unitId: healthUnitId },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary" edges={["top"]}>
      <View className="gap-4 bg-bgFourth px-5 pb-5 pt-3">
        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar busca"
            hitSlop={8}
            onPress={goBack}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </Pressable>
          <Text className="text-lg font-bold text-textPrimary">Busca</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center gap-2 rounded-2xl bg-bgThird px-4 py-3">
            <Search size={18} color="#888" />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() =>
                debouncedQuery && void addSearch(debouncedQuery)
              }
              returnKeyType="search"
              placeholder="Buscar clínica ou especialidade"
              placeholderTextColor="#888"
              className="flex-1 text-black"
            />
            {query.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Limpar busca"
                hitSlop={8}
                onPress={() => setQuery("")}
              >
                <X size={18} color="#888" />
              </Pressable>
            )}
          </View>
          <Pressable accessibilityRole="button" onPress={goBack}>
            <Text className="font-semibold text-textPrimary">cancelar</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            onPress={() => setFilter("clinica")}
            className={`flex-1 items-center rounded-full py-2.5 ${
              filter === "clinica" ? "bg-bgThird" : "bg-white/15"
            }`}
          >
            <Text
              className={`font-semibold ${
                filter === "clinica" ? "text-bgFourth" : "text-textPrimary"
              }`}
            >
              Clínica
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setFilter("especialidade")}
            className={`flex-1 items-center rounded-full py-2.5 ${
              filter === "especialidade" ? "bg-bgThird" : "bg-white/15"
            }`}
          >
            <Text
              className={`font-semibold ${
                filter === "especialidade"
                  ? "text-bgFourth"
                  : "text-textPrimary"
              }`}
            >
              Especialidade
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20 }}
      >
        {!hasQuery ? (
          <RecentSearchesList
            items={recentSearches}
            onSelect={setQuery}
            onRemove={(term) => void removeSearch(term)}
            onClear={() => void clearSearches()}
          />
        ) : filter === "clinica" ? (
          isSearchingUnits ? (
            <View className="items-center pt-10">
              <ActivityIndicator color="#008096" />
            </View>
          ) : (
            <HealthUnitResultsList
              units={healthUnits}
              onSelect={goToHealthUnit}
            />
          )
        ) : isSearchingProfessionals ? (
          <View className="items-center pt-10">
            <ActivityIndicator color="#008096" />
          </View>
        ) : (
          <ProfessionalResultsList
            professionals={healthProfessionals}
            healthUnits={allHealthUnits}
            onSelect={goToProfessional}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
