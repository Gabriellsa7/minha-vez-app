import * as SecureStore from "expo-secure-store";

export const saveToken = (token: string) =>
  SecureStore.setItemAsync("accessToken", token);

export const getToken = () => SecureStore.getItemAsync("accessToken");

export const saveRefreshToken = (token: string) =>
  SecureStore.setItemAsync("refreshToken", token);

export const getRefreshToken = () => SecureStore.getItemAsync("refreshToken");

export const removeToken = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};
