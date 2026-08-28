import { getToken, removeToken } from "@/src/services/auth/auth.storage";
import { AxiosError, AxiosResponse } from "axios";
import Toast from "react-native-toast-message";

type ApiErrorResponse = {
  message?: string;
};

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

export const handleErrorResponse = async (error: AxiosError<ApiErrorResponse>) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401 && !(await getToken())) {
      return Promise.reject(error);
    }

    Toast.show({
      type: "error",
      text1: data?.message || "Erro na requisição",
    });

    if (status === 401 || status === 403) {
      await removeToken();
    }
  } else {
    Toast.show({
      type: "error",
      text1: "Nao foi possivel conectar ao servidor",
      text2: error.message,
    });
  }

  return Promise.reject(error);
};
