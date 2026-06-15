<<<<<<< HEAD
// LoginPage (PRD §9, FR-AUTH-02). Implementation lands in Phase 1.
export function LoginPage() {
  return <div>Login</div>;
}
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/ui/input";
import Button from "../../components/ui/button";

import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login, loginLoading } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    login(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        <Input
          label="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Button
          type="submit"
          loading={loginLoading}
          className="w-full"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
>>>>>>> faiz
