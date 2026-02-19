import { CheckCircle, XCircle, Info, X } from "lucide-react";
import type { Toast as ToastType } from "../../hooks/useToast";

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const toastIcons = {
  success: <CheckCircle size={18} className="text-green-600" />,
  error: <XCircle size={18} className="text-red-600" />,
  info: <Info size={18} className="text-blue-600" />,
};

const toastBorders = {
  success: "border-green-500",
  error: "border-red-500",
  info: "border-blue-500",
};

function ToastItem({ toast, onRemove }: ToastProps) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-md bg-white border-l-4 ${toastBorders[toast.type]}`}
    >
      {/* Icon */}
      <span className="mt-0.5">{toastIcons[toast.type]}</span>

      {/* Message */}
      <p className="text-sm text-gray-800 flex-1">
        {toast.message}
      </p>

      {/* Close */}
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-400 hover:text-gray-700 transition"
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
