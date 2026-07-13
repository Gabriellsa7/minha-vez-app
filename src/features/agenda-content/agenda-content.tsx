import { useCreateAppointment } from "@/src/api/create-appointment";
import { useCreatePatient } from "@/src/api/create-patient";
import { useCreateQueue } from "@/src/api/create-queue";
import { GET_APPOINTMENTS_BY_PATIENT_ID_KEY } from "@/src/api/get-appointment-by-patient-id";
import {
    GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY,
    useGetAppointmentsByProfessionalId,
} from "@/src/api/get-appointments-by-professional-id";
import { useGetHealthProfessionals } from "@/src/api/get-health-professionals";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { GET_QUEUE_ITEMS_KEY } from "@/src/api/get-queue-item-by-patient-id";
import { GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY } from "@/src/api/get-queues-with-details-by-patient-id";
import Header from "@/src/components/header/header";
import { EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { EPatientPriority } from "@/src/config/entities/patients/patients.type";
import { IUser } from "@/src/config/entities/user/user.types";
import { formatDateTime } from "@/src/utils/format-date-time";
import {
    formatBirthDate,
    formatCpf,
    formatPhone,
    getDateKey,
    getDateTimeFromDateAndTime,
    normalizeBirthDate,
} from "@/src/utils/util";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, Sparkles } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import AvaliableDays from "./componentes/avaliable-days/avaliable-days";
import AvaliableTimes from "./componentes/avaliable-time/avaliable-time";
import HealthProfessionalsSection from "./componentes/health-professional/health-professional";
import HealthUnitsSection from "./componentes/health-units-section/healt-units-section";

interface AgendaContentProps {
  user: IUser;
}

export default function AgendaContent({ user }: AgendaContentProps) {
  const queryClient = useQueryClient();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [selectedTime, setSelectedTime] = useState<string>("");

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

  const { data: healthUnits, isLoading: isHealthUnitsLoading } =
    useGetHealthUnits();

  const { data: healthProfessionals, isLoading: isHealthProfessionalsLoading } =
    useGetHealthProfessionals();

  const {
    data: professionalAppointments,
    isLoading: isProfessionalAppointmentsLoading,
  } = useGetAppointmentsByProfessionalId(
    { professionalId: selectedProfessionalId ?? "" },
    { enabled: Boolean(selectedProfessionalId) },
  );

  const { mutate: createAppointment, isPending: isCreatingAppointment } =
    useCreateAppointment();
  const { mutate: createPatient, isPending: isCreatingPatient } =
    useCreatePatient();

  useEffect(() => {
    if (healthUnits?.length && !selectedUnitId) {
      setSelectedUnitId(healthUnits[0]._id);
    }
  }, [healthUnits, selectedUnitId]);

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(getDateKey(new Date()));
    }
  }, [selectedDate]);

  const professionalsForUnit = useMemo(() => {
    if (!healthProfessionals) {
      return [];
    }

    return healthProfessionals.filter(
      (professional: IHealthProfessional) =>
        !selectedUnitId || professional.healthUnitId === selectedUnitId,
    );
  }, [healthProfessionals, selectedUnitId]);

  const selectedProfessional = professionalsForUnit.find(
    (professional) => professional._id === selectedProfessionalId,
  );

  const selectedUnit = healthUnits?.find((unit) => unit._id === selectedUnitId);

  const bookedTimes = useMemo(() => {
    if (!professionalAppointments || !selectedDate) {
      return new Set<string>();
    }

    return professionalAppointments.reduce((times, appointment) => {
      if (
        appointment.status === EAppointmentStatus.COMPLETED ||
        appointment.status === EAppointmentStatus.CANCELED
      ) {
        return times;
      }

      const appointmentDate = new Date(appointment.dateTime);
      const yyyy = appointmentDate.getFullYear();
      const mm = String(appointmentDate.getMonth() + 1).padStart(2, "0");
      const dd = String(appointmentDate.getDate()).padStart(2, "0");
      const dateKey = `${yyyy}-${mm}-${dd}`;

      if (dateKey === selectedDate) {
        const hour = String(appointmentDate.getHours()).padStart(2, "0");
        const minute = String(appointmentDate.getMinutes()).padStart(2, "0");
        times.add(`${hour}:${minute}`);
      }

      return times;
    }, new Set<string>());
  }, [professionalAppointments, selectedDate]);

  useEffect(() => {
    if (!selectedTime || !selectedDate) {
      return;
    }

    const selectedDateTime = getDateTimeFromDateAndTime(
      selectedDate,
      selectedTime,
    );

    if (bookedTimes.has(selectedTime) || selectedDateTime <= new Date()) {
      setSelectedTime("");
    }
  }, [bookedTimes, selectedDate, selectedTime]);

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
        onSuccess: (createdPatient) => {
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
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Não foi possível salvar seu cadastro",
            text2: error?.message || "Tente novamente em instantes.",
          });
        },
      },
    );
  };

  const { mutate: createQueue } = useCreateQueue();

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
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Não foi possível salvar",
            text2: error?.message || "Tente novamente em instantes.",
          });
        },
      },
    );
    createQueue(
      {
        professionalId: selectedProfessional._id,
        healthUnitId: selectedUnitId ?? selectedProfessional.healthUnitId,
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Agendamento confirmado",
            text2: "Seu atendimento foi salvo com sucesso.",
          });
          setShowConfirmModal(false);
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: "Não foi possível salvar",
            text2: error?.message || "Tente novamente em instantes.",
          });
        },
      },
    );
  };

  const isLoading =
    isPatientLoading || isHealthUnitsLoading || isHealthProfessionalsLoading;

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      <Header text="Agendar" user={user} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#008096" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
          <View className="px-5 pb-4">
            <View className="mb-5 rounded-[24px] border border-[#D7EEF2] bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center gap-2">
                <Sparkles size={18} color="#008096" />
                <Text className="text-base font-semibold text-[#0F172A]">
                  Agende sua consulta em poucos passos
                </Text>
              </View>
              <Text className="text-sm text-[#64748B]">
                Selecione uma unidade, o profissional, o dia e o horário ideal
                para você.
              </Text>
            </View>

            {!patient && !isPatientLoading && (
              <View className="mb-5 rounded-[20px] border border-[#FDE68A] bg-[#FEF3C7] p-4">
                <Text className="text-sm font-medium text-[#92400E]">
                  Seu cadastro ainda não foi concluído. Você pode continuar
                  navegando no app, mas precisa finalizar o cadastro para
                  agendar.
                </Text>
              </View>
            )}

            <HealthUnitsSection
              healthUnits={healthUnits}
              selectedUnitId={selectedUnitId ?? ""}
              setSelectedUnitId={setSelectedUnitId}
              setSelectedProfessionalId={setSelectedProfessionalId}
              setSelectedTime={setSelectedTime}
            />

            <HealthProfessionalsSection
              professionalsForUnit={professionalsForUnit}
              selectedProfessionalId={selectedProfessionalId || ""}
              setSelectedProfessionalId={setSelectedProfessionalId}
              setSelectedTime={setSelectedTime}
              selectedUnit={selectedUnit}
            />

            <AvaliableDays
              selectedDate={selectedDate}
              setSelectedTime={setSelectedTime}
              setSelectedDate={setSelectedDate}
            />

            <AvaliableTimes
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              bookedTimes={bookedTimes}
              isProfessionalAppointmentsLoading={
                isProfessionalAppointmentsLoading
              }
            />

            <Pressable
              onPress={handleConfirmPress}
              className={`rounded-[20px] p-4 ${
                selectedProfessional && selectedDate && selectedTime
                  ? "bg-[#008096]"
                  : "bg-[#CBD5E1]"
              }`}
              disabled={!selectedProfessional || !selectedDate || !selectedTime}
            >
              <View className="flex-row items-center justify-center gap-2">
                <CalendarDays size={18} color="#FFFFFF" />
                <Text className="text-base font-semibold text-white">
                  Confirmar agendamento
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={showPatientRegistrationModal}
        onRequestClose={() => setShowPatientRegistrationModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-5">
          <View className="w-full rounded-[24px] bg-white p-5">
            <View className="mb-4">
              <Text className="text-lg font-semibold text-[#0F172A]">
                Complete seu cadastro
              </Text>
              <Text className="mt-1 text-sm text-[#64748B]">
                Precisamos de alguns dados para criar seu perfil de paciente e
                concluir o agendamento.
              </Text>
            </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="gap-3">
                <View>
                  <Text className="mb-1 text-sm font-medium text-[#0F172A]">
                    CPF
                  </Text>
                  <TextInput
                    value={cpf}
                    onChangeText={(value) => setCpf(formatCpf(value))}
                    placeholder="000.000.000-00"
                    keyboardType="numeric"
                    className="rounded-[16px] border border-[#D7EEF2] bg-[#F4FBFC] px-3 py-3"
                  />
                </View>

                <View>
                  <Text className="mb-1 text-sm font-medium text-[#0F172A]">
                    Data de nascimento
                  </Text>
                  <TextInput
                    value={birthDate}
                    onChangeText={(value) =>
                      setBirthDate(formatBirthDate(value))
                    }
                    placeholder="DD/MM/YYYY"
                    keyboardType="numeric"
                    className="rounded-[16px] border border-[#D7EEF2] bg-[#F4FBFC] px-3 py-3"
                  />
                </View>

                <View>
                  <Text className="mb-1 text-sm font-medium text-[#0F172A]">
                    Telefone
                  </Text>
                  <TextInput
                    value={phone}
                    onChangeText={(value) => setPhone(formatPhone(value))}
                    placeholder="(11) 99999-9999"
                    keyboardType="numeric"
                    className="rounded-[16px] border border-[#D7EEF2] bg-[#F4FBFC] px-3 py-3"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <View className="mt-5 flex-row gap-3">
              <Pressable
                onPress={() => setShowPatientRegistrationModal(false)}
                className="flex-1 rounded-[16px] border border-[#CBD5E1] bg-white px-4 py-3"
              >
                <Text className="text-center text-sm font-semibold text-[#0F172A]">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={handlePatientRegistrationSubmit}
                disabled={isCreatingPatient}
                className={`flex-1 rounded-[16px] px-4 py-3 ${
                  isCreatingPatient ? "bg-[#67B5C0]" : "bg-[#008096]"
                }`}
              >
                {isCreatingPatient ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-center text-sm font-semibold text-white">
                    Salvar e continuar
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-5">
          <View className="w-full rounded-[24px] bg-white p-5">
            <View className="mb-4 flex-row items-center gap-2">
              <CheckCircle2 size={22} color="#008096" />
              <Text className="text-lg font-semibold text-[#0F172A]">
                Resumo do agendamento
              </Text>
            </View>

            <View className="gap-3">
              <View className="rounded-[16px] bg-[#F4FBFC] p-3">
                <Text className="text-sm text-[#64748B]">Unidade</Text>
                <Text className="text-base font-semibold text-[#0F172A]">
                  {selectedUnit?.name || "Selecionada"}
                </Text>
              </View>
              <View className="rounded-[16px] bg-[#F4FBFC] p-3">
                <Text className="text-sm text-[#64748B]">Profissional</Text>
                <Text className="text-base font-semibold text-[#0F172A]">
                  {selectedProfessional?.specialty || "Selecione"}
                </Text>
              </View>
              <View className="rounded-[16px] bg-[#F4FBFC] p-3">
                <Text className="text-sm text-[#64748B]">Data e horário</Text>
                <Text className="text-base font-semibold text-[#0F172A]">
                  {selectedDate && selectedTime
                    ? formatDateTime(`${selectedDate}T${selectedTime}:00`)
                    : "Selecione uma data e horário"}
                </Text>
              </View>
            </View>

            <View className="mt-5 flex-row gap-3">
              <Pressable
                onPress={() => setShowConfirmModal(false)}
                className="flex-1 rounded-[16px] border border-[#CBD5E1] bg-white px-4 py-3"
              >
                <Text className="text-center text-sm font-semibold text-[#0F172A]">
                  Cancelar
                </Text>
              </Pressable>
              {/* When selected all options and press the button create appointment 
              add a logic to open a queue at the same time.*/}
              <Pressable
                onPress={handleCreateAppointment}
                disabled={isCreatingAppointment}
                className={`flex-1 rounded-[16px] px-4 py-3 ${
                  isCreatingAppointment ? "bg-[#67B5C0]" : "bg-[#008096]"
                }`}
              >
                {isCreatingAppointment ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-center text-sm font-semibold text-white">
                    Confirmar
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
