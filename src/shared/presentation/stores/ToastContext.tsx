"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Sparkles, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastState {
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Global listener untuk memanggil toast dari luar komponen React (misal: Zustand stores / async handlers)
let globalToastEmitter: ((msg: string, type: ToastType) => void) | null = null;

export const emitToast = (message: string, type: ToastType = "success") => {
  if (globalToastEmitter) {
    globalToastEmitter(message, type);
  } else {
    console.warn(`[Toast] (${type}) ${message}`);
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastRemoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dismissToast = useCallback(() => {
    setIsToastVisible(false);
    if (toastRemoveTimeoutRef.current) clearTimeout(toastRemoveTimeoutRef.current);
    toastRemoveTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 350);
  }, []);

  const showToast = useCallback((msg: string, type: ToastType = "success") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (toastRemoveTimeoutRef.current) clearTimeout(toastRemoveTimeoutRef.current);

    setToast({ message: msg, type });
    requestAnimationFrame(() => {
      setIsToastVisible(true);
    });

    // Error toast tampil lebih lama agar user sempat membaca pesan errornya
    const duration = type === "error" ? 5500 : type === "info" ? 3500 : 2800;

    toastTimeoutRef.current = setTimeout(() => {
      dismissToast();
    }, duration);
  }, [dismissToast]);

  useEffect(() => {
    globalToastEmitter = showToast;
    return () => {
      globalToastEmitter = null;
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (toastRemoveTimeoutRef.current) clearTimeout(toastRemoveTimeoutRef.current);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification with Fluid In & Out Animation */}
      {toast && (
        <div
          role="alert"
          aria-live="assertive"
          className={cn(
            "fixed top-20 left-1/2 -translate-x-1/2 z-[100000] max-w-[90vw] sm:max-w-md w-auto transition-all duration-300 ease-out transform pointer-events-auto",
            isToastVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-2xl backdrop-blur-md px-4 py-2.5 text-xs sm:text-sm font-medium shadow-2xl border transition-all",
              toast.type === "error" &&
                "bg-rose-950/95 dark:bg-rose-950/95 text-rose-100 border-rose-500/40 shadow-rose-950/50",
              toast.type === "info" &&
                "bg-sky-950/95 dark:bg-sky-950/95 text-sky-100 border-sky-500/40 shadow-sky-950/50",
              toast.type === "success" &&
                "bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-900 border-white/10 dark:border-black/10"
            )}
          >
            {toast.type === "error" && (
              <AlertCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="h-4.5 w-4.5 text-sky-400 shrink-0" />
            )}
            {toast.type === "success" && (
              <Sparkles className="h-4 w-4 text-brand-400 dark:text-brand-600 shrink-0" />
            )}
            <span className="flex-1 break-words leading-tight">{toast.message}</span>
            <button
              type="button"
              onClick={dismissToast}
              aria-label="Tutup notifikasi"
              className={cn(
                "rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-1",
                toast.type === "error"
                  ? "text-rose-300 hover:bg-rose-800/60"
                  : toast.type === "info"
                  ? "text-sky-300 hover:bg-sky-800/60"
                  : "text-gray-400 hover:bg-white/10 dark:hover:bg-black/10"
              )}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastContext;
