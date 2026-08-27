import { useGetExamBookingsByPatientIdInfinite } from "@/src/api/get-exam-bookings-by-patient-id";
import { useGetExamsByPatientIdInfinite } from "@/src/api/get-exams-by-patient-id";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import Header from "@/src/components/header/header";
import { HistorySkeleton } from "@/src/components/skeletons/history-skeleton";
import { flattenPaginatedPages } from "@/src/helpers/react-query/pagination";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { router } from "expo-router";
import { CalendarClock, CalendarPlus, FileText } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExamBookingCard } from "./components/exam-booking-card/exam-booking-card";
import ExamResultCard from "./components/exam-result-card/exam-result-card";

type ExamsTab = "scheduled" | "results";

export default function ExamsScreen() {
  const colors = useThemeColors();
  const [tab, setTab] = useState<ExamsTab>("scheduled");

  const { data: user } = useGetUser();
  const { data: patient } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );

  const {
    data: examsPages,
    isLoading: isExamsLoading,
    isError: isExamsError,
    refetch: refetchExams,
    fetchNextPage: fetchNextExamsPage,
    hasNextPage: hasNextExamsPage,
    isFetchingNextPage: isFetchingNextExamsPage,
  } = useGetExamsByPatientIdInfinite(
    { patientId: patient?._id ?? "" },
    { enabled: Boolean(patient?._id) },
  );

  const {
    data: bookingsPages,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
    refetch: refetchBookings,
    fetchNextPage: fetchNextBookingsPage,
    hasNextPage: hasNextBookingsPage,
    isFetchingNextPage: isFetchingNextBookingsPage,
  } = useGetExamBookingsByPatientIdInfinite(
    { patientId: patient?._id ?? "" },
    { enabled: Boolean(patient?._id) },
  );

  const exams = flattenPaginatedPages(examsPages);
  const bookings = flattenPaginatedPages(bookingsPages);

  const isLoading =
    (tab === "scheduled" ? isBookingsLoading : isExamsLoading) &&
    Boolean(patient?._id);
  const isError = tab === "scheduled" ? isBookingsError : isExamsError;
  const refetch = tab === "scheduled" ? refetchBookings : refetchExams;

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Meus Exames" />

      <View className="flex-1 px-4 pt-4">
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/exam-scheduling")}
          className="mb-4 flex-row items-center justify-center gap-2 rounded-xl bg-bgSecondary py-3"
        >
          <CalendarPlus size={18} color={colors.textPrimary} />
          <Text className="font-bold text-textPrimary">Agendar novo exame</Text>
        </Pressable>

        <View className="mb-4 flex-row rounded-xl bg-bgThird p-1">
          <Pressable
            onPress={() => setTab("scheduled")}
            className={`flex-1 rounded-lg py-2 ${tab === "scheduled" ? "bg-bgSecondary" : ""}`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                tab === "scheduled" ? "text-textPrimary" : "text-textFifth"
              }`}
            >
              Agendados
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab("results")}
            className={`flex-1 rounded-lg py-2 ${tab === "results" ? "bg-bgSecondary" : ""}`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                tab === "results" ? "text-textPrimary" : "text-textFifth"
              }`}
            >
              Resultados
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <HistorySkeleton />
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-3">
            <Text className="text-center text-textFifth">
              Não foi possível carregar seus exames.
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
        ) : tab === "scheduled" ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={bookings}
            keyExtractor={(booking) => booking._id}
            onEndReached={() => {
              if (hasNextBookingsPage && !isFetchingNextBookingsPage) {
                fetchNextBookingsPage();
              }
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item: booking }) => (
              <ExamBookingCard booking={booking} />
            )}
            ListEmptyComponent={
              <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
                <CalendarClock size={28} color={colors.tabActive} />
                <Text className="mt-3 text-center text-textFifth">
                  Você ainda não possui exames agendados.
                </Text>
              </View>
            }
            ListFooterComponent={
              isFetchingNextBookingsPage ? (
                <View className="items-center py-4">
                  <ActivityIndicator color={colors.textSecondary} />
                </View>
              ) : null
            }
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={exams}
            keyExtractor={(exam) => exam._id}
            onEndReached={() => {
              if (hasNextExamsPage && !isFetchingNextExamsPage) {
                fetchNextExamsPage();
              }
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item: exam }) => <ExamResultCard exam={exam} />}
            ListEmptyComponent={
              <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
                <FileText size={28} color={colors.tabActive} />
                <Text className="mt-3 text-center text-textFifth">
                  Você ainda não possui exames disponíveis.
                </Text>
              </View>
            }
            ListFooterComponent={
              isFetchingNextExamsPage ? (
                <View className="items-center py-4">
                  <ActivityIndicator color={colors.textSecondary} />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
