import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth/auth.api";
import { saveRefreshToken, saveToken } from "../services/auth/auth.storage";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      if (!data?.accessToken) {
        throw new Error("Token inválido");
      }

      await saveToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);
    },
  });
};
