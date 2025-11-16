import React from "react";
import clsx from "clsx";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ className, label, id, ...props }: Props) {
  const input = (
    <input
      id={id}
      className={clsx(
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder:opacity-60",
        className
      )}
      {...props}
    />
  );
  if (!label) return input;
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={id}>
      <span className="text-gray-700">{label}</span>
      {input}
    </label>
  );
}
