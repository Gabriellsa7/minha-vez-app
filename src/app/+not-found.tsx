import { StatusScreen } from "@/src/components/status-screen/status-screen";
import { router } from "expo-router";

export default function NotFoundScreen() {
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
    <StatusScreen
      title="Página não encontrada"
      message="A página que você tentou acessar não existe."
      actionLabel="Voltar para o início"
      onAction={handleGoHome}
    />
  );
}
