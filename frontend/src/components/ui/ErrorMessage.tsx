import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <AlertCircle size={34} className="text-red-500" />

      <p className="text-sm font-medium text-red-600">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-blue-600 hover:underline"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
