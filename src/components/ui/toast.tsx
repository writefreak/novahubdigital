"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ToastMessage = {
  id: string;
  type: "success" | "error";
  text: string;
};

type ToastContextType = {
  showToast: (type: "success" | "error", text: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined,
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const showToast = React.useCallback(
    (type: "success" | "error", text: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, text }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    [],
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Container: Top-centered on mobile, Bottom-right on desktop */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:top-auto sm:left-auto sm:bottom-4 sm:right-4 z-50 flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-full max-w-xs sm:max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between px-3 py-3 sm:p-4 rounded-lg shadow-md sm:shadow-lg border transition-all duration-300 bg-white/60 backdrop-blur ${
              toast.type === "error"
                ? "border-destructive text-destructive"
                : "border-border text-foreground"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {toast.type === "error" ? (
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-emerald-500" />
              )}
              <p className="text-xs sm:text-sm font-medium truncate">
                {toast.text}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground p-0.5 sm:p-1 shrink-0"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
