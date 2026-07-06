import { useCreateAppointment } from "@/src/api/create-appointment";
import { useCreatePatient } from "@/src/api/create-patient";
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
import { EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";
import Header from "@/src/components/header/header";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { EPatientPriority } from "@/src/config/entities/patients/patients.type";
import { IUser } from "@/src/config/entities/user/user.types";
import { formatDateTime } from "@/src/utils/format-date-time";
import { useQueryClient } from "@tanstack/react-query";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Sparkles,
    Stethoscope,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

const formatCpf = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatBirthDate = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const normalizeBirthDate = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length !== 8) return value;

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  return `${year}-${month}-${day}`;
};

interface AgendaContentProps {
  user: IUser;
}

const AVAILABLE_TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export default function AgendaContent({ user }: AgendaContentProps) {
  const queryClient = useQueryClient();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPatientRegistrationModal, setShowPatientRegistrationModal] = useState(false);
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
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [selectedDate]);

  const nextDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");

      return {
        key: `${yyyy}-${mm}-${dd}`,
        label: date.toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "2-digit",
        }),
        value: `${yyyy}-${mm}-${dd}`,
      };
    });
  }, []);

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
    if (selectedTime && bookedTimes.has(selectedTime)) {
      setSelectedTime("");
    }
  }, [bookedTimes, selectedTime]);

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

    if (!user._id || !cpf.trim() || !normalizedBirthDate.trim() || !phone.trim()) {
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

  const handleCreateAppointment = () => {
    if (!patient || !selectedProfessional || !selectedDate || !selectedTime) {
      Toast.show({
        type: "info",
        text1: "Cadastro pendente",
        text2: "Complete seu cadastro para agendar uma consulta.",
      });
      return;
    }

    const [year, month, day] = selectedDate.split("-").map(Number);
    const [hour, minute] = selectedTime.split(":").map(Number);
    const selectedDateTime = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
    ).toISOString();

    createAppointment(
      {
        patientId: patient._id,
        professionalId: selectedProfessional._id,
        healthUnitId: selectedUnitId ?? selectedProfessional.healthUnitId,
        dateTime: selectedDateTime,
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
  };

  const isLoading =
    isPatientLoading || isHealthUnitsLoading || isHealthProfessionalsLoading;

  return (
    <View className="flex-1 bg-[#F4FBFC]">
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
                  Seu cadastro ainda não foi concluído. Você pode continuar navegando no app, mas precisa finalizar o cadastro para agendar.
                </Text>
              </View>
            )}

            <View className="mb-5">
              <Text className="mb-3 text-base font-semibold text-[#0F172A]">
                Unidade de saúde
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {healthUnits?.map((unit) => {
                  const isActive = selectedUnitId === unit._id;

                  return (
                    <Pressable
                      key={unit._id}
                      onPress={() => {
                        setSelectedUnitId(unit._id);
                        setSelectedProfessionalId(null);
                        setSelectedTime("");
                      }}
                      className={`rounded-full border px-4 py-2 ${
                        isActive
                          ? "border-[#008096] bg-[#008096]"
                          : "border-[#D7EEF2] bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm ${isActive ? "text-white" : "text-[#0F172A]"}`}
                      >
                        {unit.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="mb-5">
              <Text className="mb-3 text-base font-semibold text-[#0F172A]">
                Profissionais disponíveis
              </Text>
              {professionalsForUnit.length === 0 ? (
                <View className="rounded-[20px] border border-dashed border-[#D7EEF2] bg-white p-4">
                  <Text className="text-sm text-[#64748B]">
                    Não há profissionais disponíveis para essa unidade ainda.
                  </Text>
                </View>
              ) : (
                <View className="gap-3">
                  {professionalsForUnit.map((professional) => {
                    const isSelected =
                      selectedProfessionalId === professional._id;

                    return (
                      <Pressable
                        key={professional._id}
                        onPress={() => {
                          setSelectedProfessionalId(professional._id);
                          setSelectedTime("");
                        }}
                        className={`rounded-[20px] border p-4 ${
                          isSelected
                            ? "border-[#008096] bg-[#E8F8FA]"
                            : "border-[#E2E8F0] bg-white"
                        }`}
                      >
                        <View className="flex-row items-center gap-3">
                          <View className="rounded-full bg-[#008096]/10 p-3">
                            <Stethoscope size={18} color="#008096" />
                          </View>
                          <View className="flex-1">
                            <Text className="text-base font-semibold text-[#0F172A]">
                              {professional.specialty}
                            </Text>
                            <Text className="text-sm text-[#64748B]">
                              {selectedUnit?.name || "Unidade selecionada"}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            <View className="mb-5">
              <Text className="mb-3 text-base font-semibold text-[#0F172A]">
                Escolha o dia
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {nextDays.map((day) => {
                    const isSelected = selectedDate === day.value;

                    return (
                      <Pressable
                        key={day.key}
                        onPress={() => {
                          setSelectedDate(day.value);
                          setSelectedTime("");
                        }}
                        className={`rounded-[16px] border px-3 py-3 ${
                          isSelected
                            ? "border-[#008096] bg-[#008096]"
                            : "border-[#D7EEF2] bg-white"
                        }`}
                      >
                        <Text
                          className={`text-center text-xs ${isSelected ? "text-white" : "text-[#0F172A]"}`}
                        >
                          {day.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            <View className="mb-5">
              <Text className="mb-3 text-base font-semibold text-[#0F172A]">
                Horários disponíveis
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {AVAILABLE_TIMES.map((time) => {
                  const isSelected = selectedTime === time;
                  const isBooked = bookedTimes.has(time);

                  return (
                    <Pressable
                      key={time}
                      onPress={() => setSelectedTime(time)}
                      disabled={isBooked || isProfessionalAppointmentsLoading}
                      className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${
                        isBooked || isProfessionalAppointmentsLoading
                          ? "border-[#E2E8F0] bg-[#F1F5F9] opacity-60"
                          : isSelected
                          ? "border-[#008096] bg-[#008096]"
                          : "border-[#D7EEF2] bg-white"
                      }`}
                    >
                      <Clock3
                        size={16}
                        color={
                          isBooked || isProfessionalAppointmentsLoading
                            ? "#94A3B8"
                            : isSelected
                              ? "#FFFFFF"
                              : "#008096"
                        }
                      />
                      <Text
                        className={`text-sm ${
                          isBooked || isProfessionalAppointmentsLoading
                            ? "text-[#94A3B8]"
                            : isSelected
                              ? "text-white"
                              : "text-[#0F172A]"
                        }`}
                      >
                        {time}
                      </Text>
                      {isBooked && (
                        <Text className="text-xs font-medium text-[#94A3B8]">
                          Ocupado
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>

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
                Precisamos de alguns dados para criar seu perfil de paciente e concluir o agendamento.
              </Text>
            </View>

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
                  onChangeText={(value) => setBirthDate(formatBirthDate(value))}
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
