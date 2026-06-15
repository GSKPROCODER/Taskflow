import React from "react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-900",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={`
        px-4 py-2 rounded-lg
        font-medium
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}