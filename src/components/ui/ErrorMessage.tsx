import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <AlertCircle size={36} className="text-destructive" />
      <p className="text-sm text-destructive font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-primary underline underline-offset-2 hover:no-underline"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
