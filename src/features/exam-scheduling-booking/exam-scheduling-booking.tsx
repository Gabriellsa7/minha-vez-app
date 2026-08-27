import { useGetExamAvailabilityRules } from "@/src/api/get-exam-availability-rules";
import { useGetExamOfferingById } from "@/src/api/get-exam-offering-by-id";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import { WeekDay } from "@/src/config/entities/health-unit/health-unit.types";
import AvaliableDays from "@/src/features/agenda-content/components/avaliable-days/avaliable-days";
import PatientRegistrationModal from "@/src/features/agenda-content/components/patient-registration-modal/patient-registration-modal";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { getDateKey } from "@/src/utils/util";
import { Clock, Droplet } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import ExamAvailableSlots from "./components/exam-available-slots/exam-available-slots";
import ExamBookingConfirmModal from "./components/exam-booking-confirm-modal/exam-booking-confirm-modal";
import { useExamBooking } from "./hooks/use-exam-booking";

// Rule.weekday strings line up with JS's Date#getDay() index (0=Sunday..6=Saturday)
// for any real device timezone Brazil falls in — see WEEKDAYS_BY_JS_INDEX on the backend.
const JS_WEEKDAY_INDEX: Record<WeekDay, number> = {
  [WeekDay.SUNDAY]: 0,
  [WeekDay.MONDAY]: 1,
  [WeekDay.TUESDAY]: 2,
  [WeekDay.WEDNESDAY]: 3,
  [WeekDay.THURSDAY]: 4,
  [WeekDay.FRIDAY]: 5,
  [WeekDay.SATURDAY]: 6,
};

interface ExamSchedulingBookingProps {
  healthUnitId: string;
  offeringId: string;
}

export function ExamSchedulingBooking({
  healthUnitId,
  offeringId,
}: ExamSchedulingBookingProps) {
  const colors = useThemeColors();
  const { data: user } = useGetUser();
  const { data: healthUnit } = useGetHealthUnitById({ healthUnitId });
  const { data: offering } = useGetExamOfferingById({ id: offeringId });
  const { data: availabilityRules } = useGetExamAvailabilityRules({
    healthUnitId,
  });

  const disabledWeekdays = useMemo(() => {
    // While rules are still loading, don't disable anything — better to
    // briefly allow every day than to flash "every day is closed".
    if (!availabilityRules) return new Set<number>();

    const activeWeekdays = new Set(
      availabilityRules
        .filter((rule) => rule.isActive)
        .map((rule) => JS_WEEKDAY_INDEX[rule.weekday]),
    );

    return new Set(
      [0, 1, 2, 3, 4, 5, 6].filter((weekday) => !activeWeekdays.has(weekday)),
    );
  }, [availabilityRules]);

  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date()),
  );
  const [selectedTime, setSelectedTime] = useState("");

  const {
    patient,
    showConfirmModal,
    setShowConfirmModal,
    showPatientRegistrationModal,
    setShowPatientRegistrationModal,
    cpf,
    setCpf,
    birthDate,
    setBirthDate,
    phone,
    setPhone,
    priority,
    setPriority,
    isCreatingBooking,
    isCreatingPatient,
    handleConfirmPress,
    handlePatientRegistrationSubmit,
    handleCreateBooking,
  } = useExamBooking({
    user: user!,
    healthUnitId,
    offering,
    selectedDate,
    selectedTime,
    setSelectedTime,
  });

  if (!user) return null;

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="bg-bgPrimary">
      <View className="gap-1 p-5">
        <View className="mb-4 rounded-2xl border border-borderPrimary bg-bgThird p-4">
          <Text className="text-lg font-bold text-textBlack">
            {offering?.name}
          </Text>
          <Text className="mt-1 text-sm text-textFifth">
            {healthUnit?.name}
          </Text>
          <View className="mt-3 flex-row flex-wrap items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Clock size={13} color={colors.textSecondary} />
              <Text className="text-xs text-textSecondary">
                {offering?.durationMinutes} min
              </Text>
            </View>
            {offering?.requiresFasting && (
              <View className="flex-row items-center gap-1">
                <Droplet size={13} color={colors.textSecondary} />
                <Text className="text-xs text-textSecondary">
                  Jejum
                  {offering.fastingHours ? ` de ${offering.fastingHours}h` : ""}
                </Text>
              </View>
            )}
          </View>
          {offering?.requiresPreparation &&
            offering.preparationInstructions && (
              <View className="mt-3 rounded-xl bg-warningBg p-3">
                <Text className="text-xs font-semibold text-warningText">
                  Preparo: {offering.preparationInstructions}
                </Text>
              </View>
            )}
        </View>

        <AvaliableDays
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedTime={setSelectedTime}
          disabledWeekdays={disabledWeekdays}
        />

        <ExamAvailableSlots
          healthUnitId={healthUnitId}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />

        <Pressable
          onPress={handleConfirmPress}
          disabled={!offering || !selectedDate || !selectedTime}
          className={`mb-8 rounded-[16px] px-4 py-3 ${
            offering && selectedDate && selectedTime
              ? "bg-bgSecondary"
              : "bg-infoBorder"
          }`}
        >
          <Text className="text-center text-sm font-semibold text-textPrimary">
            Continuar
          </Text>
        </Pressable>
      </View>

      <PatientRegistrationModal
        visible={showPatientRegistrationModal}
        onClose={() => setShowPatientRegistrationModal(false)}
        cpf={cpf}
        setCpf={setCpf}
        birthDate={birthDate}
        setBirthDate={setBirthDate}
        phone={phone}
        setPhone={setPhone}
        priority={priority}
        setPriority={setPriority}
        onSubmit={handlePatientRegistrationSubmit}
        isSubmitting={isCreatingPatient}
      />

      <ExamBookingConfirmModal
        visible={showConfirmModal && Boolean(patient)}
        onClose={() => setShowConfirmModal(false)}
        selectedUnit={healthUnit}
        offering={offering}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onConfirm={handleCreateBooking}
        isConfirming={isCreatingBooking}
      />
    </ScrollView>
  );
}
