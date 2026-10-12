"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/utils";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastRemoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (toastRemoveTimeoutRef.current)
        clearTimeout(toastRemoveTimeoutRef.current);
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (toastRemoveTimeoutRef.current)
      clearTimeout(toastRemoveTimeoutRef.current);

    setToastMessage(msg);
    requestAnimationFrame(() => {
      setIsToastVisible(true);
    });

    toastTimeoutRef.current = setTimeout(() => {
      setIsToastVisible(false);
      toastRemoveTimeoutRef.current = setTimeout(() => {
        setToastMessage(null);
      }, 350);
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification with Fluid In & Out Animation */}
      {toastMessage && (
        <div
          className={cn(
            "fixed top-20 left-1/2 -translate-x-1/2 z-[100000] transition-all duration-300 ease-out transform pointer-events-auto",
            isToastVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-2 rounded-2xl bg-gray-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-gray-900 px-4 py-2.5 text-xs sm:text-sm font-medium shadow-2xl border border-white/10 dark:border-black/10">
            <Sparkles className="h-4 w-4 text-brand-400 dark:text-brand-600 shrink-0" />
            <span>{toastMessage}</span>
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
