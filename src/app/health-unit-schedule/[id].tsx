import { useGetUser } from "@/src/api/get-user-me";
import Header from "@/src/components/header/header";
import HealthUnitSchedule from "@/src/features/health-unit-schedule/health-unit-schedule";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HealthUnitSchedulePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: user } = useGetUser();

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Agendar Consulta" />
      {!user ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#008096" />
        </View>
      ) : (
        <HealthUnitSchedule user={user} healthUnitId={id} />
      )}
    </SafeAreaView>
  );
}
