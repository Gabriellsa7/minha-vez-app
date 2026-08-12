import { useGetHealthUnits } from "@/src/api/get-health-units";
import SearchInput from "@/src/components/search-input/search-input";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export function ExamSchedulingList() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: healthUnits, isLoading } = useGetHealthUnits();

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

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="bg-bgPrimary">
      <View className="gap-5 p-5">
        <SearchInput
          placeholder="Buscar clínica, bairro ou cidade"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {isLoading ? (
          <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
            <Text className="text-sm text-textFourth">
              Carregando clínicas...
            </Text>
          </View>
        ) : !filteredHealthUnits || filteredHealthUnits.length === 0 ? (
          <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
            <Text className="text-sm text-textFourth">
              Nenhuma clínica encontrada.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {filteredHealthUnits.map((unit) => (
              <ExamClinicListItem key={unit._id} unit={unit} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function ExamClinicListItem({ unit }: { unit: IHealthUnit }) {
  return (
    <Pressable
      onPress={() => router.push(`/exam-scheduling/${unit._id}`)}
      className="flex-row gap-3 rounded-2xl border border-[#E7ECEF] bg-bgThird p-3"
    >
      <View className="h-20 w-20 overflow-hidden rounded-xl bg-[#E2E8F0]">
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
          <MapPin size={12} color="#A8A8A8" />
          <Text className="flex-1 text-xs text-textFourth" numberOfLines={1}>
            {unit.address.street}, {unit.address.number} -{" "}
            {unit.address.neighborhood}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
