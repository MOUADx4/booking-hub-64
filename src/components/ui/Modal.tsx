import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Modal accessible avec fermeture au clavier (Escape) et clic en dehors
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenu */}
      <div className="relative z-10 w-full max-w-md bg-card rounded-xl border border-border shadow-lg">
        <div className="flex items-center justify-between p-5 border-b border-border">
          {title && <h2 className="text-base font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
