import { CheckCircle, XCircle, Info, X } from "lucide-react";
import type { Toast as ToastType } from "../../hooks/useToast";

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={18} className="text-success" />,
  error: <XCircle size={18} className="text-destructive" />,
  info: <Info size={18} className="text-primary" />,
};

const styles = {
  success: "border-l-4 border-success bg-card",
  error: "border-l-4 border-destructive bg-card",
  info: "border-l-4 border-primary bg-card",
};

function ToastItem({ toast, onRemove }: ToastProps) {
  return (
    <div
      className={[
        "flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg min-w-72 max-w-sm",
        styles[toast.type],
      ].join(" ")}
    >
      <span className="mt-0.5 shrink-0">{icons[toast.type]}</span>
      <p className="text-sm text-foreground flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-muted-foreground hover:text-foreground transition-colors"
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

// Conteneur positionné en bas à droite — à placer dans App.tsx
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
