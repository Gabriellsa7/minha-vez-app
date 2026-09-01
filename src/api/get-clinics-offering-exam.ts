import { IExamOfferingWithHealthUnit } from "../config/entities/exam-offerings/exam-offerings.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_CLINICS_OFFERING_EXAM_KEY = "GET_CLINICS_OFFERING_EXAM_KEY";

export interface IGetClinicsOfferingExamParams {
  examName: string;
}

// encodeURIComponent leaves !'()* unescaped (they're "unreserved marks" per RFC2396),
// but the backend's OpenAPI validator rejects them as unencoded reserved characters —
// so exam names like "Hemograma (Completo)" need this extra pass.
const encodeQueryValue = (value: string) =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );

const getClinicsOfferingExam = async (
  params: IGetClinicsOfferingExamParams,
): Promise<IExamOfferingWithHealthUnit[]> => {
  const response = await httpClient.get<IExamOfferingWithHealthUnit[]>(
    `/exam-offerings/search?name=${encodeQueryValue(params.examName)}`,
  );
  return response.data;
};

export const useGetClinicsOfferingExam = generateReactQuery<
  IExamOfferingWithHealthUnit[],
  IGetClinicsOfferingExamParams
>(GET_CLINICS_OFFERING_EXAM_KEY, getClinicsOfferingExam);
