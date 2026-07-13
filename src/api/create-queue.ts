import { IQueue } from "../config/entities/queue/queue.type";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const CREATE_QUEUE_KEY = "CREATE_QUEUE_KEY";

export interface ICreateQueueParams {
  professionalId: string;
  healthUnitId: string;
}

export const createQueue = async (
  params: ICreateQueueParams,
): Promise<IQueue> => {
  const response = await httpClient.post("/queue", params);
  return response.data;
};

export const useCreateQueue = generateReactQueryMutation<
  IQueue,
  ICreateQueueParams
>(CREATE_QUEUE_KEY, createQueue);
