"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/shared/utils";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";

export type ModalMaxWidth =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";

const MAX_WIDTH_MAP: Record<ModalMaxWidth, string> = {
  xs: "max-w-xs", // ~320px
  sm: "max-w-sm", // ~384px
  md: "max-w-md", // ~448px
  lg: "max-w-lg", // ~512px
  xl: "max-w-xl", // ~576px
  "2xl": "max-w-2xl", // ~672px
  "3xl": "max-w-3xl", // ~768px
  "4xl": "max-w-4xl", // ~896px
  "5xl": "max-w-5xl", // ~1024px
  full: "max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-3rem)]",
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: ModalMaxWidth;
  className?: string;
  backdropClassName?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  portal?: boolean;
}

/**
 * Reusable Centralized Modal Component
 *
 * Centralizes:
 * - Mobile & desktop scroll containment via `useLockBodyScroll`
 * - Touch & wheel boundary interceptor to eliminate scroll bleed
 * - Fixed backdrop styling with backdrop blur
 * - Escape key listener
 * - Backdrop click to close (optional, enabled by default)
 * - Entrance and exit animations
 * - Optional portal rendering via `portal={true}`
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = "lg",
  className,
  backdropClassName,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  portal = false,
}) => {
  // Centralized background scroll lock
  useLockBodyScroll(isOpen);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4",
        "bg-black/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-150",
        backdropClassName
      )}
    >
      <div
        className={cn(
          "relative w-full m-auto rounded-3xl bg-white dark:bg-gray-900 shadow-2xl",
          "border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200",
          MAX_WIDTH_MAP[maxWidth],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  if (portal && mounted && typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};


export interface ModalHeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  title,
  subtitle,
  icon,
  onClose,
  className,
}) => {
  if (children) {
    return (
      <div
        className={cn(
          "flex items-center justify-between px-6 py-4.5 border-b border-gray-100 dark:border-gray-800 shrink-0",
          className
        )}
      >
        {children}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors shrink-0 ml-auto"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4.5 border-b border-gray-100 dark:border-gray-800 shrink-0",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0 pr-4">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          {title && (
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors shrink-0"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto overscroll-contain p-6 space-y-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 px-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/30 shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Modal;
