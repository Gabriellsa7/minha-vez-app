import { getToken, removeToken } from "@/src/services/auth/auth.storage";
import { AxiosError, AxiosResponse } from "axios";
import Toast from "react-native-toast-message";

type ApiErrorResponse = {
  message?: string;
};

// Mutating requests (POST/PUT/PATCH/DELETE) are always user-triggered
// actions whose caller already shows its own specific error toast via
// react-query's onError (see e.g. use-appointment-booking.ts) — letting the
// interceptor also toast here just stacks a second, generic card behind/on
// top of that one, which react-native-toast-message renders as a glitchy,
// text-less card frozen until manually dismissed. Only GET requests
// (background reads with no per-call error handling) still get this
// fallback toast.
const METHODS_WITH_OWN_ERROR_HANDLING = ["post", "put", "patch", "delete"];

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

export const handleErrorResponse = async (error: AxiosError<ApiErrorResponse>) => {
  const method = error.config?.method?.toLowerCase();
  const hasOwnErrorHandling =
    !!method && METHODS_WITH_OWN_ERROR_HANDLING.includes(method);

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401 && !(await getToken())) {
      return Promise.reject(error);
    }

    if (!hasOwnErrorHandling) {
      Toast.show({
        type: "error",
        text1: data?.message || "Erro na requisição",
      });
    }

    if (status === 401 || status === 403) {
      await removeToken();
    }
  } else if (!hasOwnErrorHandling) {
    Toast.show({
      type: "error",
      text1: "Nao foi possivel conectar ao servidor",
      text2: error.message,
    });
  }

  return Promise.reject(error);
};
