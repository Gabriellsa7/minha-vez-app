import { IQueueItem } from "../config/entities/queue-items/queue-items.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_QUEUE_ITEMS_BY_QUEUE_ID_KEY = "GET_QUEUE_ITEMS_BY_QUEUE_ID_KEY";

export interface IGetQueueItemByQueueIdParams {
  queueId: string;
}

const getQueueItemByQueueId = async (
  params: IGetQueueItemByQueueIdParams,
): Promise<IQueueItem[]> => {
  const path = `/queue-items/queues/${params.queueId}`;

  try {
    const response = await httpClient.get(path, {
      validateStatus: (status) =>
        status === 404 || (status >= 200 && status < 300),
    });

    if (response.status === 404) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching queue items by queue id:", error);
    throw error;
  }
};

export const useGetQueueItemByQueueId = generateReactQuery<
  IQueueItem[],
  IGetQueueItemByQueueIdParams
>(GET_QUEUE_ITEMS_BY_QUEUE_ID_KEY, getQueueItemByQueueId);
