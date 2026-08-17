import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Stethoscope } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface HealthProfessionalsSectionProps {
  professionalsForUnit: IHealthProfessional[];
  selectedProfessionalId?: string;
  setSelectedProfessionalId: (professionalId: string | null) => void;
  setSelectedTime: (time: string) => void;
  selectedUnit?: IHealthUnit;
}

export default function HealthProfessionalsSection({
  professionalsForUnit,
  selectedProfessionalId,
  setSelectedProfessionalId,
  setSelectedTime,
  selectedUnit,
}: HealthProfessionalsSectionProps) {
  const colors = useThemeColors();

  return (
    <View className="mb-5">
      <Text className="mb-3 text-base font-semibold text-textBlack">
        Profissionais disponíveis
      </Text>
      {professionalsForUnit.length === 0 ? (
        <View className="rounded-[20px] border border-dashed border-infoBorder bg-bgThird p-4">
          <Text className="text-sm text-textFourth">
            Não há profissionais disponíveis para essa unidade ainda.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {professionalsForUnit.map((professional) => {
            const isSelected = selectedProfessionalId === professional._id;

            return (
              <Pressable
                key={professional._id}
                onPress={() => {
                  setSelectedProfessionalId(professional._id);
                  setSelectedTime("");
                }}
                className={`rounded-[20px] border p-4 ${
                  isSelected
                    ? "border-bgSecondary bg-infoBg"
                    : "border-borderPrimary bg-bgThird"
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="rounded-full bg-infoBg p-3">
                    <Stethoscope size={18} color={colors.textSecondary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-textBlack">
                      {professional.specialty}
                    </Text>
                    <Text className="text-base font-semibold text-textSecondary">
                      {professional.name}
                    </Text>
                    <Text className="text-sm text-textFourth">
                      {selectedUnit?.name || "Unidade selecionada"}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-textFourth">
                        {selectedUnit?.address.street || "Unidade selecionada"}{" "}
                        - {selectedUnit?.address.number}
                      </Text>
                      <Text className="text-sm text-textFourth">
                        {selectedUnit?.address.city || "Unidade selecionada"} -{" "}
                        {selectedUnit?.address.state || "Unidade selecionada"}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
