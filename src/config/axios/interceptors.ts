import { httpClient } from "@/src/services/api";
import { refreshAccessToken } from "@/src/services/auth/auth.session";
import {
  getRefreshToken,
  getToken,
  removeToken,
} from "@/src/services/auth/auth.storage";
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

type ApiErrorResponse = {
  message?: string;
};

const METHODS_WITH_OWN_ERROR_HANDLING = ["post", "put", "patch", "delete"];

const CONNECTION_ERROR_MESSAGE = "Não foi possível conectar ao servidor";
const CONNECTION_ERROR_HINT = "Verifique sua internet e tente novamente.";
const GENERIC_ERROR_MESSAGE =
  "Não foi possível concluir a ação. Tente novamente em instantes.";

export const handleSuccessResponse = async (response: AxiosResponse) => {
  const { data } = response;

  if (data?.errors) {
    const message = data.errors[0] || "Erro inesperado";
    const method = response.config?.method?.toLowerCase();
    const hasOwnErrorHandling =
      !!method && METHODS_WITH_OWN_ERROR_HANDLING.includes(method);

    if (!hasOwnErrorHandling) {
      Toast.show({
        type: "error",
        text1: message,
      });
    }

    throw new Error(message);
  }

  return response;
};

export const handleErrorResponse = async (
  error: AxiosError<ApiErrorResponse>,
) => {
  // The access token is short-lived: on a 401, refresh it once and retry the
  // request instead of signing the patient out.
  const config = error.config as
    | (InternalAxiosRequestConfig & { _retriedAfterRefresh?: boolean })
    | undefined;
  if (
    error.response?.status === 401 &&
    config &&
    !config._retriedAfterRefresh &&
    !config.url?.startsWith("/auth/") &&
    (await getRefreshToken())
  ) {
    config._retriedAfterRefresh = true;
    if (await refreshAccessToken()) return httpClient(config);
    router.replace("/login");
  }

  const method = error.config?.method?.toLowerCase();
  const hasOwnErrorHandling =
    !!method && METHODS_WITH_OWN_ERROR_HANDLING.includes(method);

  // Screens show error.message in their own toasts, so replace axios' technical
  // English text ("Network Error", "Request failed with status code 500").
  error.message = error.response
    ? error.response.data?.message || GENERIC_ERROR_MESSAGE
    : `${CONNECTION_ERROR_MESSAGE}. ${CONNECTION_ERROR_HINT}`;

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401 && !(await getToken())) {
      return Promise.reject(error);
    }

    if (!hasOwnErrorHandling) {
      Toast.show({
        type: "error",
        text1: data?.message || GENERIC_ERROR_MESSAGE,
      });
    }

    // A request sent with a token that was replaced meanwhile (e.g. refreshed on
    // app open) must not sign out the newer session.
    const sentToken = String(
      error.config?.headers?.Authorization ?? "",
    ).replace("Bearer ", "");
    if (
      (status === 401 || status === 403) &&
      (!sentToken || sentToken === (await getToken()))
    ) {
      await removeToken();
    }
  } else if (!hasOwnErrorHandling) {
    Toast.show({
      type: "error",
      text1: CONNECTION_ERROR_MESSAGE,
      text2: CONNECTION_ERROR_HINT,
    });
  }

  return Promise.reject(error);
};
