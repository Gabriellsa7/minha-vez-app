import { getUserInitials } from "@/src/utils/util";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface AvatarProps {
  uri?: string | null;
  name?: string;
  variant?: "sm" | "lg";
}

const VARIANT_CLASSES: Record<"sm" | "lg", { container: string; text: string }> = {
  sm: { container: "w-10 h-10", text: "text-lg" },
  lg: { container: "w-24 h-24", text: "text-2xl" },
};

export function Avatar({ uri, name = "", variant = "sm" }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [uri]);

  const { container, text } = VARIANT_CLASSES[variant];
  const showImage = Boolean(uri) && !hasError;

  return (
    <View
      className={`${container} rounded-full bg-bgSecondary overflow-hidden flex items-center justify-center`}
    >
      {showImage ? (
        <Image
          source={{ uri: uri! }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={150}
          onError={() => setHasError(true)}
        />
      ) : (
        <Text className={`text-textPrimary ${text} font-bold`}>
          {getUserInitials(name)}
        </Text>
      )}
    </View>
  );
}
