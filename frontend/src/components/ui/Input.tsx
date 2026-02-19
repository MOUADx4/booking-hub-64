import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {/* Input */}
      <input
        id={inputId}
        className={`w-full px-3 py-2 rounded-md border text-sm
          bg-white text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}`}
        {...props}
      />

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 font-medium">
          {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}
