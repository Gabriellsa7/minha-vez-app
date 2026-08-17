import { View } from "react-native";
import { SkeletonBox } from "./skeleton-box";

export function AgendaSkeleton() {
  return (
    <View className="gap-5 px-5 pt-4">
      <SkeletonBox width={160} height={20} />

      <View className="rounded-[24px] border border-infoBorder bg-bgThird p-4 gap-3">
        <SkeletonBox width="70%" height={16} />
        <SkeletonBox width="100%" height={12} />
        <SkeletonBox width="90%" height={12} />
      </View>

      <SkeletonBox width={140} height={16} />
      <View className="flex-row gap-2">
        <SkeletonBox width={90} height={36} borderRadius={18} />
        <SkeletonBox width={90} height={36} borderRadius={18} />
        <SkeletonBox width={90} height={36} borderRadius={18} />
      </View>

      <SkeletonBox width={150} height={16} />
      <View className="gap-3">
        <SkeletonBox width="100%" height={72} borderRadius={16} />
        <SkeletonBox width="100%" height={72} borderRadius={16} />
        <SkeletonBox width="100%" height={72} borderRadius={16} />
      </View>
    </View>
  );
}
