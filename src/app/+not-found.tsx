import { StatusScreen } from "@/src/components/status-screen/status-screen";
import { router } from "expo-router";

export default function NotFoundScreen() {
  const handleGoHome = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/home");
  };

  return (
    <StatusScreen
      title="Página não encontrada"
      message="A página que você tentou acessar não existe."
      actionLabel="Voltar para o início"
      onAction={handleGoHome}
    />
  );
}
