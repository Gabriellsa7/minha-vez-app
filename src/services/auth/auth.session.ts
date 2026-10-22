import axios, { isAxiosError } from "axios";
import { httpClient } from "../api";
import {
  getRefreshToken,
  getToken,
  removeToken,
  saveRefreshToken,
  saveToken,
} from "./auth.storage";

interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

let pendingRefresh: Promise<string | null> | null = null;

const isTokenExpired = (token: string) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const { exp } = JSON.parse(atob(padded));
    return typeof exp !== "number" || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

// Trades the refresh token for a new token pair and returns the new access token.
// Requests that fail together share a single refresh call. It uses plain axios so
// a failed refresh does not go through the 401 handling of httpClient again.
export const refreshAccessToken = () => {
  pendingRefresh ??= (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await axios.post<IAuthTokens>(
        `${httpClient.defaults.baseURL}/auth/refresh`,
        { refreshToken },
      );
      await saveToken(response.data.accessToken);
      await saveRefreshToken(response.data.refreshToken);
      return response.data.accessToken;
    } catch (error) {
      if (isAxiosError(error) && error.response) await removeToken();
      return null;
    }
  })().finally(() => {
    pendingRefresh = null;
  });

  return pendingRefresh;
};

// Keeps the patient signed in between app launches: reuses a still-valid access
// token, or refreshes it.
export const restoreSession = async () => {
  const accessToken = await getToken();
  if (accessToken && !isTokenExpired(accessToken)) return true;

  return Boolean(await refreshAccessToken());
};
