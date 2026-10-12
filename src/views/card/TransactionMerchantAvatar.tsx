"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/utils";
import { getOptimizedImageUrl } from "@/utils/imageOptimizer";
import type { CategoryItem } from "@/models/category";
import CategoryIcon from "@/views/admin/CategoryIcon";
import { useOptionalTheme } from "@/stores/useThemeStore";

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

  const [merchantLoaded, setMerchantLoaded] = useState(false);
  const [merchantError, setMerchantError] = useState(false);
  const [categoryLoaded, setCategoryLoaded] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  // Determine active merchant logo URL based on theme
  const hasDarkOption = Boolean(isDark && logoDarkUrl && logoDarkUrl.trim());
  const activeMerchantUrl = (
    hasDarkOption && !merchantError
      ? logoDarkUrl!.trim()
      : (logoUrl?.trim() || "")
  );

  // Reset error & loaded states when relevant props change
  useEffect(() => {
    setMerchantLoaded(false);
    setMerchantError(false);
    setCategoryLoaded(false);
    setCategoryError(false);
  }, [activeMerchantUrl, category?.id, category?.iconSrc, isDark]);

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
        "flex shrink-0 items-center justify-center font-bold tracking-tight select-none border border-gray-200/80 dark:border-gray-800 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 dark:from-gray-800 dark:to-gray-850 dark:text-gray-200 shadow-2xs transition-all",
        isLoadingState && "animate-pulse",
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
          "relative flex shrink-0 items-center justify-center overflow-hidden border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-1 shadow-2xs transition-all",
          sizeClasses,
          className
        )}
      >
        {/* Sambil memuat logo merchant, tampilkan inisial nama merchant */}
        {!merchantLoaded && (
          <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 animate-pulse">
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
          onLoad={() => setMerchantLoaded(true)}
          onError={() => {
            if (hasDarkOption && !merchantError) {
              // Jika dark logo gagal, MerchantLogo logic bisa coba light
              setMerchantError(true);
            } else {
              setMerchantError(true);
            }
          }}
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
            "relative flex shrink-0 items-center justify-center overflow-hidden border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs transition-all",
            sizeClasses,
            className
          )}
        >
          {/* Sambil download/load gambar/ilustrasi kategori -> tampilkan inisial merchant */}
          {!categoryLoaded && (
            <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-850 animate-pulse">
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
            onLoad={() => setCategoryLoaded(true)}
            onError={() => setCategoryError(true)}
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
