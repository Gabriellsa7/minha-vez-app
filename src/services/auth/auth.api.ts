import { router } from "expo-router";
import { httpClient } from "../api";
import { removeToken } from "./auth.storage";

export interface IAuthLogin {
  email: string;
  password: string;
}

export const login = async (data: IAuthLogin) => {
  try {
    const response = await httpClient.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const logout = async () => {
  await removeToken();

  router.replace("/login");
};
