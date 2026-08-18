import { useDeletePatientMedicalDocument } from "@/src/api/delete-patient-medical-document";
import {
  GET_PATIENT_BY_ID_KEY,
  useGetPatientById,
} from "@/src/api/get-patient-by-id";
import { useGetPatientMedicalDocumentDownloadUrl } from "@/src/api/get-patient-medical-document-download-url";
import { useGetUser } from "@/src/api/get-user-me";
import { useUpdatePatient } from "@/src/api/update-patient";
import { useUploadPatientMedicalDocument } from "@/src/api/upload-patient-medical-document";
import {
  ALLOWED_PATIENT_DOCUMENT_MIME_TYPES,
  BLOOD_TYPE_LABEL,
  BLOOD_TYPE_OPTIONS,
} from "@/src/config/entities/patients/patients.constants";
import { EBloodType } from "@/src/config/entities/patients/patients.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { useQueryClient } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as WebBrowser from "expo-web-browser";
import {
  Check,
  ChevronDown,
  Droplet,
  FileImage,
  FileText,
  Paperclip,
  Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export function MedicalInfo() {
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();
  const { data: patient, isLoading } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );

  const [bloodType, setBloodType] = useState<EBloodType | undefined>(
    undefined,
  );
  const [allergies, setAllergies] = useState("");
  const [medicalObservations, setMedicalObservations] = useState("");
  const [showBloodTypeOptions, setShowBloodTypeOptions] = useState(false);
  const [isPickingDocument, setIsPickingDocument] = useState(false);

  useEffect(() => {
    if (patient) {
      setBloodType(patient.bloodType);
      setAllergies(patient.allergies ?? "");
      setMedicalObservations(patient.medicalObservations ?? "");
    }
  }, [patient]);

  const { mutate: updatePatient, isPending: isSavingInfo } =
    useUpdatePatient();
  const { mutate: uploadDocument, isPending: isUploadingDocument } =
    useUploadPatientMedicalDocument();
  const { mutate: deleteDocument, isPending: isDeletingDocument } =
    useDeletePatientMedicalDocument();
  const { mutateAsync: getDownloadUrl } =
    useGetPatientMedicalDocumentDownloadUrl();

  const invalidatePatient = () => {
    queryClient.invalidateQueries({ queryKey: [GET_PATIENT_BY_ID_KEY] });
  };

  const infoChanged = patient
    ? (bloodType ?? undefined) !== (patient.bloodType ?? undefined) ||
      allergies.trim() !== (patient.allergies ?? "") ||
      medicalObservations.trim() !== (patient.medicalObservations ?? "")
    : false;

  const handleSaveInfo = () => {
    if (!patient) return;

    updatePatient(
      {
        patientId: patient._id,
        bloodType,
        allergies: allergies.trim(),
        medicalObservations: medicalObservations.trim(),
      },
      {
        onSuccess: () => {
          invalidatePatient();
          Toast.show({
            type: "success",
            text1: "Informações de saúde atualizadas",
          });
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: "Não foi possível salvar",
            text2: error?.message || "Tente novamente em instantes.",
          });
        },
      },
    );
  };

  const uploadPickedFile = async (
    uri: string,
    fileName: string,
    mimeType: string,
  ) => {
    if (!patient) return;

    if (
      !ALLOWED_PATIENT_DOCUMENT_MIME_TYPES.includes(
        mimeType as (typeof ALLOWED_PATIENT_DOCUMENT_MIME_TYPES)[number],
      )
    ) {
      Toast.show({
        type: "error",
        text1: "Arquivo não suportado",
        text2: "Envie um PDF ou uma imagem (JPG/PNG).",
      });
      return;
    }

    setIsPickingDocument(true);
    try {
      const fileBase64 = await new File(uri).base64();

      uploadDocument(
        { patientId: patient._id, fileBase64, fileName, mimeType },
        {
          onSuccess: () => {
            invalidatePatient();
            Toast.show({
              type: "success",
              text1: "Comprovante anexado",
            });
          },
          onError: (error) => {
            Toast.show({
              type: "error",
              text1: "Não foi possível anexar o comprovante",
              text2: error?.message || "Tente novamente em instantes.",
            });
          },
        },
      );
    } catch {
      Toast.show({
        type: "error",
        text1: "Não foi possível ler o arquivo selecionado",
      });
    } finally {
      setIsPickingDocument(false);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permissão necessária",
        text2: "Permita o acesso às fotos para anexar um comprovante.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    await uploadPickedFile(
      asset.uri,
      asset.fileName ?? "comprovante.jpg",
      asset.mimeType ?? "image/jpeg",
    );
  };

  const handlePickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    await uploadPickedFile(
      asset.uri,
      asset.name,
      asset.mimeType ?? "application/pdf",
    );
  };

  const handleAddDocument = () => {
    Alert.alert("Anexar comprovante", "Escolha o tipo de arquivo", [
      { text: "Cancelar", style: "cancel" },
      { text: "Foto/Galeria", onPress: () => void handlePickImage() },
      { text: "Arquivo PDF", onPress: () => void handlePickPdf() },
    ]);
  };

  const handleOpenDocument = async (documentId: string) => {
    if (!patient) return;

    try {
      const { fileUrl } = await getDownloadUrl({
        patientId: patient._id,
        documentId,
      });
      await WebBrowser.openBrowserAsync(fileUrl);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Não foi possível abrir o comprovante",
        text2: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    if (!patient) return;

    Alert.alert(
      "Remover comprovante",
      "Tem certeza que deseja remover este comprovante? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            deleteDocument(
              { patientId: patient._id, documentId },
              {
                onSuccess: () => {
                  invalidatePatient();
                  Toast.show({ type: "success", text1: "Comprovante removido" });
                },
                onError: (error) => {
                  Toast.show({
                    type: "error",
                    text1: "Não foi possível remover o comprovante",
                    text2: error?.message,
                  });
                },
              },
            );
          },
        },
      ],
    );
  };

  if (isLoading || !patient) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.textSecondary} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-bgPrimary"
      contentContainerStyle={{ padding: 24, gap: 16 }}
    >
      <View className="gap-4 rounded-2xl bg-bgThird p-4">
        <View className="flex-row items-center gap-2">
          <Droplet size={18} color={colors.textSecondary} />
          <Text className="text-base font-bold text-textBlack">
            Dados de saúde
          </Text>
        </View>
        <Text className="text-xs text-textFourth">
          Esses dados são opcionais, mas podem ajudar no seu atendimento.
        </Text>

        <View>
          <Text className="mb-1 text-sm font-medium text-textFifth">
            Tipo sanguíneo
          </Text>
          <Pressable
            onPress={() => setShowBloodTypeOptions(true)}
            className="flex-row items-center justify-between rounded-[16px] border border-infoBorder bg-infoBg px-3 py-3"
          >
            <Text className="text-textBlack">
              {bloodType ? BLOOD_TYPE_LABEL[bloodType] : "Não informado"}
            </Text>
            <ChevronDown size={18} color={colors.textFourth} />
          </Pressable>
        </View>

        <View>
          <Text className="mb-1 text-sm font-medium text-textFifth">
            Alergias
          </Text>
          <TextInput
            value={allergies}
            onChangeText={setAllergies}
            placeholder="Ex: alergia a dipirona, amendoim..."
            placeholderTextColor={colors.textFourth}
            multiline
            numberOfLines={3}
            className="rounded-[16px] border border-infoBorder bg-infoBg px-3 py-3 text-textBlack"
            style={{ minHeight: 72, textAlignVertical: "top" }}
          />
        </View>

        <View>
          <Text className="mb-1 text-sm font-medium text-textFifth">
            Condições / observações médicas
          </Text>
          <TextInput
            value={medicalObservations}
            onChangeText={setMedicalObservations}
            placeholder="Ex: hipertensão, diabetes..."
            placeholderTextColor={colors.textFourth}
            multiline
            numberOfLines={3}
            className="rounded-[16px] border border-infoBorder bg-infoBg px-3 py-3 text-textBlack"
            style={{ minHeight: 72, textAlignVertical: "top" }}
          />
        </View>

        <Pressable
          onPress={handleSaveInfo}
          disabled={isSavingInfo || !infoChanged}
          className={`rounded-[16px] p-3 ${
            isSavingInfo || !infoChanged ? "bg-highlightBorder" : "bg-bgSecondary"
          }`}
        >
          {isSavingInfo ? (
            <ActivityIndicator size="small" color={colors.textPrimary} />
          ) : (
            <Text className="text-center text-sm font-semibold text-textPrimary">
              Salvar dados de saúde
            </Text>
          )}
        </Pressable>
      </View>

      <View className="gap-3 rounded-2xl bg-bgThird p-4">
        <View className="flex-row items-center gap-2">
          <Paperclip size={18} color={colors.textSecondary} />
          <Text className="text-base font-bold text-textBlack">
            Comprovantes de exame
          </Text>
        </View>
        <Text className="text-xs text-textFourth">
          Anexe PDFs ou imagens de comprovantes médicos de condições de saúde
          que você tenha.
        </Text>

        {patient.medicalDocuments.length === 0 ? (
          <View className="items-center rounded-[16px] border border-borderPrimary p-4">
            <Text className="text-sm text-textFourth">
              Nenhum comprovante anexado.
            </Text>
          </View>
        ) : (
          <View className="gap-2">
            {patient.medicalDocuments.map((document) => (
              <Pressable
                key={document._id}
                onPress={() => void handleOpenDocument(document._id)}
                className="flex-row items-center justify-between rounded-[16px] border border-borderPrimary px-3 py-3"
              >
                <View className="flex-1 flex-row items-center gap-3">
                  {document.mimeType === "application/pdf" ? (
                    <FileText size={20} color={colors.textSecondary} />
                  ) : (
                    <FileImage size={20} color={colors.textSecondary} />
                  )}
                  <View className="flex-1">
                    <Text
                      className="text-sm font-medium text-textBlack"
                      numberOfLines={1}
                    >
                      {document.fileName}
                    </Text>
                    <Text className="text-xs text-textFourth">
                      {formatDateTime(document.uploadedAt)}
                    </Text>
                  </View>
                </View>
                <Pressable
                  hitSlop={8}
                  disabled={isDeletingDocument}
                  onPress={() => handleDeleteDocument(document._id)}
                >
                  <Trash2 size={18} color={colors.textDanger} />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable
          onPress={handleAddDocument}
          disabled={isUploadingDocument || isPickingDocument}
          className="flex-row items-center justify-center gap-2 rounded-[16px] border border-borderPrimary py-3"
        >
          {isUploadingDocument || isPickingDocument ? (
            <ActivityIndicator size="small" color={colors.textSecondary} />
          ) : (
            <>
              <Paperclip size={18} color={colors.textSecondary} />
              <Text className="text-center text-sm font-semibold text-textBlack">
                Anexar comprovante
              </Text>
            </>
          )}
        </Pressable>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={showBloodTypeOptions}
        onRequestClose={() => setShowBloodTypeOptions(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-5"
          onPress={() => setShowBloodTypeOptions(false)}
        >
          <View className="w-full max-h-[70%] rounded-[24px] bg-bgThird p-5">
            <Text className="mb-3 text-lg font-semibold text-textBlack">
              Tipo sanguíneo
            </Text>
            <ScrollView>
              <Pressable
                onPress={() => {
                  setBloodType(undefined);
                  setShowBloodTypeOptions(false);
                }}
                className="flex-row items-center justify-between py-3"
              >
                <Text className="text-textBlack">Não informado</Text>
                {!bloodType && <Check size={18} color={colors.textSecondary} />}
              </Pressable>
              {BLOOD_TYPE_OPTIONS.map((option) => {
                const isSelected = option === bloodType;

                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setBloodType(option);
                      setShowBloodTypeOptions(false);
                    }}
                    className="flex-row items-center justify-between border-t border-borderPrimary py-3"
                  >
                    <Text className="text-textBlack">
                      {BLOOD_TYPE_LABEL[option]}
                    </Text>
                    {isSelected && (
                      <Check size={18} color={colors.textSecondary} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
