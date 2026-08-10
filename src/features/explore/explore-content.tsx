import { useGetHealthProfessionals } from "@/src/api/get-health-professionals";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import Header from "@/src/components/header/header";
import SearchInput from "@/src/components/search-input/search-input";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  ALL_SPECIALTIES_OPTION,
  CategoriesSection,
} from "./components/categories-section";
import { ClinicsSection } from "./components/clinics-section";
import { ProfessionalsSection } from "./components/professionals-section";

export function ExploreContent() {
  const tabBarHeight = useBottomTabBarHeight();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    ALL_SPECIALTIES_OPTION,
  );

  const { data: healthUnits, isLoading: isHealthUnitsLoading } =
    useGetHealthUnits();
  const { data: healthProfessionals, isLoading: isHealthProfessionalsLoading } =
    useGetHealthProfessionals();

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

  const specialties = useMemo(() => {
    if (!healthProfessionals) return [];

    return Array.from(
      new Set(healthProfessionals.map((professional) => professional.specialty)),
    ).sort();
  }, [healthProfessionals]);

  const filteredProfessionals = useMemo(() => {
    if (!healthProfessionals) return healthProfessionals;

    return healthProfessionals.filter((professional) => {
      const matchesSpecialty =
        selectedSpecialty === ALL_SPECIALTIES_OPTION ||
        professional.specialty === selectedSpecialty;

      const matchesQuery =
        !normalizedQuery ||
        `${professional.name} ${professional.specialty}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesSpecialty && matchesQuery;
    });
  }, [healthProfessionals, selectedSpecialty, normalizedQuery]);

  return (
    <View className="flex-1">
      <Header text="Explorar" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 20,
        }}
      >
        <View className="p-6 gap-8">
          <View className="gap-2">
            <View>
              <Text className=" text-2xl">
                Encontre o cuidado{" "}
                <Text className="text-textSecondary">que você merece</Text>.
              </Text>
            </View>
            <View>
              <Text>
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
          <ProfessionalsSection
            professionals={filteredProfessionals}
            healthUnits={healthUnits}
            isLoading={isHealthProfessionalsLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
}
