import {
  BLOOD_TYPE_LABEL,
  BLOOD_TYPE_OPTIONS,
} from "@/src/config/entities/patients/patients.constants";
import { EBloodType } from "@/src/config/entities/patients/patients.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Check } from "lucide-react-native";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface BloodTypePickerModalProps {
  visible: boolean;
  value?: EBloodType;
  onSelect: (value?: EBloodType) => void;
  onClose: () => void;
}

export function BloodTypePickerModal({
  visible,
  value,
  onSelect,
  onClose,
}: BloodTypePickerModalProps) {
  const colors = useThemeColors();

  const handleSelect = (option?: EBloodType) => {
    onSelect(option);
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-5"
        onPress={onClose}
      >
        <View className="w-full max-h-[70%] rounded-[24px] bg-bgThird p-5">
          <Text className="mb-3 text-lg font-semibold text-textBlack">
            Tipo sanguíneo
          </Text>
          <ScrollView>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected: !value }}
              onPress={() => handleSelect(undefined)}
              className="min-h-[48px] flex-row items-center justify-between py-3"
            >
              <Text className="text-textBlack">Não informado</Text>
              {!value && <Check size={18} color={colors.textSecondary} />}
            </Pressable>
            {BLOOD_TYPE_OPTIONS.map((option) => {
              const isSelected = option === value;

              return (
                <Pressable
                  key={option}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => handleSelect(option)}
                  className="min-h-[48px] flex-row items-center justify-between border-t border-borderPrimary py-3"
                >
                  <Text className="text-textBlack">
                    {BLOOD_TYPE_LABEL[option]}
                  </Text>
                  {isSelected && (
                    <Check size={18} color={colors.textSecondary} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}
