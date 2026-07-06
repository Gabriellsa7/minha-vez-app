import { useCreateAppointment } from "@/src/api/create-appointment";
import { GET_APPOINTMENTS_BY_PATIENT_ID_KEY } from "@/src/api/get-appointment-by-patient-id";
import { useGetHealthProfessionals } from "@/src/api/get-health-professionals";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import Header from "@/src/components/header/header";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
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
    View,
} from "react-native";
import Toast from "react-native-toast-message";

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
  const [selectedTime, setSelectedTime] = useState<string>(AVAILABLE_TIMES[0]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data: patient, isLoading: isPatientLoading } = useGetPatientById(
    { userId: user._id },
    { enabled: Boolean(user._id) },
  );
  const { data: healthUnits, isLoading: isHealthUnitsLoading } =
    useGetHealthUnits();
  const { data: healthProfessionals, isLoading: isHealthProfessionalsLoading } =
    useGetHealthProfessionals();

  const { mutate: createAppointment, isPending: isCreatingAppointment } =
    useCreateAppointment();

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

  const handleConfirmPress = () => {
    if (!patient || !selectedProfessional || !selectedDate || !selectedTime) {
      Toast.show({
        type: "error",
        text1: "Preencha todos os campos",
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const handleCreateAppointment = () => {
    if (!patient || !selectedProfessional || !selectedDate || !selectedTime) {
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
                        onPress={() =>
                          setSelectedProfessionalId(professional._id)
                        }
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
                        onPress={() => setSelectedDate(day.value)}
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

                  return (
                    <Pressable
                      key={time}
                      onPress={() => setSelectedTime(time)}
                      className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${
                        isSelected
                          ? "border-[#008096] bg-[#008096]"
                          : "border-[#D7EEF2] bg-white"
                      }`}
                    >
                      <Clock3
                        size={16}
                        color={isSelected ? "#FFFFFF" : "#008096"}
                      />
                      <Text
                        className={`text-sm ${isSelected ? "text-white" : "text-[#0F172A]"}`}
                      >
                        {time}
                      </Text>
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
