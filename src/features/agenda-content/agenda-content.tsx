import { useGetAppointmentsByProfessionalId } from "@/src/api/get-appointments-by-professional-id";
import { useGetHealthProfessionals } from "@/src/api/get-health-professionals";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import Header from "@/src/components/header/header";
import { AgendaSkeleton } from "@/src/components/skeletons/agenda-skeleton";
import { EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IUser } from "@/src/config/entities/user/user.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { getDateKey, getDateTimeFromDateAndTime } from "@/src/utils/util";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLocalSearchParams } from "expo-router";
import { CalendarDays, Sparkles } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import AppointmentConfirmModal from "./componentes/appointment-confirm-modal/appointment-confirm-modal";
import AvaliableDays from "./componentes/avaliable-days/avaliable-days";
import AvaliableTimes from "./componentes/avaliable-time/avaliable-time";
import HealthProfessionalsSection from "./componentes/health-professional/health-professional";
import HealthUnitsSection from "./componentes/health-units-section/healt-units-section";
import PatientRegistrationModal from "./componentes/patient-registration-modal/patient-registration-modal";
import { useAppointmentBooking } from "./hooks/use-appointment-booking";

interface AgendaContentProps {
  user: IUser;
}

export default function AgendaContent({ user }: AgendaContentProps) {
  const colors = useThemeColors();
  const params = useLocalSearchParams<{
    professionalId?: string;
    unitId?: string;
  }>();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(
    params.unitId ?? null,
  );
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    string | null
  >(params.professionalId ?? null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [selectedTime, setSelectedTime] = useState<string>("");

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

  useEffect(() => {
    if (params.unitId) {
      setSelectedUnitId(params.unitId);
    }
    if (params.professionalId) {
      setSelectedProfessionalId(params.professionalId);
    }
  }, [params.unitId, params.professionalId]);

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

  const booking = useAppointmentBooking({
    user,
    selectedProfessional,
    selectedUnitId,
    selectedDate,
    selectedTime,
    setSelectedTime,
  });

  const tabBarHeight = useBottomTabBarHeight();

  const isLoading =
    booking.isPatientLoading ||
    isHealthUnitsLoading ||
    isHealthProfessionalsLoading;

  return (
    <View className="bg-bgPrimary flex-1 gap-4">
      <Header text="Agendar" />

      {isLoading ? (
        <AgendaSkeleton />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: tabBarHeight + 8,
          }}
        >
          <View className="px-5 pb-4">
            <View className="mb-5 rounded-[24px] border border-infoBorder bg-bgThird p-4 shadow-sm">
              <View className="mb-3 flex-row items-center gap-2">
                <Sparkles size={18} color={colors.textSecondary} />
                <Text className="text-base font-semibold text-textBlack">
                  Agende sua consulta em poucos passos
                </Text>
              </View>
              <Text className="text-sm text-textFourth">
                Selecione uma unidade, o profissional, o dia e o horário ideal
                para você.
              </Text>
            </View>

            {!booking.patient && !booking.isPatientLoading && (
              <View className="mb-5 rounded-[20px] border border-warningBorder bg-warningBg p-4">
                <Text className="text-sm font-medium text-warningText">
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

            {selectedProfessional && (
              <AvaliableTimes
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                bookedTimes={bookedTimes}
                isProfessionalAppointmentsLoading={
                  isProfessionalAppointmentsLoading
                }
                professional={selectedProfessional}
              />
            )}

            <Pressable
              onPress={booking.handleConfirmPress}
              className={`rounded-[20px] p-4 ${
                selectedProfessional && selectedDate && selectedTime
                  ? "bg-bgSecondary"
                  : "bg-borderPrimary"
              }`}
              disabled={!selectedProfessional || !selectedDate || !selectedTime}
            >
              <View className="flex-row items-center justify-center gap-2">
                <CalendarDays size={18} color={colors.textPrimary} />
                <Text className="text-base font-semibold text-textPrimary">
                  Confirmar agendamento
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      )}

      <PatientRegistrationModal
        visible={booking.showPatientRegistrationModal}
        onClose={() => booking.setShowPatientRegistrationModal(false)}
        cpf={booking.cpf}
        setCpf={booking.setCpf}
        birthDate={booking.birthDate}
        setBirthDate={booking.setBirthDate}
        phone={booking.phone}
        setPhone={booking.setPhone}
        onSubmit={booking.handlePatientRegistrationSubmit}
        isSubmitting={booking.isCreatingPatient}
      />

      <AppointmentConfirmModal
        visible={booking.showConfirmModal}
        onClose={() => booking.setShowConfirmModal(false)}
        selectedUnit={selectedUnit}
        selectedProfessional={selectedProfessional}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onConfirm={booking.handleCreateAppointment}
        isConfirming={booking.isCreatingAppointment}
      />
    </View>
  );
}
