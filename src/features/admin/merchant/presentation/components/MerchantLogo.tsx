"use client";

import React, { useState } from "react";
import { cn } from "@/shared/utils";
import { useOptionalTheme } from "@/shared/presentation/stores/useThemeStore";
import { getOptimizedImageUrl } from "@/shared/utils/imageOptimizer";

interface MerchantLogoProps {
  name: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: React.ReactNode;
}

export const MerchantLogo: React.FC<MerchantLogoProps> = ({
  name,
  logoUrl,
  logoDarkUrl,
  size = "md",
  className,
  fallback,
}) => {
  const themeContext = useOptionalTheme();
  const isDark = themeContext ? themeContext.theme === "dark" : false;

  const [darkError, setDarkError] = useState(false);
  const [lightError, setLightError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset error states during render when URLs or theme change
  const urlKey = `${logoUrl || ""}|${logoDarkUrl || ""}|${isDark ? "dark" : "light"}`;
  const [prevUrlKey, setPrevUrlKey] = useState(urlKey);
  if (prevUrlKey !== urlKey) {
    setPrevUrlKey(urlKey);
    setDarkError(false);
    setLightError(false);
    setIsLoaded(false);
  }

  const sizeClasses = {
    sm: "h-7 w-7 text-xs rounded-lg",
    md: "h-9 w-9 text-xs rounded-xl",
    lg: "h-11 w-11 text-sm rounded-2xl",
    xl: "h-14 w-14 text-base rounded-2xl",
  }[size];

  const firstLetter = (name.trim()[0] || "M").toUpperCase();

  const hasDarkOption = Boolean(isDark && logoDarkUrl && logoDarkUrl.trim());
  const currentUrl = hasDarkOption && !darkError ? logoDarkUrl!.trim() : (logoUrl?.trim() || "");
  const hasError = hasDarkOption && !darkError ? false : lightError;

  const handleImgError = () => {
    if (hasDarkOption && !darkError) {
      // Dark logo failed to load, fallback to standard logoUrl
      setDarkError(true);
      setIsLoaded(false);
    } else {
      setLightError(true);
    }
  };

  // If there's a valid currentUrl and no error loading it
  if (currentUrl && !hasError) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden border border-border-subtle bg-surface p-1 shadow-2xs transition-all",
          sizeClasses,
          className
        )}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-subtle text-[10px] font-bold text-foreground-muted">
            {firstLetter}
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentUrl}
          src={getOptimizedImageUrl(currentUrl, 160)}
          alt={name}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={handleImgError}
          className={cn(
            "h-full w-full object-contain transition-opacity duration-200",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    );
  }

  // Fallback provided by caller (e.g. CategoryIcon)
  if (fallback) {
    return <>{fallback}</>;
  }

  // Fallback: Initial letter with styled badge
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-bold tracking-tight select-none border border-border-subtle bg-surface-subtle text-foreground-secondary shadow-2xs",
        sizeClasses,
        className
      )}
      title={name}
    >
      {firstLetter}
    </div>
  );
};

export default MerchantLogo;
