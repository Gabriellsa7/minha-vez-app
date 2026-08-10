import { router } from "expo-router";
import { queryClient } from "../../lib/react-query";
import { httpClient } from "../api";
import { removeToken } from "./auth.storage";

export interface IAuthLogin {
  email: string;
  password: string;
}

export const login = async (data: IAuthLogin) => {
  const response = await httpClient.post("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  await removeToken();
  queryClient.clear();

  router.replace("/login");
};
