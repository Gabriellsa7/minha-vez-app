// Espelho JS dos tokens definidos em `global.css` (`:root` / `prefers-color-scheme: dark`).
// Necessário porque `color=`/`style={{}}` não passam pelo NativeWind — mantenha os dois em sincronia.

export type ThemeColors = Record<
  | "textPrimary"
  | "textSecondary"
  | "textThird"
  | "textFourth"
  | "textFifth"
  | "textBlack"
  | "textDanger"
  | "buttonPrimary"
  | "buttonSecondary"
  | "borderPrimary"
  | "bgPrimary"
  | "bgSecondary"
  | "bgThird"
  | "bgFourth"
  | "statusSuccessBg"
  | "statusSuccessText"
  | "statusDangerBg"
  | "statusDangerText"
  | "accentStar"
  | "skeletonBase"
  | "infoBg"
  | "infoBorder"
  | "highlightBg"
  | "highlightBorder"
  | "highlightText"
  | "tabActive"
  | "tabInactive"
  | "tabBlurOverlay"
  | "warningBg"
  | "warningBorder"
  | "warningText"
  | "accentBlue",
  string
>;

export const LightColors: ThemeColors = {
  textPrimary: "#FFFFFF",
  textSecondary: "#006673",
  textThird: "#1EC2D8",
  textFourth: "#A8A8A8",
  textFifth: "#3E494B",
  textBlack: "#191C1D",
  textDanger: "#BA1A1A",
  buttonPrimary: "#3D8296",
  buttonSecondary: "#E7E8E9",
  borderPrimary: "#E6E6E6",
  bgPrimary: "#F3F4F5",
  bgSecondary: "#007C8F",
  bgThird: "#FFFFFF",
  bgFourth: "#006673",
  statusSuccessBg: "#E6F7EF",
  statusSuccessText: "#0F9D58",
  statusDangerBg: "#FDEAEA",
  statusDangerText: "#BA1A1A",
  accentStar: "#F5B301",
  skeletonBase: "#E1E4E8",
  infoBg: "#DDF4F7",
  infoBorder: "#D7EEF2",
  highlightBg: "#EAF9FB",
  highlightBorder: "#0B7A87",
  highlightText: "#0B7A87",
  tabActive: "#0F766E",
  tabInactive: "#64748B",
  tabBlurOverlay: "rgba(255,255,255,0.7)",
  warningBg: "#FEF3C7",
  warningBorder: "#FDE68A",
  warningText: "#92400E",
  accentBlue: "#2563EB",
};

export const DarkColors: ThemeColors = {
  // textPrimary é sempre "texto claro sobre superfície de marca" (botões/headers em
  // bgSecondary, bgFourth, gradientes) — essas superfícies não invertem no dark, então
  // o token também não inverte.
  textPrimary: "#FFFFFF",
  textSecondary: "#4DD8E8",
  textThird: "#1EC2D8",
  textFourth: "#8A9194",
  textFifth: "#C7CDD0",
  textBlack: "#F2F3F3",
  textDanger: "#FF6B6B",
  buttonPrimary: "#2E6577",
  buttonSecondary: "#2A2F31",
  borderPrimary: "#33393B",
  bgPrimary: "#121516",
  bgSecondary: "#045C6B",
  bgThird: "#1B1F20",
  bgFourth: "#003B45",
  statusSuccessBg: "#123626",
  statusSuccessText: "#4ADE80",
  statusDangerBg: "#3A1616",
  statusDangerText: "#FF6B6B",
  accentStar: "#F5B301",
  skeletonBase: "#2A2F31",
  infoBg: "#123338",
  infoBorder: "#1F4B52",
  highlightBg: "#103235",
  highlightBorder: "#14B8A6",
  highlightText: "#2DD4BF",
  tabActive: "#2DD4BF",
  tabInactive: "#94A3B8",
  tabBlurOverlay: "rgba(20,20,20,0.55)",
  warningBg: "#2E2410",
  warningBorder: "#5C4A1A",
  warningText: "#FBBF24",
  accentBlue: "#60A5FA",
};
