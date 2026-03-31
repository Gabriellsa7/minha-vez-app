import { IQueueItem } from "../config/entities/queue-items/queue-items.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_QUEUE_ITEMS_KEY = "GET_QUEUE_ITEMS_KEY";

export interface IGetQueueItemParams {
  patientId: string;
}

const getQueueItemByPatientId = async (
  params: IGetQueueItemParams,
): Promise<IQueueItem[]> => {
  const path = `/queue-items/patient/${params.patientId}`;

  try {
    const response = await httpClient.get(path);
    return response.data;
  } catch (error) {
    console.error("Error fetching queue items:", error);
    throw error;
  }
};

export const useGetQueueItemByPatientId = generateReactQuery<
  IQueueItem[],
  IGetQueueItemParams
>(GET_QUEUE_ITEMS_KEY, getQueueItemByPatientId);
