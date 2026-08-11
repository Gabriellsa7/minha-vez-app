import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { getUserInitials } from "@/src/utils/util";
import { Pressable, Text, View } from "react-native";

interface ProfessionalResultsListProps {
  professionals?: IHealthProfessional[];
  healthUnits?: IHealthUnit[];
  isLoading?: boolean;
  onSelect: (professionalId: string, healthUnitId: string) => void;
}

export function ProfessionalResultsList({
  professionals,
  healthUnits,
  isLoading,
  onSelect,
}: ProfessionalResultsListProps) {
  if (isLoading) {
    return (
      <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
        <Text className="text-sm text-textFourth">
          Buscando especialidades...
        </Text>
      </View>
    );
  }

  if (!professionals || professionals.length === 0) {
    return (
      <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
        <Text className="text-sm text-textFourth">
          Nenhum médico encontrado para essa especialidade.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {professionals.map((professional) => {
        const unit = healthUnits?.find(
          (item) => item._id === professional.healthUnitId,
        );

        return (
          <Pressable
            key={professional._id}
            onPress={() =>
              onSelect(professional._id, professional.healthUnitId)
            }
            className="flex-row items-center gap-3 rounded-2xl border border-[#E7ECEF] bg-bgThird p-3"
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-bgSecondary">
              <Text className="text-base font-bold text-textPrimary">
                {getUserInitials(professional.name)}
              </Text>
            </View>

            <View className="flex-1 gap-0.5">
              <Text
                className="text-base font-semibold text-textBlack"
                numberOfLines={1}
              >
                {professional.name}
              </Text>
              <Text className="text-sm text-textSecondary">
                {professional.specialty}
              </Text>
              {unit && (
                <Text className="text-xs text-textFourth" numberOfLines={1}>
                  {unit.name}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
