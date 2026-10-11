"use client";

import React, { useState } from "react";
import { Store } from "lucide-react";
import { cn } from "@/utils";

interface MerchantLogoProps {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: React.ReactNode;
}

export const MerchantLogo: React.FC<MerchantLogoProps> = ({
  name,
  logoUrl,
  size = "md",
  className,
  fallback,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset error state when logoUrl changes
  React.useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [logoUrl]);

  const sizeClasses = {
    sm: "h-7 w-7 text-xs rounded-lg",
    md: "h-9 w-9 text-xs rounded-xl",
    lg: "h-11 w-11 text-sm rounded-2xl",
    xl: "h-14 w-14 text-base rounded-2xl",
  }[size];

  const firstLetter = (name.trim()[0] || "M").toUpperCase();

  // If there's a valid logoUrl and no error loading it
  if (logoUrl && logoUrl.trim() && !hasError) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-1 shadow-2xs transition-all",
          sizeClasses,
          className
        )}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse text-[10px] font-bold text-gray-400">
            {firstLetter}
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={name}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
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
        "flex shrink-0 items-center justify-center font-bold tracking-tight select-none border border-gray-200/80 dark:border-gray-800 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 dark:from-gray-800 dark:to-gray-850 dark:text-gray-200 shadow-2xs",
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
