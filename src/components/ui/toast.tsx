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
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-lg shadow-lg border transition-all duration-300 bg-background ${
              toast.type === "error"
                ? "border-destructive text-destructive"
                : "border-border text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "error" ? (
                <AlertCircle className="h-5 w-5 shrink-0" />
              ) : (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
              )}
              <p className="text-sm font-medium">{toast.text}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-4 w-4" />
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
