import axios from "axios";

export const httpClient = axios.create({
  baseURL: "http://10.0.2.2:3001", //android
  //baseURL: "http://localhost:3001" //web and IOS
});
