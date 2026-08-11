import { useGetExamById } from "@/src/api/get-exam-by-id";
import Header from "@/src/components/header/header";
import { HistorySkeleton } from "@/src/components/skeletons/history-skeleton";
import { File, Paths } from "expo-file-system";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import {
  CalendarClock,
  Download,
  Eye,
  MapPin,
  Stethoscope,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ExamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: exam,
    isLoading,
    isError,
    refetch,
  } = useGetExamById({ id: id ?? "" }, { enabled: Boolean(id) });

  const handleViewPdf = async () => {
    if (!exam?.fileUrl) return;
    await WebBrowser.openBrowserAsync(exam.fileUrl);
  };

  const handleDownloadPdf = async () => {
    if (!exam?.fileUrl) return;

    try {
      setIsDownloading(true);
      const destination = new File(Paths.cache, exam.fileName);
      const downloaded = await File.downloadFileAsync(
        exam.fileUrl,
        destination,
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloaded.uri);
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível baixar o exame",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Detalhes do Exame" />

      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <HistorySkeleton />
        ) : isError || !exam ? (
          <View className="flex-1 items-center justify-center gap-3">
            <Text className="text-center text-textFifth">
              Não foi possível carregar este exame.
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
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="rounded-2xl border border-borderPrimary bg-bgThird p-4">
              <Text className="text-lg font-semibold text-textBlack">
                {exam.examType}
              </Text>

              {exam.examDate && (
                <View className="mt-3 flex-row items-center gap-2">
                  <CalendarClock size={16} color="#A8A8A8" />
                  <Text className="text-sm text-textFourth">
                    {new Date(exam.examDate).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              )}

              {exam.doctorName && (
                <View className="mt-2 flex-row items-center gap-2">
                  <Stethoscope size={16} color="#A8A8A8" />
                  <Text className="text-sm text-textFourth">
                    {exam.doctorName}
                  </Text>
                </View>
              )}

              {exam.healthUnitName && (
                <View className="mt-2 flex-row items-center gap-2">
                  <MapPin size={16} color="#A8A8A8" />
                  <Text className="text-sm text-textFourth">
                    {exam.healthUnitName}
                  </Text>
                </View>
              )}

              {exam.notes && (
                <Text className="mt-4 text-sm text-textFourth">
                  {exam.notes}
                </Text>
              )}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleViewPdf}
              className="mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-bgSecondary py-3"
            >
              <Eye size={18} color="#FFFFFF" />
              <Text className="font-bold text-textPrimary">
                Visualizar PDF
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={isDownloading}
              onPress={handleDownloadPdf}
              className="mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-borderPrimary py-3"
            >
              <Download size={18} color="#006673" />
              <Text className="font-bold text-textSecondary">
                {isDownloading ? "Baixando..." : "Baixar"}
              </Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
