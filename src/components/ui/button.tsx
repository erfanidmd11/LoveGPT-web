import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  className = "",
  children,
  variant = "primary",
  ...props
}) => {
  const base = "px-4 py-2 rounded-xl transition-all";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-100",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
