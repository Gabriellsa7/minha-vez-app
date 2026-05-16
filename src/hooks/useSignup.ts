import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const SIGNUP_KEY = "SIGNUP_KEY";

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export const signup = async ({
  email,
  name,
  password,
}: ICreateUser): Promise<void> => {
  const path = "/users";

  console.log("ENVIANDO:");
  console.log({ email, name, password });
  try {
    const response = await httpClient.post(path, {
      email,
      name,
      password,
    });

    console.log("RESPOSTA BACK:");
    console.log(response.data);
  } catch (error) {
    console.log("ERRO AXIOS:");
    console.log(error.response?.data);
    console.log(error.message);
    throw error;
  }
};

export const useSignup = generateReactQueryMutation<void, ICreateUser>(
  SIGNUP_KEY,
  signup,
);
