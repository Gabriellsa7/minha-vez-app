import { Star } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

const STARS = [1, 2, 3, 4, 5];

export function StarRatingInput({ value, onChange, size = 28 }: StarRatingInputProps) {
  return (
    <View className="flex-row gap-2">
      {STARS.map((star) => (
        <Pressable
          key={star}
          accessibilityRole="button"
          accessibilityLabel={`${star} estrela${star > 1 ? "s" : ""}`}
          hitSlop={6}
          onPress={() => onChange(star)}
        >
          <Star
            size={size}
            color="#F5B301"
            fill={star <= value ? "#F5B301" : "transparent"}
          />
        </Pressable>
      ))}
    </View>
  );
}
