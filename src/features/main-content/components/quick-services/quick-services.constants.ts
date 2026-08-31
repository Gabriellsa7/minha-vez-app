import { router } from "expo-router";
import {
  Calendar,
  ClipboardList,
  Compass,
  FileText,
  History,
  Stethoscope,
  TestTube,
} from "lucide-react-native";
import type { ComponentType } from "react";

export interface QuickServiceItem {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
}

export const QUICK_SERVICES: QuickServiceItem[] = [
  {
    key: "agendar",
    label: "Agendar",
    icon: Calendar,
    onPress: () => router.push("/agenda"),
  },
  {
    key: "agendar-exame",
    label: "Agendar Exame",
    icon: TestTube,
    onPress: () => router.push("/exam-scheduling"),
  },
  {
    key: "historico",
    label: "Histórico",
    icon: History,
    onPress: () => router.push("/history"),
  },
  {
    key: "explorar",
    label: "Explorar",
    icon: Compass,
    onPress: () => router.push("/explore"),
  },
  {
    key: "meus-exames",
    label: "Meus Exames",
    icon: FileText,
    onPress: () => router.push("/exams"),
  },
  {
    key: "minhas-consultas",
    label: "Minhas Consultas",
    icon: Stethoscope,
    onPress: () => router.push("/my-appointments"),
  },
  {
    key: "minhas-receitas",
    label: "Minhas Receitas",
    icon: ClipboardList,
    onPress: () => router.push("/prescriptions"),
  },
];
