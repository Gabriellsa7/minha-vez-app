import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import Header from "@/src/components/header/header";
import { logout } from "@/src/services/auth/auth.api";
import { ArrowRight, Edit, IdCard, Lock, LogOut } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

export const ProfileContent = () => {
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const { data: user } = useGetUser();

  const { data: patient } = useGetPatientById({ userId: user?._id ?? "" });

  const handleOpenLogoutModal = () => {
    setOpenLogoutModal(true);
  };

  return (
    <View className=" bg-bgPrimary">
      <Header text="Perfil do Paciente" />
      <View className="p-6 gap-6">
        <View className="flex items-center gap-4">
          <View>
            {/*User image profile, add a button to edit the image too*/}
            <Text>Profile</Text>
          </View>
          <View>
            <Text>{user?.name}</Text>
          </View>
        </View>
        <View className="gap-4 bg-bgThird p-4 rounded-xl">
          <View className="flex-row items-center gap-4">
            <IdCard size={24} color="#006673" />
            <Text className="text-textSecondary text-base font-bold">
              Informações do Pessoais
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text>CPF</Text>
            <Text>{patient?.cpf}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Phone</Text>
            <Text>{patient?.phone}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Email</Text>
            <Text>{user?.email}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Data de Nascimento</Text>
            <Text>{patient?.birthDate}</Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center bg-bgThird p-4 rounded-xl">
          <View className="flex-row items-center gap-4">
            <Edit size={24} color="#006673" />
            <Text>Editar Perfil</Text>
          </View>
          <ArrowRight size={24} color="#BDC9CB" />
        </View>
        <View className="flex-row justify-between items-center bg-bgThird p-4 rounded-xl">
          <View className="flex-row items-center gap-4">
            <Lock size={24} color="#006673" />
            <Text>Configurações de Segurança</Text>
          </View>
          <ArrowRight size={24} color="#BDC9CB" />
        </View>
        <Pressable onPress={handleOpenLogoutModal}>
          <View className="flex-row items-center gap-4 justify-center">
            <LogOut size={24} color="#BA1A1A" />
            <Text className="text-textDanger font-bold">SAIR DA CONTA</Text>
          </View>
        </Pressable>
      </View>
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
