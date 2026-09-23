import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { MapPin, Phone, Stethoscope } from "lucide-react-native";
import { Text, View } from "react-native";

export function ProfessionalCard({
  professional,
}: {
  professional: IHealthProfessional;
}) {
  const colors = useThemeColors();

  return (
    <View className="gap-2 rounded-2xl border border-borderPrimary bg-bgThird p-4">
      <View className="flex-row items-center gap-2">
        <Stethoscope size={16} color={colors.textSecondary} />
        <Text className="text-sm font-semibold text-textBlack">
          Profissional
        </Text>
      </View>
      <Text className="text-base font-semibold text-textBlack">
        {professional.name}
      </Text>
      <Text className="text-sm text-textFifth">
        {professional.specialty}
        {professional.room ? ` · Sala ${professional.room}` : ""}
      </Text>
    </View>
  );
}

export function HealthUnitAddressCard({
  healthUnit,
}: {
  healthUnit: IHealthUnit;
}) {
  const colors = useThemeColors();
  const { address } = healthUnit;

  return (
    <View className="gap-2 rounded-2xl border border-borderPrimary bg-bgThird p-4">
      <View className="flex-row items-center gap-2">
        <MapPin size={16} color={colors.textSecondary} />
        <Text className="text-sm font-semibold text-textBlack">
          {healthUnit.name}
        </Text>
      </View>
      <Text className="text-sm text-textFifth">
        {address.street}, {address.number}
        {address.complement ? ` - ${address.complement}` : ""}
        {"\n"}
        {address.neighborhood} · {address.city}/{address.state}
      </Text>
      {healthUnit.phone && (
        <View className="mt-1 flex-row items-center gap-2">
          <Phone size={14} color={colors.textFourth} />
          <Text className="text-xs text-textFourth">{healthUnit.phone}</Text>
        </View>
      )}
    </View>
  );
}
