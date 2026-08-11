import { useCreateAppointment } from "@/src/api/create-appointment";
import { useCreatePatient } from "@/src/api/create-patient";
import { GET_APPOINTMENTS_BY_PATIENT_ID_KEY } from "@/src/api/get-appointment-by-patient-id";
import { GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY } from "@/src/api/get-appointments-by-professional-id";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { GET_QUEUE_ITEMS_KEY } from "@/src/api/get-queue-item-by-patient-id";
import { GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY } from "@/src/api/get-queues-with-details-by-patient-id";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { EPatientPriority } from "@/src/config/entities/patients/patients.type";
import { IUser } from "@/src/config/entities/user/user.types";
import {
  formatBirthDate,
  formatCpf,
  formatPhone,
  getDateTimeFromDateAndTime,
  normalizeBirthDate,
} from "@/src/utils/util";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPatientRegistrationModal, setShowPatientRegistrationModal] =
    useState(false);

  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");

  const { data: patient, isLoading: isPatientLoading } = useGetPatientById(
    { userId: user._id },
    { enabled: Boolean(user._id), retry: false },
  );

  const { mutate: createAppointment, isPending: isCreatingAppointment } =
    useCreateAppointment();
  const { mutate: createPatient, isPending: isCreatingPatient } =
    useCreatePatient();

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

  const handlePatientRegistrationSubmit = () => {
    const normalizedBirthDate = normalizeBirthDate(birthDate);

    if (
      !user._id ||
      !cpf.trim() ||
      !normalizedBirthDate.trim() ||
      !phone.trim()
    ) {
      Toast.show({
        type: "error",
        text1: "Preencha todos os dados",
      });
      return;
    }

    createPatient(
      {
        userId: user._id,
        cpf: cpf.trim(),
        birthDate: normalizedBirthDate,
        phone: phone.trim(),
        priority: EPatientPriority.NORMAL,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["GET_PATIENT_BY_ID_KEY"],
          });
          setShowPatientRegistrationModal(false);
          setShowConfirmModal(true);
          Toast.show({
            type: "success",
            text1: "Cadastro concluído",
            text2: "Agora você pode confirmar o agendamento.",
          });
        },
        onError: (error: Error) => {
          Toast.show({
            type: "error",
            text1: "Não foi possível salvar seu cadastro",
            text2: error?.message || "Tente novamente em instantes.",
          });
        },
      },
    );
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
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Agendamento confirmado",
            text2: "Seu atendimento foi salvo com sucesso.",
          });
          queryClient.invalidateQueries({
            queryKey: [GET_APPOINTMENTS_BY_PATIENT_ID_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [GET_QUEUE_ITEMS_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY],
          });
          setShowConfirmModal(false);
        },
        onError: (error: Error) => {
          Toast.show({
            type: "error",
            text1: "Não foi possível salvar",
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
    cpf,
    setCpf: (value: string) => setCpf(formatCpf(value)),
    birthDate,
    setBirthDate: (value: string) => setBirthDate(formatBirthDate(value)),
    phone,
    setPhone: (value: string) => setPhone(formatPhone(value)),
    isCreatingAppointment,
    isCreatingPatient,
    handleConfirmPress,
    handlePatientRegistrationSubmit,
    handleCreateAppointment,
  };
}
