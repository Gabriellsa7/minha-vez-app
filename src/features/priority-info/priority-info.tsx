import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { GET_PATIENT_BY_ID_KEY, useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import { useUpdatePatient } from "@/src/api/update-patient";
import {
  ELDERLY_AGE_THRESHOLD,
  PRIORITY_LABEL,
  PRIORITY_REASON_OPTIONS,
  PRIORITY_REASONS_REQUIRING_PROOF,
} from "@/src/config/entities/patients/patients.constants";
import { EPatientPriority } from "@/src/config/entities/patients/patients.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { calculateAge } from "@/src/utils/util";
import { Href, useRouter } from "expo-router";
import {
  Check,
  ChevronDown,
  Paperclip,
  ShieldCheck,
  ShieldOff,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export function PriorityInfo() {
  const colors = useThemeColors();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();
  const { data: patient, isLoading } = useGetPatientById({
    userId: user?._id ?? "",
  });

  const [selectedPriority, setSelectedPriority] = useState<EPatientPriority>(
    EPatientPriority.NORMAL,
  );
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);

  useEffect(() => {
    if (patient) {
      setSelectedPriority(patient.priority);
    }
  }, [patient]);

  const { mutate: updatePatient, isPending: isSaving } = useUpdatePatient();

  const priority = patient?.priority ?? EPatientPriority.NORMAL;
  const hasPriority = priority !== EPatientPriority.NORMAL;
  const requiresProofToSelect =
    PRIORITY_REASONS_REQUIRING_PROOF.has(selectedPriority);

  const age = patient ? calculateAge(patient.birthDate) : null;
  const isAutoElderly = age !== null && age > ELDERLY_AGE_THRESHOLD;
  const priorityChanged = Boolean(patient) && selectedPriority !== patient?.priority;

  const handleAttachProof = () => {
    router.push("/medical-info" as Href);
  };

  const handleSave = () => {
    if (!patient) return;

    updatePatient(
      { patientId: patient._id, priority: selectedPriority },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [GET_PATIENT_BY_ID_KEY] });
          Toast.show({ type: "success", text1: "Prioridade atualizada" });
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Não foi possível salvar",
            text2: error?.message || "Tente novamente em instantes.",
          });
        },
      },
    );
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

      <View className="gap-3 rounded-2xl bg-bgThird p-4">
        <Text className="font-bold text-textBlack">Editar prioridade</Text>

        {isAutoElderly ? (
          <View className="rounded-[16px] border border-infoBorder bg-infoBg px-3 py-3">
            <Text className="text-textBlack">
              {PRIORITY_LABEL[EPatientPriority.ELDERLY]}
            </Text>
            <Text className="mt-1 text-xs text-textFourth">
              Identificado automaticamente pela sua idade.
            </Text>
          </View>
        ) : (
          <>
            <Pressable
              onPress={() => setShowPriorityOptions(true)}
              className="flex-row items-center justify-between rounded-[16px] border border-infoBorder bg-infoBg px-3 py-3"
            >
              <Text className="text-textBlack">
                {PRIORITY_LABEL[selectedPriority]}
              </Text>
              <ChevronDown size={18} color={colors.textFourth} />
            </Pressable>

            {requiresProofToSelect && (
              <Text className="text-xs text-textFourth">
                Após salvar, você poderá anexar um comprovante médico dessa
                condição em Informações de Saúde.
              </Text>
            )}

            <Pressable
              onPress={handleSave}
              disabled={isSaving || !priorityChanged}
              className={`rounded-[16px] p-3 ${
                isSaving || !priorityChanged
                  ? "bg-highlightBorder"
                  : "bg-bgSecondary"
              }`}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.textPrimary} />
              ) : (
                <Text className="text-center text-sm font-semibold text-textPrimary">
                  Salvar prioridade
                </Text>
              )}
            </Pressable>
          </>
        )}
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
            prioridade — basta selecionar a opção correspondente acima, a
            qualquer momento.
          </Text>
        </View>
      )}

      {hasPriority && PRIORITY_REASONS_REQUIRING_PROOF.has(priority) && (
        <View className="gap-3 rounded-2xl bg-bgThird p-4">
          <Text className="font-bold text-textBlack">
            Comprovação da condição
          </Text>
          <View className="rounded-[16px] border border-warningBorder bg-warningBg p-3">
            <Text className="text-xs font-medium text-warningText">
              Leve um comprovante médico dessa condição no dia do
              atendimento. Você também pode anexá-lo por aqui.
            </Text>
          </View>
          <Pressable
            onPress={handleAttachProof}
            className="flex-row items-center justify-center gap-2 rounded-[16px] bg-bgSecondary px-4 py-3"
          >
            <Paperclip size={18} color={colors.textPrimary} />
            <Text className="text-center text-sm font-semibold text-textPrimary">
              Anexar comprovante
            </Text>
          </Pressable>
        </View>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={showPriorityOptions}
        onRequestClose={() => setShowPriorityOptions(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-5"
          onPress={() => setShowPriorityOptions(false)}
        >
          <View className="w-full max-h-[70%] rounded-[24px] bg-bgThird p-5">
            <Text className="mb-3 text-lg font-semibold text-textBlack">
              Prioridade de atendimento
            </Text>
            <ScrollView>
              {PRIORITY_REASON_OPTIONS.map((option, index) => {
                const isSelected = option === selectedPriority;

                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setSelectedPriority(option);
                      setShowPriorityOptions(false);
                    }}
                    className={`flex-row items-center justify-between py-3 ${
                      index > 0 ? "border-t border-borderPrimary" : ""
                    }`}
                  >
                    <Text className="text-textBlack">
                      {PRIORITY_LABEL[option]}
                    </Text>
                    {isSelected && (
                      <Check size={18} color={colors.textSecondary} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
