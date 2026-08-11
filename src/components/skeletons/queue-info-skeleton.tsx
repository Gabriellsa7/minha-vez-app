import { View } from "react-native";
import { SkeletonBox } from "./skeleton-box";

export function QueueInfoSkeleton() {
  return (
    <View className="gap-4 p-5">
      <View
        className="items-center justify-center rounded-[20px] bg-bgThird gap-3"
        style={{ height: 260 }}
      >
        <SkeletonBox width={128} height={128} borderRadius={64} />
        <SkeletonBox width={140} height={14} />
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-2 rounded-2xl border border-borderPrimary bg-bgThird p-4">
          <SkeletonBox width={80} height={12} />
          <SkeletonBox width={40} height={22} />
        </View>
        <View className="flex-1 gap-2 rounded-2xl border border-borderPrimary bg-bgThird p-4">
          <SkeletonBox width={80} height={12} />
          <SkeletonBox width={40} height={22} />
        </View>
      </View>

      <View className="gap-3 rounded-2xl border border-borderPrimary bg-bgThird p-4">
        <SkeletonBox width={120} height={14} />
        <View className="flex-row justify-between">
          <SkeletonBox width={30} height={18} />
          <SkeletonBox width={30} height={18} />
          <SkeletonBox width={30} height={18} />
          <SkeletonBox width={30} height={18} />
          <SkeletonBox width={30} height={18} />
        </View>
      </View>

      <View className="gap-2 rounded-2xl border border-borderPrimary bg-bgThird p-4">
        <SkeletonBox width={100} height={14} />
        <SkeletonBox width="60%" height={16} />
        <SkeletonBox width="40%" height={12} />
      </View>
    </View>
  );
}
