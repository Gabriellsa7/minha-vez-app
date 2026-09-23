import { IUser } from "../config/entities/user/user.types";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";
import { USER_QUERY_KEYS } from "./query-groups";

export interface IUpdateUserPayload {
  userId: string;
  name?: string;
  email?: string;
}

export const UPDATE_USER_KEY = "UPDATE_USER_KEY";

const updateUser = async (payload: IUpdateUserPayload): Promise<IUser> => {
  const { userId, ...data } = payload;

  const response = await httpClient.put(`/users/${userId}`, data);
  return response.data;
};

export const useUpdateUser = generateReactQueryMutation<
  IUser,
  IUpdateUserPayload
>(UPDATE_USER_KEY, updateUser, USER_QUERY_KEYS);
