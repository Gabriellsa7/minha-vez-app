import { IUser } from "../config/entities/user/user.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_USER_ME_KEY = "GET_USER_ME_KEY";

export type GetUserParamsResponse = IUser;

export const getUser = async (): Promise<GetUserParamsResponse> => {
  const path: string = "/auth/me";

  try {
    const response: GetUserParamsResponse = (await httpClient.get(path)).data;
    return response;
  } catch {
    throw new Error(path);
  }
};

export const useGetUser = generateReactQuery<GetUserParamsResponse, void>(
  GET_USER_ME_KEY,
  getUser,
);
