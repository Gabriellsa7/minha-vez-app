import { useGetProfessionalRatingSummary } from "@/src/api/get-professional-rating-summary";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { getUserInitials } from "@/src/utils/util";
import { router } from "expo-router";
import { Star } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ProfessionalsSectionProps {
  professionals?: IHealthProfessional[];
  healthUnits?: IHealthUnit[];
  isLoading?: boolean;
}

export function ProfessionalsSection({
  professionals,
  healthUnits,
  isLoading,
}: ProfessionalsSectionProps) {
  return (
    <View className="gap-3">
      <View>
        <Text className="text-lg font-bold text-textBlack">
          Especialistas Recomendados
        </Text>
        <Text className="text-sm text-textFourth">
          Mais bem avaliados por pacientes
        </Text>
      </View>

      {isLoading ? (
        <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
          <Text className="text-sm text-textFourth">
            Carregando especialistas...
          </Text>
        </View>
      ) : !professionals || professionals.length === 0 ? (
        <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
          <Text className="text-sm text-textFourth">
            Nenhum especialista encontrado.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {professionals.map((professional) => {
            const unit = healthUnits?.find(
              (item) => item._id === professional.healthUnitId,
            );

            return (
              <ProfessionalCard
                key={professional._id}
                professional={professional}
                unit={unit}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

interface ProfessionalCardProps {
  professional: IHealthProfessional;
  unit?: IHealthUnit;
}

function ProfessionalCard({ professional, unit }: ProfessionalCardProps) {
  const { data: rating } = useGetProfessionalRatingSummary({
    professionalId: professional._id,
  });

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-[#E7ECEF] bg-bgThird p-3">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-bgSecondary">
        <Text className="text-base font-bold text-textPrimary">
          {getUserInitials(professional.name)}
        </Text>
      </View>

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
              <Star size={13} color="#F5B301" fill="#F5B301" />
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
        className="rounded-full bg-[#008096] px-4 py-2"
      >
        <Text className="text-xs font-semibold text-white">Ver Agenda</Text>
      </Pressable>
    </View>
  );
}
