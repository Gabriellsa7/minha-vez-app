import axios from "axios";
import { Platform } from "react-native";

const defaultBaseURL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://192.168.0.19:3001";

export const httpClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || defaultBaseURL,
});
