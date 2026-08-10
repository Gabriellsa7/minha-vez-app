import {
  GET_PATIENT_BY_ID_KEY,
  useGetPatientById,
} from "@/src/api/get-patient-by-id";
import { GET_USER_ME_KEY, useGetUser } from "@/src/api/get-user-me";
import { useUpdatePatient } from "@/src/api/update-patient";
import { useUpdateUser } from "@/src/api/update-user";
import { formatPhone } from "@/src/utils/util";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Lock } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EditProfile() {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useGetUser();
  const { data: patient, isLoading: isPatientLoading } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (patient) {
      setPhone(patient.phone ?? "");
    }
  }, [patient]);

  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutate: updatePatient, isPending: isUpdatingPatient } =
    useUpdatePatient();

  const isSaving = isUpdatingUser || isUpdatingPatient;

  const nameChanged = user ? name.trim() !== user.name : false;
  const emailChanged = user ? email.trim() !== user.email : false;
  const phoneChanged = patient ? phone.trim() !== patient.phone : false;

  const hasChanges = nameChanged || emailChanged || phoneChanged;

  const handleSave = () => {
    if (!user) return;

    if (!name.trim() || !email.trim()) {
      Toast.show({
        type: "error",
        text1: "Preencha nome e email",
      });
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      Toast.show({
        type: "error",
        text1: "Email inválido",
        text2: "Verifique o endereço de email informado.",
      });
      return;
    }

    if (!hasChanges) {
      router.back();
      return;
    }

    const requests: Promise<unknown>[] = [];

    if (nameChanged || emailChanged) {
      requests.push(
        new Promise((resolve, reject) => {
          updateUser(
            {
              userId: user._id,
              ...(nameChanged && { name: name.trim() }),
              ...(emailChanged && { email: email.trim() }),
            },
            { onSuccess: resolve, onError: reject },
          );
        }),
      );
    }

    if (patient && phoneChanged) {
      requests.push(
        new Promise((resolve, reject) => {
          updatePatient(
            { patientId: patient._id, phone: phone.trim() },
            { onSuccess: resolve, onError: reject },
          );
        }),
      );
    }

    Promise.all(requests)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: [GET_USER_ME_KEY] });
        queryClient.invalidateQueries({ queryKey: [GET_PATIENT_BY_ID_KEY] });
        Toast.show({
          type: "success",
          text1: "Perfil atualizado",
          text2: "Suas informações foram salvas com sucesso.",
        });
        router.back();
      })
      .catch((error: Error) => {
        Toast.show({
          type: "error",
          text1: "Não foi possível salvar",
          text2: error?.message || "Tente novamente em instantes.",
        });
      });
  };

  if (isUserLoading || (user?._id && isPatientLoading)) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#008096" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-bgPrimary"
        contentContainerStyle={{ padding: 24, gap: 16 }}
      >
        <View className="gap-4 rounded-2xl bg-bgThird p-4">
          <View>
            <Text className="mb-1 text-sm font-medium text-textFifth">
              Nome
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              className="rounded-[16px] border border-[#D7EEF2] bg-[#F4FBFC] px-3 py-3 text-textBlack"
            />
          </View>

          <View>
            <Text className="mb-1 text-sm font-medium text-textFifth">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="rounded-[16px] border border-[#D7EEF2] bg-[#F4FBFC] px-3 py-3 text-textBlack"
            />
          </View>

          {patient && (
            <View>
              <Text className="mb-1 text-sm font-medium text-textFifth">
                Telefone
              </Text>
              <TextInput
                value={phone}
                onChangeText={(value) => setPhone(formatPhone(value))}
                placeholder="(11) 99999-9999"
                keyboardType="numeric"
                className="rounded-[16px] border border-[#D7EEF2] bg-[#F4FBFC] px-3 py-3 text-textBlack"
              />
            </View>
          )}
        </View>

        {patient && (
          <View className="gap-4 rounded-2xl bg-bgThird p-4">
            <View className="flex-row items-center gap-2">
              <Lock size={16} color="#A8A8A8" />
              <Text className="text-sm font-medium text-textFourth">
                Esses dados não podem ser alterados
              </Text>
            </View>

            <View>
              <Text className="mb-1 text-sm font-medium text-textFifth">
                CPF
              </Text>
              <TextInput
                value={patient.cpf}
                editable={false}
                className="rounded-[16px] border border-[#E6E6E6] bg-[#F1F5F9] px-3 py-3 text-textFourth"
              />
            </View>

            <View>
              <Text className="mb-1 text-sm font-medium text-textFifth">
                Data de Nascimento
              </Text>
              <TextInput
                value={patient.birthDate}
                editable={false}
                className="rounded-[16px] border border-[#E6E6E6] bg-[#F1F5F9] px-3 py-3 text-textFourth"
              />
            </View>
          </View>
        )}

        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className={`rounded-[20px] p-4 ${
            isSaving ? "bg-[#67B5C0]" : "bg-[#008096]"
          }`}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-center text-base font-semibold text-white">
              Salvar alterações
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
