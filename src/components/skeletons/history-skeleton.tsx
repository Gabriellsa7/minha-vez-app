import { View } from "react-native";
import { SkeletonBox } from "./skeleton-box";

const PLACEHOLDER_ROWS = [0, 1, 2, 3];

export function HistorySkeleton() {
  return (
    <View className="gap-3">
      {PLACEHOLDER_ROWS.map((row) => (
        <View
          key={row}
          className="rounded-2xl border border-borderPrimary bg-bgThird p-4 gap-3"
        >
          <View className="flex-row items-start justify-between gap-3">
            <SkeletonBox width="55%" height={16} />
            <SkeletonBox width={70} height={20} borderRadius={999} />
          </View>
          <SkeletonBox width="40%" height={12} />
          <SkeletonBox width="50%" height={12} />
        </View>
      ))}
    </View>
  );
}
