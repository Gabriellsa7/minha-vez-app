import { httpClient } from "@/src/services/api";
import {
  getRefreshToken,
  removeToken,
  saveToken,
} from "@/src/services/auth/auth.storage";
import { AxiosError, AxiosResponse } from "axios";
import Toast from "react-native-toast-message";

export const handleSuccessResponse = async (response: AxiosResponse) => {
  const { data } = response;

  if (data?.errors) {
    const message = data.errors[0] || "Erro inesperado";

    Toast.show({
      type: "error",
      text1: message,
    });

    throw new Error(message);
  }

  return response;
};

export const handleErrorResponse = async (error: AxiosError) => {
  if (error.response) {
    const status = error.response.status;
    const data: any = error.response.data;

    Toast.show({
      type: "error",
      text1: data?.message || "Erro na requisição",
    });

    if (status === 401 || status === 403) {
      await removeToken();
    }
  }

  return Promise.reject(error);
};

let isRefreshing = false;

httpClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !isRefreshing) {
      isRefreshing = true;

      const refreshToken = await getRefreshToken();

      try {
        const response = await httpClient.post("/refresh-token", {
          refreshToken,
        });

        await saveToken(response.data.accessToken);

        isRefreshing = false;

        // refaz request original
        error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return httpClient(error.config);
      } catch (err) {
        isRefreshing = false;
        throw err;
      }
    }

    return Promise.reject(error);
  },
);
