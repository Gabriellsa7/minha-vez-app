import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { GET_USER_ME_KEY, useGetUser } from "@/src/api/get-user-me";
import { useUploadUserImage } from "@/src/api/upload-user-image";
import { Avatar } from "@/src/components/avatar/avatar";
import Header from "@/src/components/header/header";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { logout } from "@/src/services/auth/auth.api";
import { formatBirthDateForDisplay } from "@/src/utils/util";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Href, useRouter } from "expo-router";
import {
  ArrowRight,
  Bell,
  Edit,
  HeartPulse,
  IdCard,
  Lock,
  LogOut,
  Moon,
  Pencil,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export const ProfileContent = () => {
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  const { data: patient } = useGetPatientById({ userId: user?._id ?? "" });

  const { mutate: uploadUserImage, isPending: isUploadingImage } =
    useUploadUserImage();
  const colors = useThemeColors();
  const tabBarHeight = useBottomTabBarHeight();

  const handleOpenLogoutModal = () => {
    setOpenLogoutModal(true);
  };

  const handlePickAvatar = async () => {
    if (!user?._id) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permissão necessária",
        text2: "Permita o acesso às fotos para alterar sua imagem de perfil.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (result.canceled || !result.assets[0]?.base64) return;

    const asset = result.assets[0];

    uploadUserImage(
      {
        userId: user._id,
        imageBase64: asset.base64!,
        fileName: asset.fileName ?? undefined,
        mimeType: asset.mimeType,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [GET_USER_ME_KEY] });
          Toast.show({
            type: "success",
            text1: "Foto de perfil atualizada",
          });
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Não foi possível atualizar a foto",
            text2: error?.message || "Tente novamente em instantes.",
          });
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-bgPrimary">
      <Header text="Perfil do Paciente" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: tabBarHeight + 24 }}
      >
        <View className="flex items-center gap-4 bg-bgThird p-4 rounded-xl">
          <View className="relative">
            <Avatar uri={user?.avatar} name={user?.name} variant="lg" />
            <Pressable
              onPress={handlePickAvatar}
              disabled={isUploadingImage}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-bgThird items-center justify-center border border-bgSecondary"
            >
              {isUploadingImage ? (
                <ActivityIndicator size="small" color={colors.textSecondary} />
              ) : (
                <Pencil size={16} color={colors.textSecondary} />
              )}
            </Pressable>
          </View>
          <View>
            <Text className="text-textSecondary text-2xl font-bold">
              {user?.name}
            </Text>
          </View>
        </View>
        <View className="gap-4 bg-bgThird p-4 rounded-xl">
          <View className="flex-row items-center gap-4">
            <IdCard size={24} color={colors.textSecondary} />
            <Text className="text-textSecondary text-base font-bold">
              Informações do Pessoais
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-textBlack">CPF</Text>
            <Text className="text-textBlack">{patient?.cpf}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-textBlack">Telefone</Text>
            <Text className="text-textBlack">{patient?.phone}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-textBlack">Email</Text>
            <Text className="text-textBlack">{user?.email}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-textBlack">Data de Nascimento</Text>
            <Text className="text-textBlack">
              {formatBirthDateForDisplay(patient?.birthDate)}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push("/edit-profile" as Href)}
          className="flex-row justify-between items-center bg-bgThird p-4 rounded-xl"
        >
          <View className="flex-row items-center gap-4">
            <Edit size={24} color={colors.textSecondary} />
            <Text className="text-textBlack">Editar Perfil</Text>
          </View>
          <ArrowRight size={24} color={colors.textFourth} />
        </Pressable>
        <Pressable
          onPress={() => router.push("/priority-info" as Href)}
          className="flex-row justify-between items-center bg-bgThird p-4 rounded-xl"
        >
          <View className="flex-row items-center gap-4">
            <HeartPulse size={24} color={colors.textSecondary} />
            <Text className="text-textBlack">Prioridade de Atendimento</Text>
          </View>
          <ArrowRight size={24} color={colors.textFourth} />
        </Pressable>
        <Pressable
          onPress={() => router.push("/security-settings" as Href)}
          className="flex-row justify-between items-center bg-bgThird p-4 rounded-xl"
        >
          <View className="flex-row items-center gap-4">
            <Lock size={24} color={colors.textSecondary} />
            <Text className="text-textBlack">Configurações de Segurança</Text>
          </View>
          <ArrowRight size={24} color={colors.textFourth} />
        </Pressable>
        <Pressable
          onPress={() => router.push("/appearance" as Href)}
          className="flex-row justify-between items-center bg-bgThird p-4 rounded-xl"
        >
          <View className="flex-row items-center gap-4">
            <Moon size={24} color={colors.textSecondary} />
            <Text className="text-textBlack">Aparência</Text>
          </View>
          <ArrowRight size={24} color={colors.textFourth} />
        </Pressable>
        <View className="flex-row justify-between items-center bg-bgThird p-4 rounded-xl">
          <Pressable onPress={() => router.push("/notifications" as Href)}>
            <View className="flex-row items-center gap-4 justify-center">
              <Bell size={24} color={colors.textSecondary} />
              <Text className="text-textSecondary font-bold">
                VER NOTIFICAÇÕES
              </Text>
            </View>
          </Pressable>
          <View className="h-8 border-l border-borderPrimary" />
          <Pressable onPress={handleOpenLogoutModal}>
            <View className="flex-row items-center gap-4 justify-center">
              <LogOut size={24} color={colors.textDanger} />
              <Text className="text-textDanger font-bold">SAIR DA CONTA</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <Modal
        transparent
        animationType="fade"
        visible={openLogoutModal}
        onRequestClose={handleOpenLogoutModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-bgThird p-6 rounded-xl w-4/5">
            <Text className="text-textBlack text-lg font-bold mb-4">
              Tem certeza que deseja sair da conta?
            </Text>
            <View className="flex-row justify-end gap-4">
              <Text
                className="text-textSecondary font-bold"
                onPress={() => setOpenLogoutModal(false)}
              >
                Cancelar
              </Text>
              <Text className="text-textDanger font-bold" onPress={logout}>
                Sair
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
