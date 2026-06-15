import { api } from "./axios";
import type { User } from "../types/user";

export interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } =
    await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

  return data;
};

export const signup = async (
  name: string,
  email: string,
  password: string
) => {
  const { data } =
    await api.post(
      "/auth/signup",
      {
        name,
        email,
        password,
      }
    );

  return data;
};