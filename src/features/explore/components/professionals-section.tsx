import { useGetProfessionalRatingSummary } from "@/src/api/get-professional-rating-summary";
import { Avatar } from "@/src/components/avatar/avatar";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { router } from "expo-router";
import { Star } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ProfessionalCardProps {
  professional: IHealthProfessional;
  unit?: IHealthUnit;
}

export function ProfessionalCard({ professional, unit }: ProfessionalCardProps) {
  const { data: rating } = useGetProfessionalRatingSummary({
    professionalId: professional._id,
  });
  const colors = useThemeColors();

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-borderPrimary bg-bgThird p-3">
      <Avatar uri={professional.avatar} name={professional.name} variant="md" />

      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center justify-between">
          <Text
            className="flex-1 text-base font-semibold text-textBlack"
            numberOfLines={1}
          >
            {professional.name}
          </Text>
          {rating && rating.count > 0 ? (
            <View className="flex-row items-center gap-1">
              <Star size={13} color={colors.accentStar} fill={colors.accentStar} />
              <Text className="text-xs font-semibold text-textFifth">
                {rating.average?.toFixed(1)}
              </Text>
            </View>
          ) : (
            <Text className="text-xs text-textFourth">Sem avaliações</Text>
          )}
        </View>
        <Text className="text-sm text-textSecondary">
          {professional.specialty}
        </Text>
        {unit && (
          <Text className="text-xs text-textFourth" numberOfLines={1}>
            {unit.name}
          </Text>
        )}
      </View>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/agenda",
            params: {
              professionalId: professional._id,
              unitId: professional.healthUnitId,
            },
          })
        }
        className="rounded-full bg-bgSecondary px-4 py-2"
      >
        <Text className="text-xs font-semibold text-textPrimary">Ver Agenda</Text>
      </Pressable>
    </View>
  );
}
