import { ExploreContent } from "@/src/features/explore/exploreContent";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Explore() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ExploreContent />
    </SafeAreaView>
  );
}
