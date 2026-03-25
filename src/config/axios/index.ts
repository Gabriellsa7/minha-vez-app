import { httpClient } from "@/src/services/api";
import { getToken } from "@/src/services/auth/auth.storage";
import { handleErrorResponse, handleSuccessResponse } from "./interceptors";

httpClient.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// interceptors
httpClient.interceptors.response.use(
  handleSuccessResponse,
  handleErrorResponse,
);
