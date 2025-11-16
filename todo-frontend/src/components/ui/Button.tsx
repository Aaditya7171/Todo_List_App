import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ className, variant = "primary", ...props }: Props) {
  const base = "px-4 py-2 rounded-md text-sm";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "border border-gray-300 text-gray-800 hover:bg-gray-50";
  return <button className={clsx(base, styles, className)} {...props} />;
}
