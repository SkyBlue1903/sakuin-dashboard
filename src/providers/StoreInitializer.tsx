"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/stores/useThemeStore";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { usePromoStore } from "@/stores/usePromoStore";
import { useCategoryStore } from "@/stores/useCategoryStore";

export default function StoreInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const initTheme = useThemeStore((s) => s.initTheme);
  const syncRoute = useSidebarStore((s) => s.syncRoute);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);
  const initPromos = usePromoStore((s) => s.initPromos);
  const initCategories = useCategoryStore((s) => s.initCategories);

  // Initialize persistent stores on client mount
  useEffect(() => {
    initTheme();
    initPromos();
    initCategories();
  }, [initTheme, initPromos, initCategories]);

  // Sync route and close sidebar on route navigation
  useEffect(() => {
    syncRoute(pathname);
  }, [pathname, syncRoute]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSidebar]);

  return <>{children}</>;
}
