<<<<<<< HEAD
// SignupPage (PRD §9, FR-AUTH-01). Implementation lands in Phase 1.
export function SignupPage() {
  return <div>Sign up</div>;
}
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/ui/input";
import Button from "../../components/ui/button";

import { useAuth } from "../../hooks/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();

  const { signup, signupLoading } =
    useAuth();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    signup({
      name,
      email,
      password,
    });

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Create Account
        </h1>

        <Input
          label="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <Input
          label="Email"
          type="email"
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
          loading={signupLoading}
          className="w-full"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}
>>>>>>> faiz
