import { router } from "expo-router";
import { queryClient } from "../../lib/react-query";
import { httpClient } from "../api";
import { removeToken } from "./auth.storage";

export interface IAuthLogin {
  email: string;
  password: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IVerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface IVerifyResetCodeResponse {
  resetToken: string;
}

export interface IResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export const login = async (data: IAuthLogin) => {
  const response = await httpClient.post("/auth/login", data);
  return response.data;
};

export const requestPasswordReset = async (data: IForgotPasswordRequest) => {
  const response = await httpClient.post("/auth/forgot-password", data);
  return response.data;
};

export const verifyResetCode = async (
  data: IVerifyResetCodeRequest,
): Promise<IVerifyResetCodeResponse> => {
  const response = await httpClient.post("/auth/verify-reset-code", data);
  return response.data;
};

export const resetPassword = async (data: IResetPasswordRequest) => {
  const response = await httpClient.post("/auth/reset-password", data);
  return response.data;
};

export const logout = async () => {
  await removeToken();
  queryClient.clear();

  router.replace("/login");
};
