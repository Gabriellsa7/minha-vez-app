import {
  Baby,
  Bandage,
  Bone,
  Brain,
  Eye,
  HeartPulse,
  Microscope,
  Pill,
  Scan,
  Smile,
  Stethoscope,
  Syringe,
} from "lucide-react-native";

type LucideIcon = typeof Stethoscope;

const SERVICE_ICON_KEYWORDS: Record<string, LucideIcon> = {
  cardiolog: HeartPulse,
  pediatr: Baby,
  ortoped: Bone,
  neurolog: Brain,
  oftalmolog: Eye,
  odont: Smile,
  dentist: Smile,
  exame: Microscope,
  laboratori: Microscope,
  sangue: Syringe,
  vacina: Syringe,
  injec: Syringe,
  "raio-x": Scan,
  "raio x": Scan,
  ultrassom: Scan,
  tomografia: Scan,
  farmac: Pill,
  curativo: Bandage,
};

export function getServiceIcon(serviceName?: string): LucideIcon {
  if (!serviceName) return Stethoscope;

  const normalized = serviceName.toLowerCase();

  const match = Object.entries(SERVICE_ICON_KEYWORDS).find(([keyword]) =>
    normalized.includes(keyword)
  );

  return match ? match[1] : Stethoscope;
}
