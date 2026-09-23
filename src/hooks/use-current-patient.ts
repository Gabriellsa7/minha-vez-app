import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";

export function useCurrentPatient() {
  const userQuery = useGetUser();
  const userId = userQuery.data?._id;

  const patientQuery = useGetPatientById(
    { userId: userId ?? "" },
    { enabled: Boolean(userId), retry: false },
  );

  return {
    user: userQuery.data,
    patient: patientQuery.data ?? undefined,
    patientId: patientQuery.data?._id,
    userQuery,
    patientQuery,
    isLoading: userQuery.isLoading || patientQuery.isLoading,
    isError: userQuery.isError || patientQuery.isError,
  };
}
