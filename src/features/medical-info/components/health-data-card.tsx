import { useUpdatePatient } from "@/src/api/update-patient";
import { BLOOD_TYPE_LABEL } from "@/src/config/entities/patients/patients.constants";
import {
  EBloodType,
  IPatient,
} from "@/src/config/entities/patients/patients.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { ChevronDown, Droplet } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { BloodTypePickerModal } from "./blood-type-picker-modal";

const FIELD_CLASS_NAME =
  "rounded-[16px] border border-infoBorder bg-infoBg px-3 py-3 text-textBlack";

interface HealthDataCardProps {
  patient: IPatient;
}

export function HealthDataCard({ patient }: HealthDataCardProps) {
  const colors = useThemeColors();

  const [bloodType, setBloodType] = useState<EBloodType | undefined>(
    patient.bloodType,
  );
  const [allergies, setAllergies] = useState(patient.allergies ?? "");
  const [medicalObservations, setMedicalObservations] = useState(
    patient.medicalObservations ?? "",
  );
  const [showBloodTypeOptions, setShowBloodTypeOptions] = useState(false);

  const { mutate: updatePatient, isPending: isSaving } = useUpdatePatient();

  const hasChanges =
    (bloodType ?? undefined) !== (patient.bloodType ?? undefined) ||
    allergies.trim() !== (patient.allergies ?? "") ||
    medicalObservations.trim() !== (patient.medicalObservations ?? "");

  const isSaveDisabled = isSaving || !hasChanges;

  const handleSave = () => {
    updatePatient(
      {
        patientId: patient._id,
        bloodType,
        allergies: allergies.trim(),
        medicalObservations: medicalObservations.trim(),
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Informações de saúde atualizadas",
          });
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Não foi possível salvar",
            text2: error?.message || "Tente novamente em instantes.",
          });
        },
      },
    );
  };

  return (
    <View className="gap-4 rounded-2xl bg-bgThird p-4">
      <View className="flex-row items-center gap-2">
        <Droplet size={18} color={colors.textSecondary} />
        <Text className="text-base font-bold text-textBlack">
          Dados de saúde
        </Text>
      </View>
      <Text className="text-xs text-textFourth">
        Esses dados são opcionais, mas podem ajudar no seu atendimento.
      </Text>

      <View>
        <Text className="mb-1 text-sm font-medium text-textFifth">
          Tipo sanguíneo
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Selecionar tipo sanguíneo"
          onPress={() => setShowBloodTypeOptions(true)}
          className="min-h-[48px] flex-row items-center justify-between rounded-[16px] border border-infoBorder bg-infoBg px-3 py-3"
        >
          <Text className="text-textBlack">
            {bloodType ? BLOOD_TYPE_LABEL[bloodType] : "Não informado"}
          </Text>
          <ChevronDown size={18} color={colors.textFourth} />
        </Pressable>
      </View>

      <View>
        <Text className="mb-1 text-sm font-medium text-textFifth">
          Alergias
        </Text>
        <TextInput
          value={allergies}
          onChangeText={setAllergies}
          placeholder="Ex: alergia a dipirona, amendoim..."
          placeholderTextColor={colors.textFourth}
          multiline
          numberOfLines={3}
          className={FIELD_CLASS_NAME}
          style={{ minHeight: 72, textAlignVertical: "top" }}
        />
      </View>

      <View>
        <Text className="mb-1 text-sm font-medium text-textFifth">
          Condições / observações médicas
        </Text>
        <TextInput
          value={medicalObservations}
          onChangeText={setMedicalObservations}
          placeholder="Ex: hipertensão, diabetes..."
          placeholderTextColor={colors.textFourth}
          multiline
          numberOfLines={3}
          className={FIELD_CLASS_NAME}
          style={{ minHeight: 72, textAlignVertical: "top" }}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleSave}
        disabled={isSaveDisabled}
        className={`min-h-[48px] justify-center rounded-[16px] p-3 ${
          isSaveDisabled ? "bg-highlightBorder" : "bg-bgSecondary"
        }`}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color={colors.textPrimary} />
        ) : (
          <Text className="text-center text-sm font-semibold text-textPrimary">
            Salvar dados de saúde
          </Text>
        )}
      </Pressable>

      <BloodTypePickerModal
        visible={showBloodTypeOptions}
        value={bloodType}
        onSelect={setBloodType}
        onClose={() => setShowBloodTypeOptions(false)}
      />
    </View>
  );
}
