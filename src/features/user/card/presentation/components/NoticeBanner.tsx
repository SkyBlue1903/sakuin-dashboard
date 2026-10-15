"use client";

import React, { useState } from "react";
import { AlertCircle, Info, AlertOctagon, X } from "lucide-react";
import { cn } from "@/shared/utils";

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
    warning: {
      container:
        "bg-warning-bg/80 border-warning-border text-warning dark:bg-warning-bg/30 dark:border-warning-border",
      icon: "text-warning",
      title: "text-warning font-semibold",
      message: "text-warning/90 dark:text-warning",
      closeBtn:
        "text-warning/70 hover:text-warning hover:bg-warning/10",
      IconComponent: AlertCircle,
    },
    info: {
      container:
        "bg-info-bg/75 border-info-border text-info dark:bg-info-bg/30 dark:border-info-border",
      icon: "text-info",
      title: "text-info font-semibold",
      message: "text-info/90 dark:text-info",
      closeBtn:
        "text-info/70 hover:text-info hover:bg-info/10",
      IconComponent: Info,
    },
    danger: {
      container:
        "bg-error-bg/75 border-error-border text-error dark:bg-error-bg/30 dark:border-error-border",
      icon: "text-error",
      title: "text-error font-semibold",
      message: "text-error/90 dark:text-error",
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
