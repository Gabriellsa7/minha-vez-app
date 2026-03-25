import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { login } from "../services/auth/auth.api";
import { saveToken } from "../services/auth/auth.storage";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await saveToken(data.token);

      router.replace("/home");
    },
  });
};
