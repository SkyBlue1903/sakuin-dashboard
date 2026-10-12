"use client";

import React, { useState } from "react";
import { AlertCircle, Info, AlertOctagon, X } from "lucide-react";
import { cn } from "@/utils";

export type BannerVariant = "warning" | "info" | "danger";

export interface NoticeBannerProps {
  /**
   * Pengondisian tipe banner:
   * - "warning" (kuning): Peringatan yang bisa dihilangkan (ada tombol X)
   * - "info" (biru): Informasi yang bisa dihilangkan (ada tombol X)
   * - "danger" (merah): Peringatan yang tidak bisa dihilangkan (tanpa tombol X)
   */
  variant?: BannerVariant;
  title?: string;
  message?: React.ReactNode;
  dismissible?: boolean; // Override opsional: default true untuk warning & info, false untuk danger
  onDismiss?: () => void;
  className?: string;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({
  variant = "warning",
  title = "Pemberitahuan",
  message = "Ini adalah papan informasi yang bisa dihilangkan",
  dismissible,
  onDismiss,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Merah (danger) tidak bisa dihilangkan secara default; Kuning (warning) & Biru (info) bisa dihilangkan
  const isDismissible =
    dismissible !== undefined ? dismissible : variant !== "danger";

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 200);
  };

  if (!isVisible) return null;

  const variantStyles = {
    // Kuning: Peringatan yang bisa dihilangkan
    warning: {
      container:
        "bg-warning-50/90 dark:bg-warning-950/25 border-warning-200/80 dark:border-warning-800/50 text-warning-900 dark:text-warning-200",
      icon: "text-warning-600 dark:text-warning-400",
      title: "text-warning-900 dark:text-warning-300",
      message: "text-warning-700 dark:text-warning-400",
      closeBtn:
        "text-warning-600 dark:text-warning-400 hover:text-warning-900 dark:hover:text-warning-200 hover:bg-warning-100/80 dark:hover:bg-warning-900/40",
      IconComponent: AlertCircle,
    },
    // Biru: Informasi yang bisa dihilangkan
    info: {
      container:
        "bg-blue-light-50/90 dark:bg-blue-light-950/25 border-blue-light-200/80 dark:border-blue-light-800/50 text-blue-light-900 dark:text-blue-light-200",
      icon: "text-blue-light-600 dark:text-blue-light-400",
      title: "text-blue-light-900 dark:text-blue-light-300",
      message: "text-blue-light-700 dark:text-blue-light-400",
      closeBtn:
        "text-blue-light-600 dark:text-blue-light-400 hover:text-blue-light-900 dark:hover:text-blue-light-200 hover:bg-blue-light-100/80 dark:hover:bg-blue-light-900/40",
      IconComponent: Info,
    },
    // Merah: Peringatan yang tidak bisa dihilangkan
    danger: {
      container:
        "bg-error-50/90 dark:bg-error-950/25 border-error-200/80 dark:border-error-800/50 text-error-900 dark:text-error-200",
      icon: "text-error-600 dark:text-error-400",
      title: "text-error-900 dark:text-error-300",
      message: "text-error-700 dark:text-error-400",
      closeBtn: "",
      IconComponent: AlertOctagon,
    },
  };

  const style = variantStyles[variant] || variantStyles.warning;
  const { IconComponent } = style;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-2xl p-4 border shadow-2xs transition-all duration-200",
        style.container,
        isClosing && "opacity-0 -translate-y-2 scale-98 pointer-events-none",
        className
      )}
      role="alert"
    >
      <IconComponent className={cn("h-5 w-5 shrink-0 mt-0.5", style.icon)} />

      <div className={cn("text-xs sm:text-sm flex-1 min-w-0", isDismissible && "pr-6")}>
        <p className={cn("font-semibold leading-tight", style.title)}>{title}</p>
        <div className={cn("mt-0.5 leading-relaxed text-xs sm:text-[13px]", style.message)}>
          {message}
        </div>
      </div>

      {/* Tombol Silang (X) di pojok kanan atas - hanya tampil jika bisa dihilangkan */}
      {isDismissible && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup pemberitahuan"
          title="Tutup pemberitahuan"
          className={cn(
            "absolute top-3 right-3 p-1 rounded-xl transition-all cursor-pointer active:scale-95",
            style.closeBtn
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default NoticeBanner;
