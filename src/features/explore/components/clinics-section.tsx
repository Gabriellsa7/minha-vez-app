import { useGetHealthUnitRatingSummary } from "@/src/api/get-health-unit-rating-summary";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MapPin, Star, Timer, Users } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { getMockClinicStats } from "../utils/mock-clinic-stats";

interface ClinicsSectionProps {
  healthUnits?: IHealthUnit[];
  isLoading?: boolean;
}

export function ClinicsSection({ healthUnits, isLoading }: ClinicsSectionProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-textBlack">
            Clínicas Próximas
          </Text>
          <Text className="text-sm text-textFourth">
            Unidades disponíveis para atendimento
          </Text>
        </View>
        <Pressable onPress={() => router.push("/health-units")}>
          <Text className="text-sm font-medium text-textSecondary">
            Ver todas
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="rounded-2xl border border-dashed border-infoBorder bg-bgThird p-4">
          <Text className="text-sm text-textFourth">
            Carregando clínicas...
          </Text>
        </View>
      ) : !healthUnits || healthUnits.length === 0 ? (
        <View className="rounded-2xl border border-dashed border-infoBorder bg-bgThird p-4">
          <Text className="text-sm text-textFourth">
            Nenhuma clínica encontrada.
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 14 }}
        >
          {healthUnits.map((unit) => (
            <ClinicCard key={unit._id} unit={unit} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

interface ClinicCardProps {
  unit: IHealthUnit;
}

function ClinicCard({ unit }: ClinicCardProps) {
  const stats = getMockClinicStats(unit._id);
  const { data: rating } = useGetHealthUnitRatingSummary({
    healthUnitId: unit._id,
  });
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => router.push(`/health-unit-info/${unit._id}`)}
      className="w-64 rounded-2xl border border-borderPrimary bg-bgThird"
    >
      <View className="h-32 w-full overflow-hidden rounded-t-2xl bg-borderPrimary">
        {unit.img ? (
          <Image
            source={{ uri: unit.img }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <Image
            source={require("../../../../assets/images/Hospital.png")}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        )}

        {rating && rating.count > 0 && (
          <View className="absolute right-2 top-2 flex-row items-center gap-1 rounded-full bg-bgThird px-2 py-1">
            <Star size={12} color={colors.accentStar} fill={colors.accentStar} />
            <Text className="text-xs font-semibold text-textBlack">
              {rating.average?.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
      <View className="gap-2 p-3">
        <Text className="text-base font-bold text-textBlack" numberOfLines={1}>
          {unit.name}
        </Text>
        <View className="flex-row items-center gap-1">
          <MapPin size={12} color={colors.textFourth} />
          <Text className="text-xs text-textFourth" numberOfLines={1}>
            {unit.address.street}, {unit.address.number}
          </Text>
        </View>
        <View className="flex-row items-center justify-between rounded-xl bg-infoBg px-3 py-2">
          <View className="flex-row items-center gap-1">
            <Timer size={14} color={colors.textSecondary} />
            <Text className="text-xs text-textSecondary">
              <Text className="font-bold">{stats.waitMinutes} min</Text> espera
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Users size={14} color={colors.textSecondary} />
            <Text className="text-xs text-textSecondary">
              <Text className="font-bold">{stats.activeQueueSize}</Text> na fila
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
