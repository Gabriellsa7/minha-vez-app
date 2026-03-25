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
  try {
    await httpClient.post(path, { email, name, password });
  } catch (error) {
    throw error;
  }
};

export const useSignup = generateReactQueryMutation<void, ICreateUser>(
  SIGNUP_KEY,
  signup,
);
