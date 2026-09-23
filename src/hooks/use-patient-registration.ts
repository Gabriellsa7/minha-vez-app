import { useCreatePatient } from "@/src/api/create-patient";
import { EPatientPriority } from "@/src/config/entities/patients/patients.type";
import {
  formatBirthDate,
  formatCpf,
  formatPhone,
  normalizeBirthDate,
} from "@/src/utils/util";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface UsePatientRegistrationParams {
  userId?: string;
  onRegistered: () => void;
}

export function usePatientRegistration({
  userId,
  onRegistered,
}: UsePatientRegistrationParams) {
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [priority, setPriority] = useState<EPatientPriority>(
    EPatientPriority.NORMAL,
  );

  const { mutate: createPatient, isPending: isCreatingPatient } =
    useCreatePatient();

  const handlePatientRegistrationSubmit = () => {
    const normalizedBirthDate = normalizeBirthDate(birthDate);

    if (!userId || !cpf.trim() || !normalizedBirthDate.trim() || !phone.trim()) {
      Toast.show({ type: "error", text1: "Preencha todos os dados" });
      return;
    }

    createPatient(
      {
        userId,
        cpf: cpf.trim(),
        birthDate: normalizedBirthDate,
        phone: phone.trim(),
        priority,
      },
      {
        onSuccess: () => {
          onRegistered();
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

  return {
    cpf,
    setCpf: (value: string) => setCpf(formatCpf(value)),
    birthDate,
    setBirthDate: (value: string) => setBirthDate(formatBirthDate(value)),
    phone,
    setPhone: (value: string) => setPhone(formatPhone(value)),
    priority,
    setPriority,
    isCreatingPatient,
    handlePatientRegistrationSubmit,
  };
}
