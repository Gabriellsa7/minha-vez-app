import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
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
  return (
    <View className="mb-5">
      <Text className="mb-3 text-base font-semibold text-[#0F172A]">
        Profissionais disponíveis
      </Text>
      {professionalsForUnit.length === 0 ? (
        <View className="rounded-[20px] border border-dashed border-[#D7EEF2] bg-white p-4">
          <Text className="text-sm text-[#64748B]">
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
                    ? "border-[#008096] bg-[#E8F8FA]"
                    : "border-[#E2E8F0] bg-white"
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="rounded-full bg-[#008096]/10 p-3">
                    <Stethoscope size={18} color="#008096" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-[#0F172A]">
                      {professional.specialty}
                    </Text>
                    <Text className="text-base font-semibold text-[#008096]">
                      {professional.name}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-[#64748B]">
                        {selectedUnit?.name || "Unidade selecionada"}
                      </Text>
                      <Text className="text-sm text-[#64748B]">
                        {selectedUnit?.address.street || "Unidade selecionada"}
                      </Text>
                    </View>
                    <Text className="text-sm text-[#64748B]">
                      {selectedUnit?.address.city || "Unidade selecionada"} -{" "}
                      {selectedUnit?.address.state || "Unidade selecionada"}
                    </Text>
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
