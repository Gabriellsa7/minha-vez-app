import { removeToken } from "@/src/services/auth/auth.storage";
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
  } else {
    Toast.show({
      type: "error",
      text1: "Nao foi possivel conectar ao servidor",
      text2: error.message,
    });
  }

  return Promise.reject(error);
};
