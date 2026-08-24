import { IHealthUnitQueueSummary } from "../config/entities/queue/queue.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_HEALTH_UNIT_QUEUE_SUMMARY_KEY =
  "GET_HEALTH_UNIT_QUEUE_SUMMARY_KEY";

export interface IGetHealthUnitQueueSummaryParams {
  healthUnitId: string;
}

const getHealthUnitQueueSummary = async (
  params: IGetHealthUnitQueueSummaryParams,
): Promise<IHealthUnitQueueSummary> => {
  const path = `/health-units/${params.healthUnitId}/queue-summary`;
  const response = await httpClient.get(path);

  return response.data;
};

export const useGetHealthUnitQueueSummary = generateReactQuery<
  IHealthUnitQueueSummary,
  IGetHealthUnitQueueSummaryParams
>(GET_HEALTH_UNIT_QUEUE_SUMMARY_KEY, getHealthUnitQueueSummary);
