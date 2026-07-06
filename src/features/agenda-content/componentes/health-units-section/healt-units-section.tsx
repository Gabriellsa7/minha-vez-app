import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { Pressable, Text, View } from "react-native";

interface HealthUnitsSectionProps {
  healthUnits?: IHealthUnit[];
  selectedUnitId?: string;
  setSelectedUnitId: (unitId: string) => void;
  setSelectedProfessionalId: (professionalId: string | null) => void;
  setSelectedTime: (time: string) => void;
}

export default function HealthUnitsSection({
  healthUnits,
  selectedUnitId,
  setSelectedUnitId,
  setSelectedProfessionalId,
  setSelectedTime,
}: HealthUnitsSectionProps) {
  return (
    <View className="mb-5">
      <Text className="mb-3 text-base font-semibold text-[#0F172A]">
        Unidade de saúde
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {healthUnits?.map((unit) => {
          const isActive = selectedUnitId === unit._id;

          return (
            <Pressable
              key={unit._id}
              onPress={() => {
                setSelectedUnitId(unit._id);
                setSelectedProfessionalId(null);
                setSelectedTime("");
              }}
              className={`rounded-full border px-4 py-2 ${
                isActive
                  ? "border-[#008096] bg-[#008096]"
                  : "border-[#D7EEF2] bg-white"
              }`}
            >
              <Text
                className={`text-sm ${isActive ? "text-white" : "text-[#0F172A]"}`}
              >
                {unit.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
