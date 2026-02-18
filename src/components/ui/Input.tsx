import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className = "", id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full px-3 py-2 rounded-md border bg-card text-foreground",
          "placeholder:text-muted-foreground text-sm",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          error ? "border-destructive focus:ring-destructive" : "border-border",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
