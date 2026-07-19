import Header from "@/src/components/header/header";
import SearchInput from "@/src/components/search-input/search-input";
import { Text, View } from "react-native";
import { CategoriesSection } from "./components/categories-section";

export function ExploreContent() {
  return (
    <View>
      <Header text="Explorar" />
      <View className="p-6 gap-8">
        <View className="gap-2">
          <View>
            <Text className=" text-2xl">
              Encontre o cuidado{" "}
              <Text className="text-textSecondary">que você merece</Text>.
            </Text>
          </View>
          <View>
            <Text>
              Busque por clínicas, especialistas ou sintomas para iniciar seu
              atendimento.
            </Text>
          </View>
        </View>
        <SearchInput placeholder="Qual especialidade você procura" />
        <CategoriesSection />
      </View>
    </View>
  );
}
