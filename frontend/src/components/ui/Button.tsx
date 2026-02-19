import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;

  isLoading?: boolean;

  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:ring-primary",

  secondary:
    "bg-secondary text-secondary-foreground hover:bg-muted focus-visible:ring-primary",

  danger:
    "bg-destructive text-destructive-foreground hover:opacity-90 focus-visible:ring-destructive",

  ghost:
    "bg-transparent text-foreground hover:bg-muted focus-visible:ring-primary",

  outline:
    "bg-transparent border border-border text-foreground hover:bg-muted focus-visible:ring-primary",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-6 py-3 text-base rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",

  isLoading = false,
  loading = false,

  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const showLoader = isLoading || loading;

  return (
    <button
      disabled={disabled || showLoader}
      className={[
        "inline-flex items-center justify-center gap-2 font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {showLoader && (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}

      {children}
    </button>
  );
}
