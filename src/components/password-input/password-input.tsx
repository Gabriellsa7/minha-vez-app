import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";

type PasswordInputProps = Omit<TextInputProps, "secureTextEntry">;

export function PasswordInput({
  placeholder = "Digite sua senha...",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View className="flex-row items-center rounded-lg border-borderPrimary border-[2px] pr-3">
      <TextInput
        placeholder={placeholder}
        secureTextEntry={!isVisible}
        className="flex-1 p-3 focus:outline-none focus:ring-0"
        {...props}
      />
      <Pressable
        onPress={() => setIsVisible((previous) => !previous)}
        hitSlop={8}
      >
        {isVisible ? (
          <EyeOff size={20} color="#888" />
        ) : (
          <Eye size={20} color="#888" />
        )}
      </Pressable>
    </View>
  );
}
