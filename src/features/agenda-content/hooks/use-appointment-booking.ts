import { useCreateAppointment } from "@/src/api/create-appointment";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IUser } from "@/src/config/entities/user/user.types";
import { getDateTimeFromDateAndTime } from "@/src/utils/util";
import { useCurrentPatient } from "@/src/hooks/use-current-patient";
import { usePatientRegistration } from "@/src/hooks/use-patient-registration";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface UseAppointmentBookingParams {
  user: IUser;
  selectedProfessional?: IHealthProfessional;
  selectedUnitId?: string | null;
  selectedDate: string;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

export function useAppointmentBooking({
  user,
  selectedProfessional,
  selectedUnitId,
  selectedDate,
  selectedTime,
  setSelectedTime,
}: UseAppointmentBookingParams) {
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

  const { mutate: createAppointment, isPending: isCreatingAppointment } =
    useCreateAppointment();

  const handleConfirmPress = () => {
    if (!selectedProfessional || !selectedDate || !selectedTime) {
      Toast.show({
        type: "error",
        text1: "Preencha todos os campos",
      });
      return;
    }

    if (!patient) {
      setShowPatientRegistrationModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const handleCreateAppointment = () => {
    if (!patient || !selectedProfessional || !selectedDate || !selectedTime) {
      Toast.show({
        type: "info",
        text1: "Cadastro pendente",
        text2: "Complete seu cadastro para agendar uma consulta.",
      });
      return;
    }

    const selectedDateTime = getDateTimeFromDateAndTime(
      selectedDate,
      selectedTime,
    );

    if (selectedDateTime <= new Date()) {
      Toast.show({
        type: "error",
        text1: "Horário indisponível",
        text2: "Escolha um horário futuro para agendar.",
      });
      setSelectedTime("");
      return;
    }

    createAppointment(
      {
        patientId: patient._id,
        professionalId: selectedProfessional._id,
        healthUnitId: selectedUnitId ?? selectedProfessional.healthUnitId,
        dateTime: selectedDateTime.toISOString(),
        notes: "Agendamento realizado pelo app MinhaVez",
      },
      {
        onSuccess: (appointment) => {
          Toast.show({
            type: "success",
            text1: "Agendamento confirmado",
            text2: "Seu atendimento foi salvo com sucesso.",
          });
          setShowConfirmModal(false);
          router.replace({
            pathname: "/appointment-confirmation/[id]",
            params: { id: appointment._id, dateTime: appointment.dateTime },
          });
        },
        onError: (error: Error) => {
          setShowConfirmModal(false);
          Toast.show({
            type: "error",
            text1: "Não foi possível salvar",
            text2:
              error?.message ||
              "Você não pode marcar mais de uma consulta no mesmo dia.",
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
    isCreatingAppointment,
    handleConfirmPress,
    handleCreateAppointment,
  };
}
