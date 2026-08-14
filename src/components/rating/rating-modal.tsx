import { useCreateAppointmentRating } from "@/src/api/create-appointment-rating";
import {
  GET_APPOINTMENT_RATING_ELIGIBILITY_KEY,
  useGetAppointmentRatingEligibility,
} from "@/src/api/get-appointment-rating-eligibility";
import { useGetHealthProfessionalById } from "@/src/api/get-health-professional-by-id";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { GET_HEALTH_UNIT_RATING_SUMMARY_KEY } from "@/src/api/get-health-unit-rating-summary";
import { GET_PROFESSIONAL_RATING_SUMMARY_KEY } from "@/src/api/get-professional-rating-summary";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StarRatingInput } from "./star-rating-input";

interface RatingModalProps {
  appointmentId: string | null;
  visible: boolean;
  onClose: () => void;
}

export function RatingModal({
  appointmentId,
  visible,
  onClose,
}: RatingModalProps) {
  const queryClient = useQueryClient();

  const [professionalStars, setProfessionalStars] = useState(0);
  const [professionalComment, setProfessionalComment] = useState("");
  const [clinicStars, setClinicStars] = useState(0);
  const [clinicComment, setClinicComment] = useState("");

  useEffect(() => {
    if (visible) {
      setProfessionalStars(0);
      setProfessionalComment("");
      setClinicStars(0);
      setClinicComment("");
    }
  }, [visible, appointmentId]);

  const { data: eligibility, isLoading: isEligibilityLoading } =
    useGetAppointmentRatingEligibility(
      { appointmentId: appointmentId ?? "" },
      { enabled: visible && Boolean(appointmentId) },
    );

  const { data: professional } = useGetHealthProfessionalById(
    { professionalId: eligibility?.professionalId ?? "" },
    {
      enabled: Boolean(
        eligibility?.canRateProfessional && eligibility.professionalId,
      ),
    },
  );

  const { data: healthUnit } = useGetHealthUnitById(
    { healthUnitId: eligibility?.healthUnitId ?? "" },
    {
      enabled: Boolean(eligibility?.canRateClinic && eligibility.healthUnitId),
    },
  );

  const createRating = useCreateAppointmentRating();

  const canRateProfessional = Boolean(eligibility?.canRateProfessional);
  const canRateClinic = Boolean(eligibility?.canRateClinic);
  const hasNothingToRate =
    !isEligibilityLoading && !canRateProfessional && !canRateClinic;

  const canSubmit =
    (!canRateProfessional || professionalStars > 0) &&
    (!canRateClinic || clinicStars > 0) &&
    (canRateProfessional || canRateClinic);

  const handleSubmit = () => {
    if (!appointmentId || !canSubmit) return;

    createRating.mutate(
      {
        appointmentId,
        professionalStars: canRateProfessional ? professionalStars : undefined,
        professionalComment: canRateProfessional
          ? professionalComment.trim() || undefined
          : undefined,
        clinicStars: canRateClinic ? clinicStars : undefined,
        clinicComment: canRateClinic
          ? clinicComment.trim() || undefined
          : undefined,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [GET_PROFESSIONAL_RATING_SUMMARY_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [GET_HEALTH_UNIT_RATING_SUMMARY_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [GET_APPOINTMENT_RATING_ELIGIBILITY_KEY],
          });
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView className="flex-1 justify-center bg-black/50 px-4">
        <View className="max-h-[85%] rounded-2xl bg-bgThird">
          <View className="flex-row items-center justify-between border-b border-borderPrimary px-5 py-4">
            <Text className="text-lg font-bold text-textBlack">
              Avalie seu atendimento
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar avaliação"
              hitSlop={8}
              onPress={onClose}
            >
              <ArrowLeft size={24} color="#006673" />
            </Pressable>
          </View>

          {isEligibilityLoading ? (
            <View className="items-center gap-3 p-8">
              <ActivityIndicator color="#008096" />
              <Text className="text-textFifth">Carregando...</Text>
            </View>
          ) : hasNothingToRate ? (
            <View className="items-center gap-3 p-8">
              <Text className="text-center text-textFifth">
                Não há nada para avaliar neste atendimento.
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="px-5 py-4"
            >
              {canRateProfessional && (
                <View className="mb-5 gap-2">
                  <Text className="text-base font-semibold text-textBlack">
                    {professional?.name
                      ? `Dr(a). ${professional.name}`
                      : "Profissional"}
                  </Text>
                  <StarRatingInput
                    value={professionalStars}
                    onChange={setProfessionalStars}
                  />
                  <TextInput
                    value={professionalComment}
                    onChangeText={setProfessionalComment}
                    placeholder="Deixe um comentário (opcional)"
                    placeholderTextColor="#888"
                    multiline
                    className="min-h-[70px] rounded-xl border border-borderPrimary bg-bgPrimary p-3 text-textFourth"
                  />
                </View>
              )}

              {canRateClinic && (
                <View className="mb-2 gap-2">
                  <Text className="text-base font-semibold text-textBlack">
                    {healthUnit?.name ?? "Clínica"}
                  </Text>
                  <StarRatingInput
                    value={clinicStars}
                    onChange={setClinicStars}
                  />
                  <TextInput
                    value={clinicComment}
                    onChangeText={setClinicComment}
                    placeholder="Deixe um comentário (opcional)"
                    placeholderTextColor="#888"
                    multiline
                    className="min-h-[70px] rounded-xl border border-borderPrimary bg-bgPrimary p-3 text-textFourth"
                  />
                </View>
              )}
            </ScrollView>
          )}

          {!hasNothingToRate && !isEligibilityLoading && (
            <View className="px-5 pb-5 pt-2">
              <Pressable
                accessibilityRole="button"
                disabled={!canSubmit || createRating.isPending}
                onPress={handleSubmit}
                className={`items-center rounded-xl py-3 ${
                  canSubmit && !createRating.isPending
                    ? "bg-bgSecondary"
                    : "bg-[#B9DEE3]"
                }`}
              >
                <Text className="font-bold text-textPrimary">
                  {createRating.isPending ? "Enviando..." : "Enviar avaliação"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
