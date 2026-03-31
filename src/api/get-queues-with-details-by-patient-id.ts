//'/queues/patient/:patientId/details'

import { IQueueWithDetails } from "../config/entities/queue/queue.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY =
  "GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY";

export interface IGetQueuesWithDetailsByPatientIdParams {
  patientId: string;
}

const getQueuesWithDetailsByPatientId = async (
  params: IGetQueuesWithDetailsByPatientIdParams,
): Promise<IQueueWithDetails[]> => {
  const path = `/queues/patient/${params.patientId}/details`;

  try {
    const response = await httpClient.get(path);
    return response.data;
  } catch (error) {
    console.error("Error fetching queues with details:", error);
    throw error;
  }
};

export const useGetQueuesWithDetailsByPatientId = generateReactQuery<
  IQueueWithDetails[],
  IGetQueuesWithDetailsByPatientIdParams
>(GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY, getQueuesWithDetailsByPatientId);
