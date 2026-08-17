import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useGetHealthUnitRatingSummary } from "@/src/api/get-health-unit-rating-summary";
import SearchInput from "@/src/components/search-input/search-input";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { getMockClinicStats } from "@/src/features/explore/utils/mock-clinic-stats";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MapPin, Star, Timer, Users } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export function HealthUnitsList() {
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
          <View className="rounded-2xl border border-dashed border-infoBorder bg-bgThird p-4">
            <Text className="text-sm text-textFourth">
              Carregando clínicas...
            </Text>
          </View>
        ) : !filteredHealthUnits || filteredHealthUnits.length === 0 ? (
          <View className="rounded-2xl border border-dashed border-infoBorder bg-bgThird p-4">
            <Text className="text-sm text-textFourth">
              Nenhuma clínica encontrada.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {filteredHealthUnits.map((unit) => (
              <HealthUnitListItem key={unit._id} unit={unit} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

interface HealthUnitListItemProps {
  unit: IHealthUnit;
}

function HealthUnitListItem({ unit }: HealthUnitListItemProps) {
  const colors = useThemeColors();
  const stats = getMockClinicStats(unit._id);
  const { data: rating } = useGetHealthUnitRatingSummary({
    healthUnitId: unit._id,
  });

  return (
    <Pressable
      onPress={() => router.push(`/health-unit-info/${unit._id}`)}
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

      <View className="flex-1 gap-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text
            className="flex-1 text-base font-bold text-textBlack"
            numberOfLines={1}
          >
            {unit.name}
          </Text>
          {rating && rating.count > 0 && (
            <View className="flex-row items-center gap-1">
              <Star size={12} color={colors.accentStar} fill={colors.accentStar} />
              <Text className="text-xs font-semibold text-textFifth">
                {rating.average?.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center gap-1">
          <MapPin size={12} color={colors.textFourth} />
          <Text
            className="flex-1 text-xs text-textFourth"
            numberOfLines={1}
          >
            {unit.address.street}, {unit.address.number} -{" "}
            {unit.address.neighborhood}
          </Text>
        </View>
        <View className="flex-row items-center gap-3 mt-1">
          <View className="flex-row items-center gap-1">
            <Timer size={13} color={colors.textSecondary} />
            <Text className="text-xs text-textSecondary">
              {stats.waitMinutes} min
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Users size={13} color={colors.textSecondary} />
            <Text className="text-xs text-textSecondary">
              {stats.activeQueueSize} na fila
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
