import { IPatientMedicalDocument } from "@/src/config/entities/patients/patients.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { FileImage, FileText, Paperclip, Trash2 } from "lucide-react-native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useMedicalDocuments } from "../hooks/use-medical-documents";

interface MedicalDocumentsCardProps {
  patientId: string;
  documents: IPatientMedicalDocument[];
}

export function MedicalDocumentsCard({
  patientId,
  documents,
}: MedicalDocumentsCardProps) {
  const colors = useThemeColors();
  const { addDocument, openDocument, removeDocument, isUploading, isDeleting } =
    useMedicalDocuments(patientId);

  return (
    <View className="gap-3 rounded-2xl bg-bgThird p-4">
      <View className="flex-row items-center gap-2">
        <Paperclip size={18} color={colors.textSecondary} />
        <Text className="text-base font-bold text-textBlack">
          Comprovantes de exame
        </Text>
      </View>
      <Text className="text-xs text-textFourth">
        Anexe PDFs ou imagens de comprovantes médicos de condições de saúde que
        você tenha.
      </Text>

      {documents.length === 0 ? (
        <View className="items-center rounded-[16px] border border-borderPrimary p-4">
          <Text className="text-sm text-textFourth">
            Nenhum comprovante anexado.
          </Text>
        </View>
      ) : (
        <View className="gap-2">
          {documents.map((document) => (
            <Pressable
              key={document._id}
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${document.fileName}`}
              onPress={() => void openDocument(document._id)}
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
                accessibilityRole="button"
                accessibilityLabel={`Remover ${document.fileName}`}
                hitSlop={12}
                disabled={isDeleting}
                onPress={() => removeDocument(document._id)}
              >
                <Trash2 size={18} color={colors.textDanger} />
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={addDocument}
        disabled={isUploading}
        className="min-h-[48px] flex-row items-center justify-center gap-2 rounded-[16px] border border-borderPrimary py-3"
      >
        {isUploading ? (
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
  );
}
