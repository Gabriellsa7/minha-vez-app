import { Image } from "expo-image";
import { useState } from "react";

const FALLBACK_IMAGE = require("@/assets/images/Hospital.png");

interface HealthUnitImageProps {
  uri?: string | null;
}

export function HealthUnitImage({ uri }: HealthUnitImageProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const hasValidUri = Boolean(uri?.trim()) && failedUri !== uri;

  return (
    <Image
      source={hasValidUri ? { uri: uri! } : FALLBACK_IMAGE}
      placeholder={FALLBACK_IMAGE}
      style={{ width: "100%", height: "100%" }}
      contentFit="cover"
      onError={() => setFailedUri(uri ?? null)}
      accessibilityIgnoresInvertColors
    />
  );
}
