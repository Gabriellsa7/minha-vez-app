import {
  GET_PATIENT_BY_ID_KEY,
  useGetPatientById,
} from "@/src/api/get-patient-by-id";
import { GET_USER_ME_KEY, useGetUser } from "@/src/api/get-user-me";
import { useUpdatePatient } from "@/src/api/update-patient";
import { useUpdateUser } from "@/src/api/update-user";
import { formatPhone } from "@/src/utils/util";
import { isValidEmail, isValidPhone } from "@/src/utils/validation.util";
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

type FieldName = "name" | "email" | "phone";

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

  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    name: false,
    email: false,
    phone: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleBlur = (field: FieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

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

  const nameError = !name.trim() ? "Informe seu nome" : undefined;

  const emailError = !email.trim()
    ? "Informe seu email"
    : !isValidEmail(email)
      ? "Email inválido"
      : undefined;

  const phoneError = patient
    ? !phone.trim()
      ? "Informe seu telefone"
      : !isValidPhone(phone)
        ? "Telefone inválido"
        : undefined
    : undefined;

  const showNameError = (touched.name || submitAttempted) && nameError;
  const showEmailError = (touched.email || submitAttempted) && emailError;
  const showPhoneError = (touched.phone || submitAttempted) && phoneError;

  const handleSave = () => {
    if (!user) return;

    setSubmitAttempted(true);

    if (nameError || emailError || phoneError) return;

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
              onBlur={() => handleBlur("name")}
              placeholder="Seu nome completo"
              placeholderTextColor="#888"
              className={`rounded-[16px] border bg-[#F4FBFC] px-3 py-3 text-textBlack ${
                showNameError ? "border-red-500" : "border-[#D7EEF2]"
              }`}
            />
            {showNameError && (
              <Text className="mt-1 text-xs text-red-500">{nameError}</Text>
            )}
          </View>

          <View>
            <Text className="mb-1 text-sm font-medium text-textFifth">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              onBlur={() => handleBlur("email")}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
              className={`rounded-[16px] border bg-[#F4FBFC] px-3 py-3 text-textBlack ${
                showEmailError ? "border-red-500" : "border-[#D7EEF2]"
              }`}
            />
            {showEmailError && (
              <Text className="mt-1 text-xs text-red-500">{emailError}</Text>
            )}
          </View>

          {patient && (
            <View>
              <Text className="mb-1 text-sm font-medium text-textFifth">
                Telefone
              </Text>
              <TextInput
                value={phone}
                onChangeText={(value) => setPhone(formatPhone(value))}
                onBlur={() => handleBlur("phone")}
                placeholder="(11) 99999-9999"
                keyboardType="numeric"
                placeholderTextColor="#888"
                className={`rounded-[16px] border bg-[#F4FBFC] px-3 py-3 text-textBlack ${
                  showPhoneError ? "border-red-500" : "border-[#D7EEF2]"
                }`}
              />
              {showPhoneError && (
                <Text className="mt-1 text-xs text-red-500">
                  {phoneError}
                </Text>
              )}
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
                placeholderTextColor="#888"
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
                placeholderTextColor="#888"
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
