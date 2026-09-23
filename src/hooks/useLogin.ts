import { useMutation } from "@tanstack/react-query";
import { USER_QUERY_KEYS } from "../api/query-groups";
import { invalidateQueryKeys } from "../helpers/react-query";
import { queryClient } from "../lib/react-query";
import { IAuthLogin, login } from "../services/auth/auth.api";
import { saveRefreshToken, saveToken } from "../services/auth/auth.storage";

export const useLogin = () => {
  return useMutation<Awaited<ReturnType<typeof login>>, Error, IAuthLogin>({
    mutationFn: async (payload: IAuthLogin) => {
      const data = await login(payload);

      if (!data?.accessToken) {
        throw new Error("Token inválido");
      }

      await saveToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);

      return data;
    },
    onSuccess: () => invalidateQueryKeys(queryClient, USER_QUERY_KEYS),
  });
};
