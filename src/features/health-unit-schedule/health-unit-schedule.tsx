import { useGetAppointmentsByProfessionalId } from "@/src/api/get-appointments-by-professional-id";
import { useGetHealthProfessionals } from "@/src/api/get-health-professionals";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import {
  ALL_SPECIALTIES_OPTION,
  CategoriesSection,
} from "@/src/components/specialty-filter/specialty-filter";
import { EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IUser } from "@/src/config/entities/user/user.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { getDateKey } from "@/src/utils/util";
import { MapPin, CalendarDays } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import AppointmentConfirmModal from "../agenda-content/componentes/appointment-confirm-modal/appointment-confirm-modal";
import AvaliableDays from "../agenda-content/componentes/avaliable-days/avaliable-days";
import AvaliableTimes from "../agenda-content/componentes/avaliable-time/avaliable-time";
import HealthProfessionalsSection from "../agenda-content/componentes/health-professional/health-professional";
import PatientRegistrationModal from "../agenda-content/componentes/patient-registration-modal/patient-registration-modal";
import { useAppointmentBooking } from "../agenda-content/hooks/use-appointment-booking";

interface HealthUnitScheduleProps {
  user: IUser;
  healthUnitId: string;
}

export default function HealthUnitSchedule({
  user,
  healthUnitId,
}: HealthUnitScheduleProps) {
  const colors = useThemeColors();
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    ALL_SPECIALTIES_OPTION,
  );
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const { data: healthUnit, isLoading: isHealthUnitLoading } =
    useGetHealthUnitById({ healthUnitId });

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
        professional.healthUnitId === healthUnitId,
    );
  }, [healthProfessionals, healthUnitId]);

  const specialties = useMemo(() => {
    return Array.from(
      new Set(professionalsForUnit.map((professional) => professional.specialty)),
    ).sort();
  }, [professionalsForUnit]);

  const filteredProfessionals = useMemo(() => {
    if (selectedSpecialty === ALL_SPECIALTIES_OPTION) {
      return professionalsForUnit;
    }

    return professionalsForUnit.filter(
      (professional) => professional.specialty === selectedSpecialty,
    );
  }, [professionalsForUnit, selectedSpecialty]);

  const selectedProfessional = filteredProfessionals.find(
    (professional) => professional._id === selectedProfessionalId,
  );

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

  const booking = useAppointmentBooking({
    user,
    selectedProfessional,
    selectedUnitId: healthUnitId,
    selectedDate,
    selectedTime,
    setSelectedTime,
  });

  const isLoading =
    booking.isPatientLoading ||
    isHealthUnitLoading ||
    isHealthProfessionalsLoading;

  return (
    <View className="bg-bgPrimary flex-1 gap-4">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.textSecondary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 32,
          }}
        >
          <View className="px-5 pb-4">
            <View className="mb-5 flex-row items-center gap-3 rounded-[24px] border border-infoBorder bg-bgThird p-4 shadow-sm">
              <View className="rounded-xl bg-infoBg p-2">
                <MapPin size={20} color={colors.textSecondary} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-textBlack">
                  {healthUnit?.name}
                </Text>
                <Text className="text-sm text-textFourth">
                  {healthUnit?.address.street}, {healthUnit?.address.number} -{" "}
                  {healthUnit?.address.neighborhood}
                </Text>
              </View>
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

            <View className="mb-5">
              <CategoriesSection
                specialties={specialties}
                selected={selectedSpecialty}
                onSelect={(specialty) => {
                  setSelectedSpecialty(specialty);
                  setSelectedProfessionalId(null);
                  setSelectedTime("");
                }}
              />
            </View>

            <HealthProfessionalsSection
              professionalsForUnit={filteredProfessionals}
              selectedProfessionalId={selectedProfessionalId || ""}
              setSelectedProfessionalId={setSelectedProfessionalId}
              setSelectedTime={setSelectedTime}
              selectedUnit={healthUnit}
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
        selectedUnit={healthUnit}
        selectedProfessional={selectedProfessional}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onConfirm={booking.handleCreateAppointment}
        isConfirming={booking.isCreatingAppointment}
      />
    </View>
  );
}
