import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const colors = useThemeColors();

  const handleGoHome = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    // Não usar "/", pois index.tsx sempre redireciona para "/login" —
    // isso derrubaria de volta pro login um usuário já autenticado.
    router.replace("/home");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-bgPrimary px-8">
      <Text className="text-2xl font-bold text-textBlack text-center">
        Página não encontrada
      </Text>
      <Text className="text-sm text-textFifth text-center">
        A página que você tentou acessar não existe.
      </Text>
      <Pressable
        onPress={handleGoHome}
        className="mt-4 rounded-full px-6 py-3"
        style={{ backgroundColor: colors.buttonPrimary }}
      >
        <Text
          className="font-bold"
          style={{ color: colors.textPrimary }}
        >
          Voltar para o início
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
