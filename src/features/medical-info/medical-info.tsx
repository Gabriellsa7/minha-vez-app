import { useCurrentPatient } from "@/src/hooks/use-current-patient";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { HealthDataCard } from "./components/health-data-card";
import { MedicalDocumentsCard } from "./components/medical-documents-card";

export function MedicalInfo() {
  const colors = useThemeColors();
  const { patient, isLoading } = useCurrentPatient();

  if (isLoading || !patient) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.textSecondary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-bgPrimary"
        contentContainerStyle={{ padding: 24, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <HealthDataCard key={String(patient.updatedAt)} patient={patient} />
        <MedicalDocumentsCard
          patientId={patient._id}
          documents={patient.medicalDocuments}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
