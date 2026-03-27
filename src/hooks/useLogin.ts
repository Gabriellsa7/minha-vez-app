import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";
import { login } from "../services/auth/auth.api";
import { saveRefreshToken, saveToken } from "../services/auth/auth.storage";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const data = await login(payload);

      if (!data?.accessToken) {
        throw new Error("Token inválido");
      }

      await saveToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);

      return data;
    },
    onSuccess: async () => {

      await queryClient.invalidateQueries({
        queryKey: ["GET_USER_ME_KEY"],
      });
    },
  });
};
