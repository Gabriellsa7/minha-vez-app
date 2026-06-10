import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import MainContent from "@/src/features/main-content/main-content";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { data: user } = useGetUser();

  const { data: patient } = useGetPatientById(
    { userId: user?._id || "" },
    {
      enabled: !!user?._id,
    },
  );

  //add a skeleton loading here, install the dependency react-native-skeleton-placeholder
  if (!user || !patient) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MainContent user={user} patient={patient} />
    </SafeAreaView>
  );
}
