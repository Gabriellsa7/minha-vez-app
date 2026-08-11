import {
  Baby,
  Bone,
  Brain,
  Eye,
  Heart,
  LayoutGrid,
  Stethoscope,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

const SPECIALTY_ICONS: Record<string, typeof Stethoscope> = {
  Cardiologia: Heart,
  Pediatria: Baby,
  Ortopedia: Bone,
  Neurologia: Brain,
  Oftalmologia: Eye,
};

export const ALL_SPECIALTIES_OPTION = "Todos";

interface CategoriesSectionProps {
  specialties: string[];
  selected: string;
  onSelect: (specialty: string) => void;
}

export function CategoriesSection({
  specialties,
  selected,
  onSelect,
}: CategoriesSectionProps) {
  const options = [ALL_SPECIALTIES_OPTION, ...specialties];

  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-textBlack">Especialidades</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        {options.map((specialty) => {
          const isActive = specialty === selected;
          const Icon =
            specialty === ALL_SPECIALTIES_OPTION
              ? LayoutGrid
              : SPECIALTY_ICONS[specialty] || Stethoscope;

          return (
            <Pressable
              key={specialty}
              onPress={() => onSelect(specialty)}
              className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${
                isActive
                  ? "border-[#008096] bg-[#008096]"
                  : "border-[#D7EEF2] bg-white"
              }`}
            >
              <Icon size={16} color={isActive ? "#FFFFFF" : "#008096"} />
              <Text
                className={`text-sm font-medium ${
                  isActive ? "text-white" : "text-textBlack"
                }`}
              >
                {specialty}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
