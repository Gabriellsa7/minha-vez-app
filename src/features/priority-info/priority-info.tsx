import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import {
  PRIORITY_LABEL,
  PRIORITY_REASONS_REQUIRING_PROOF,
} from "@/src/config/entities/patients/patients.constants";
import { EPatientPriority } from "@/src/config/entities/patients/patients.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import {
  Paperclip,
  ShieldCheck,
  ShieldOff,
} from "lucide-react-native";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export function PriorityInfo() {
  const colors = useThemeColors();
  const { data: user } = useGetUser();
  const { data: patient, isLoading } = useGetPatientById({
    userId: user?._id ?? "",
  });

  const priority = patient?.priority ?? EPatientPriority.NORMAL;
  const hasPriority = priority !== EPatientPriority.NORMAL;
  const requiresProof = PRIORITY_REASONS_REQUIRING_PROOF.has(priority);

  const handleAttachProof = () => {
    Toast.show({
      type: "info",
      text1: "Em breve",
      text2: "O anexo de comprovantes será liberado em uma próxima atualização.",
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.textSecondary} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-bgPrimary" contentContainerStyle={{ padding: 24, gap: 16 }}>
      <View className="items-center gap-3 rounded-2xl bg-bgThird p-6">
        {hasPriority ? (
          <ShieldCheck size={40} color={colors.textSecondary} />
        ) : (
          <ShieldOff size={40} color={colors.textFourth} />
        )}
        <Text className="text-lg font-bold text-textBlack">
          {PRIORITY_LABEL[priority]}
        </Text>
        <Text className="text-center text-sm text-textFourth">
          {hasPriority
            ? "Você tem prioridade no atendimento e nas filas de espera."
            : "Você ainda não possui prioridade de atendimento cadastrada."}
        </Text>
      </View>

      {!hasPriority && (
        <View className="gap-2 rounded-2xl bg-bgThird p-4">
          <Text className="font-bold text-textBlack">
            Como funciona a prioridade
          </Text>
          <Text className="text-sm text-textFourth">
            Pessoas com 60 anos ou mais são identificadas automaticamente como
            prioridade. Gestantes, pessoas com deficiência e pessoas com
            alguma doença crônica ou condição de saúde também podem ter
            prioridade — basta selecionar a opção correspondente no seu
            próximo cadastro ou agendamento.
          </Text>
        </View>
      )}

      {requiresProof && (
        <View className="gap-3 rounded-2xl bg-bgThird p-4">
          <Text className="font-bold text-textBlack">
            Comprovação da condição
          </Text>
          <View className="rounded-[16px] border border-warningBorder bg-warningBg p-3">
            <Text className="text-xs font-medium text-warningText">
              Leve um comprovante médico dessa condição no dia do
              atendimento. Em breve você também poderá anexá-lo por aqui.
            </Text>
          </View>
          <Pressable
            onPress={handleAttachProof}
            className="flex-row items-center justify-center gap-2 rounded-[16px] bg-bgSecondary px-4 py-3"
          >
            <Paperclip size={18} color={colors.textPrimary} />
            <Text className="text-center text-sm font-semibold text-textPrimary">
              Anexar comprovante (em breve)
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
