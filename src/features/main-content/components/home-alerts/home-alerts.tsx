import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { router } from "expo-router";
import { HeartPulse, UserRound } from "lucide-react-native";
import { Pressable, Text } from "react-native";

interface HomeAlertsProps {
  hasPatientProfile: boolean;
  needsMedicalInfoReminder: boolean;
  onCompleteRegistration: () => void;
}

export function HomeAlerts({
  hasPatientProfile,
  needsMedicalInfoReminder,
  onCompleteRegistration,
}: HomeAlertsProps) {
  const colors = useThemeColors();

  return (
    <>
      {!hasPatientProfile && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Completar cadastro"
          onPress={onCompleteRegistration}
          className="w-full flex-row items-center gap-3 rounded-[16px] border border-warningBorder bg-warningBg p-3"
        >
          <UserRound size={20} color={colors.warningText} />
          <Text className="flex-1 text-sm font-medium text-warningText">
            Complete seu cadastro para agendar consultas e acessar todos os
            recursos. Toque aqui para completar.
          </Text>
        </Pressable>
      )}
      {needsMedicalInfoReminder && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Preencher dados de saúde"
          onPress={() => router.push("/medical-info")}
          className="w-full flex-row items-center gap-3 rounded-[16px] border border-warningBorder bg-warningBg p-3"
        >
          <HeartPulse size={20} color={colors.warningText} />
          <Text className="flex-1 text-sm font-medium text-warningText">
            Complete seus dados de saúde (tipo sanguíneo, alergias e observações
            médicas). Eles são importantes para o seu atendimento.
          </Text>
        </Pressable>
      )}
    </>
  );
}
