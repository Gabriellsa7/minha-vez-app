import { useDeletePatientMedicalDocument } from "@/src/api/delete-patient-medical-document";
import { useGetPatientMedicalDocumentDownloadUrl } from "@/src/api/get-patient-medical-document-download-url";
import { useUploadPatientMedicalDocument } from "@/src/api/upload-patient-medical-document";
import { ALLOWED_PATIENT_DOCUMENT_MIME_TYPES } from "@/src/config/entities/patients/patients.constants";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

type AllowedMimeType = (typeof ALLOWED_PATIENT_DOCUMENT_MIME_TYPES)[number];

export function useMedicalDocuments(patientId?: string) {
  const [isPickingDocument, setIsPickingDocument] = useState(false);

  const { mutate: uploadDocument, isPending: isUploadingDocument } =
    useUploadPatientMedicalDocument();
  const { mutate: deleteDocument, isPending: isDeletingDocument } =
    useDeletePatientMedicalDocument();
  const { mutateAsync: getDownloadUrl } =
    useGetPatientMedicalDocumentDownloadUrl();

  const uploadPickedFile = async (
    uri: string,
    fileName: string,
    mimeType: string,
  ) => {
    if (!patientId) return;

    if (!ALLOWED_PATIENT_DOCUMENT_MIME_TYPES.includes(mimeType as AllowedMimeType)) {
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
        { patientId, fileBase64, fileName, mimeType },
        {
          onSuccess: () => {
            Toast.show({ type: "success", text1: "Comprovante anexado" });
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

  const pickImage = async () => {
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

  const pickPdf = async () => {
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

  const addDocument = () => {
    Alert.alert("Anexar comprovante", "Escolha o tipo de arquivo", [
      { text: "Cancelar", style: "cancel" },
      { text: "Foto/Galeria", onPress: () => void pickImage() },
      { text: "Arquivo PDF", onPress: () => void pickPdf() },
    ]);
  };

  const openDocument = async (documentId: string) => {
    if (!patientId) return;

    try {
      const { fileUrl } = await getDownloadUrl({ patientId, documentId });
      await WebBrowser.openBrowserAsync(fileUrl);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Não foi possível abrir o comprovante",
        text2: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const removeDocument = (documentId: string) => {
    if (!patientId) return;

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
              { patientId, documentId },
              {
                onSuccess: () => {
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

  return {
    addDocument,
    openDocument,
    removeDocument,
    isUploading: isUploadingDocument || isPickingDocument,
    isDeleting: isDeletingDocument,
  };
}
