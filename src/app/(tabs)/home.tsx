import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import MainContent from "@/src/features/main-content/main-content";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { data: user, isLoading: isUserLoading } = useGetUser();

  const { data: patient, isLoading: isPatientLoading } = useGetPatientById(
    { userId: user?._id || "" },
    {
      enabled: !!user?._id,
      retry: false,
    },
  );

  if (isUserLoading || (user?._id && isPatientLoading)) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Não foi possível carregar o usuário.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MainContent user={user} patient={patient ?? null} />
    </SafeAreaView>
  );
}
