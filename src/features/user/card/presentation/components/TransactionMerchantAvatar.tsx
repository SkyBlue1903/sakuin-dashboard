"use client";

import React, { useState } from "react";
import { cn } from "@/shared/utils";
import { getOptimizedImageUrl } from "@/shared/utils/imageOptimizer";
import type { CategoryItem } from "@/features/admin/merchant/domain/category";
import CategoryIcon from "@/features/admin/merchant/presentation/components/CategoryIcon";
import { useOptionalTheme } from "@/shared/presentation/stores/useThemeStore";

export interface TransactionMerchantAvatarProps {
  merchantName: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  category?: CategoryItem | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * Avatar for transaction items:
 * 1. Priority 1: Merchant logo (if available). While loading merchant logo, displays merchant initial.
 * 2. Priority 2: Category logo/illustration/icon (if merchant has no logo or logo fails to load).
 *    While downloading/loading the category illustration/image, displays merchant initial.
 * 3. Priority 3: Merchant initial badge (if no matching category is found or category image fails).
 */
export const TransactionMerchantAvatar: React.FC<TransactionMerchantAvatarProps> = ({
  merchantName,
  logoUrl,
  logoDarkUrl,
  category,
  size = "lg",
  className,
}) => {
  const themeContext = useOptionalTheme();
  const isDark = themeContext ? themeContext.theme === "dark" : false;

  const [loadedMerchantUrl, setLoadedMerchantUrl] = useState<string | null>(null);
  const [errorMerchantUrl, setErrorMerchantUrl] = useState<string | null>(null);
  const [loadedCategorySrc, setLoadedCategorySrc] = useState<string | null>(null);
  const [errorCategorySrc, setErrorCategorySrc] = useState<string | null>(null);

  // Determine active merchant logo URL based on theme
  const hasDarkOption = Boolean(isDark && logoDarkUrl && logoDarkUrl.trim());
  const activeMerchantUrl = (
    hasDarkOption && errorMerchantUrl !== logoDarkUrl?.trim()
      ? logoDarkUrl!.trim()
      : (logoUrl?.trim() || "")
  );

  const merchantLoaded = loadedMerchantUrl === activeMerchantUrl;
  const merchantError = errorMerchantUrl === activeMerchantUrl;
  const categoryLoaded = loadedCategorySrc === (category?.iconSrc || null);
  const categoryError = errorCategorySrc === (category?.iconSrc || null);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs rounded-xl",
    md: "h-9 w-9 text-xs rounded-xl",
    lg: "h-11 w-11 text-sm rounded-2xl",
    xl: "h-14 w-14 text-base rounded-2xl",
  }[size];

  const firstLetter = (merchantName.trim()[0] || "M").toUpperCase();

  // Helper to render styled Merchant Initial Badge
  const renderInitialBadge = (isLoadingState: boolean = false) => (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-bold tracking-tight select-none border border-border-subtle bg-surface-subtle text-foreground-secondary shadow-2xs transition-all",
        sizeClasses,
        className
      )}
      title={isLoadingState ? `${merchantName} (Memuat...)` : merchantName}
    >
      <span>{firstLetter}</span>
    </div>
  );

  // 1. Merchant has a Logo URL and it hasn't errored
  if (activeMerchantUrl && !merchantError) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden border border-border-subtle bg-surface p-1 shadow-2xs transition-all",
          sizeClasses,
          className
        )}
      >
        {/* Sambil memuat logo merchant, tampilkan inisial nama merchant */}
        {!merchantLoaded && (
          <div className="absolute inset-0 flex items-center justify-center font-bold text-foreground-muted bg-surface-subtle">
            {firstLetter}
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activeMerchantUrl}
          src={getOptimizedImageUrl(activeMerchantUrl, 160)}
          alt={merchantName}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoadedMerchantUrl(activeMerchantUrl)}
          onError={() => setErrorMerchantUrl(activeMerchantUrl)}
          className={cn(
            "h-full w-full object-contain transition-opacity duration-200",
            merchantLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    );
  }

  // 2. Merchant TIDAK punya gambar (atau gagal load) -> Fallback ke Kategori
  if (category) {
    // 2a. Kategori dengan gambar/ilustrasi (iconType === "image")
    if (category.iconType === "image" && category.iconSrc && !categoryError) {
      return (
        <div
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden border border-border-subtle bg-surface shadow-2xs transition-all",
            sizeClasses,
            className
          )}
        >
          {/* Sambil download/load gambar/ilustrasi kategori -> tampilkan inisial merchant */}
          {!categoryLoaded && (
            <div className="absolute inset-0 flex items-center justify-center font-bold text-foreground-secondary bg-surface-subtle">
              {firstLetter}
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={category.iconSrc}
            src={getOptimizedImageUrl(category.iconSrc, 160)}
            alt={category.name || "Kategori"}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoadedCategorySrc(category.iconSrc || null)}
            onError={() => setErrorCategorySrc(category.iconSrc || null)}
            className={cn(
              "h-full w-full object-contain p-1.5 transition-opacity duration-200",
              categoryLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      );
    }

    // 2b. Kategori dengan icon bawaan Lucide
    return (
      <CategoryIcon
        iconType={category.iconType || "lucide"}
        iconName={category.iconName}
        iconSrc={category.iconSrc}
        color={category.color}
        size={size === "xl" ? "lg" : size === "lg" ? "md" : "sm"}
        className={cn(sizeClasses, className)}
      />
    );
  }

  // 3. Tidak ada kategori yang cocok -> Tampilkan inisial merchant
  return renderInitialBadge(false);
};

export default TransactionMerchantAvatar;
