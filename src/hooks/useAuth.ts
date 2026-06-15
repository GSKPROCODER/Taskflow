import { useMutation } from "@tanstack/react-query";

import {
  login,
  signup,
} from "../api/auth";

export function useAuth() {
  const loginMutation =
    useMutation({
      mutationFn: ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) =>
        login(
          email,
          password
        ),
    });

  const signupMutation =
    useMutation({
      mutationFn: ({
        name,
        email,
        password,
      }: {
        name: string;
        email: string;
        password: string;
      }) =>
        signup(
          name,
          email,
          password
        ),
    });

  return {
    login:
      loginMutation.mutate,

    signup:
      signupMutation.mutate,

    loginLoading:
      loginMutation.isPending,

    signupLoading:
      signupMutation.isPending,
  };
}