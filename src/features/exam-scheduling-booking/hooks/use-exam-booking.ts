import { useCreateExamBooking } from "@/src/api/create-exam-booking";
import { useGetExamBookingsByPatientId } from "@/src/api/get-exam-bookings-by-patient-id";
import { EExamBookingStatus } from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { IExamOffering } from "@/src/config/entities/exam-offerings/exam-offerings.type";
import { IUser } from "@/src/config/entities/user/user.types";
import { getExamDateTimeFromDateAndTime } from "@/src/utils/exam-scheduling.util";
import { useCurrentPatient } from "@/src/hooks/use-current-patient";
import { usePatientRegistration } from "@/src/hooks/use-patient-registration";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface UseExamBookingParams {
  user: IUser;
  healthUnitId: string;
  offering?: IExamOffering;
  selectedDate: string;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

export function useExamBooking({
  user,
  healthUnitId,
  offering,
  selectedDate,
  selectedTime,
  setSelectedTime,
}: UseExamBookingParams) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPatientRegistrationModal, setShowPatientRegistrationModal] =
    useState(false);

  const { patient, patientQuery } = useCurrentPatient();
  const isPatientLoading = patientQuery.isLoading;

  const registration = usePatientRegistration({
    userId: user._id,
    onRegistered: () => {
      setShowPatientRegistrationModal(false);
      setShowConfirmModal(true);
    },
  });

  const { data: existingBookings } = useGetExamBookingsByPatientId(
    { patientId: patient?._id ?? "" },
    { enabled: Boolean(patient?._id) },
  );

  const { mutate: createExamBooking, isPending: isCreatingBooking } =
    useCreateExamBooking();

  const handleConfirmPress = () => {
    if (!offering || !selectedDate || !selectedTime) {
      Toast.show({ type: "error", text1: "Preencha todos os campos" });
      return;
    }

    if (!patient) {
      setShowPatientRegistrationModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const handleCreateBooking = () => {
    if (!patient || !offering || !selectedDate || !selectedTime) {
      Toast.show({
        type: "info",
        text1: "Cadastro pendente",
        text2: "Complete seu cadastro para agendar um exame.",
      });
      return;
    }

    const selectedDateTime = getExamDateTimeFromDateAndTime(
      selectedDate,
      selectedTime,
    );

    if (selectedDateTime.getTime() <= Date.now()) {
      Toast.show({
        type: "error",
        text1: "Horário indisponível",
        text2: "Escolha um horário futuro para agendar.",
      });
      setSelectedTime("");
      return;
    }

    const hasConflictWithAnotherBooking = (existingBookings ?? []).some(
      (booking) => {
        const isActive =
          booking.status === EExamBookingStatus.SCHEDULED ||
          booking.status === EExamBookingStatus.CONFIRMED;

        if (!isActive) return false;

        return (
          Math.abs(
            new Date(booking.scheduledAt).getTime() -
              selectedDateTime.getTime(),
          ) <
          2 * 60 * 60 * 1000
        );
      },
    );

    if (hasConflictWithAnotherBooking) {
      Toast.show({
        type: "error",
        text1: "Horário muito próximo de outro exame",
        text2:
          "Escolha um horário com pelo menos 2 horas de diferença dos seus outros exames marcados.",
      });
      return;
    }

    createExamBooking(
      {
        healthUnitId,
        examOfferingId: offering._id,
        scheduledAt: selectedDateTime.toISOString(),
        notes: "Agendamento realizado pelo app MinhaVez",
      },
      {
        onSuccess: (booking) => {
          Toast.show({
            type: "success",
            text1: "Exame agendado",
            text2: "Seu agendamento foi salvo com sucesso.",
          });
          setShowConfirmModal(false);
          router.replace({
            pathname: "/exam-scheduling/booking/[id]",
            params: { id: booking._id, fromBooking: "1" },
          });
        },
        onError: (error: Error) => {
          setShowConfirmModal(false);
          Toast.show({
            type: "error",
            text1: "Não foi possível agendar",
            text2: error?.message || "Tente novamente em instantes.",
          });
        },
      },
    );
  };

  return {
    patient,
    isPatientLoading,
    showConfirmModal,
    setShowConfirmModal,
    showPatientRegistrationModal,
    setShowPatientRegistrationModal,
    ...registration,
    isCreatingBooking,
    handleConfirmPress,
    handleCreateBooking,
  };
}
