import { IPatient } from "@/src/config/entities/patients/patients.type";
import { BLOOD_TYPE_LABEL } from "@/src/config/entities/patients/patients.constants";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Href, useRouter } from "expo-router";
import { ArrowRight, FileHeart } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface HealthInfoCardProps {
  patient?: IPatient | null;
}

export const HealthInfoCard = ({ patient }: HealthInfoCardProps) => {
  const router = useRouter();
  const colors = useThemeColors();

  const bloodTypeLabel = patient?.bloodType
    ? BLOOD_TYPE_LABEL[patient.bloodType]
    : "Não informado";

  const allergies = patient?.allergies
    ? patient.allergies
        .split(",")
        .map((allergy) => allergy.trim())
        .filter(Boolean)
    : [];

  return (
    <Pressable
      onPress={() => router.push("/medical-info" as Href)}
      className="gap-3 rounded-2xl bg-bgThird p-4"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <FileHeart size={20} color={colors.textSecondary} />
          <Text className="text-base font-bold text-textBlack">
            Histórico Médico
          </Text>
        </View>
        <ArrowRight size={20} color={colors.textFourth} />
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-1 rounded-xl bg-statusDangerBg p-3">
          <Text className="text-xs font-bold uppercase text-statusDangerText">
            Tipo Sanguíneo
          </Text>
          <Text
            className={
              patient?.bloodType
                ? "text-2xl font-bold text-textBlack"
                : "text-sm text-textFourth"
            }
          >
            {bloodTypeLabel}
          </Text>
        </View>
        <View className="flex-1 gap-1 rounded-xl bg-statusDangerBg p-3">
          <Text className="text-xs font-bold uppercase text-statusDangerText">
            Alergias
          </Text>
          {allergies.length > 0 ? (
            <View className="flex-row flex-wrap gap-1">
              {allergies.map((allergy) => (
                <View
                  key={allergy}
                  className="rounded-full bg-bgThird px-2 py-0.5"
                >
                  <Text className="text-xs font-semibold text-textBlack">
                    {allergy}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-textFourth">Não informado</Text>
          )}
        </View>
      </View>

      <View className="gap-1 rounded-xl bg-highlightBg p-3">
        <Text className="text-xs font-bold uppercase text-highlightText">
          Doenças Crônicas / Observações
        </Text>
        <Text className="text-sm text-textBlack">
          {patient?.medicalObservations || "Não informado"}
        </Text>
      </View>
    </Pressable>
  );
};
