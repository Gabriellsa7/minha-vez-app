import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetPrescriptionsByPatientId } from "@/src/api/get-prescriptions-by-patient-id";
import { useGetUser } from "@/src/api/get-user-me";
import Header from "@/src/components/header/header";
import { HistorySkeleton } from "@/src/components/skeletons/history-skeleton";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { ClipboardList } from "lucide-react-native";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrescriptionCard } from "./components/prescription-card/prescription-card";

export default function PrescriptionsScreen() {
  const colors = useThemeColors();

  const { data: user } = useGetUser();
  const { data: patient } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );

  const {
    data: prescriptions,
    isLoading,
    isError,
    refetch,
  } = useGetPrescriptionsByPatientId(
    { patientId: patient?._id ?? "" },
    { enabled: Boolean(patient?._id) },
  );

  const isLoadingPrescriptions = isLoading && Boolean(patient?._id);

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Minhas Receitas" />

      <View className="flex-1 px-4 pt-4">
        {isLoadingPrescriptions ? (
          <HistorySkeleton />
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-3">
            <Text className="text-center text-textFifth">
              Não foi possível carregar suas receitas.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => refetch()}
              className="flex-row items-center gap-2 rounded-lg bg-bgSecondary px-4 py-3"
            >
              <Text className="font-bold text-textPrimary">
                Tentar novamente
              </Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={prescriptions ?? []}
            keyExtractor={(prescription) => prescription._id}
            renderItem={({ item: prescription }) => (
              <PrescriptionCard prescription={prescription} />
            )}
            ListEmptyComponent={
              <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
                <ClipboardList size={28} color={colors.tabActive} />
                <Text className="mt-3 text-center text-textFifth">
                  Você ainda não possui receitas registradas.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
