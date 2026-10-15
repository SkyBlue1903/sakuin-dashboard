"use client";

import React from "react";
import { useSidebar } from "@/stores/useSidebarStore";
import { cn } from "@/utils";
import { useLockBodyScroll } from "@/controllers/useLockBodyScroll";

const Backdrop: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar();

  // Lock background scroll when mobile sidebar drawer is open
  useLockBodyScroll(isOpen);

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 bg-black/50 dark:bg-black/75 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out cursor-pointer",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      onClick={closeSidebar}
      aria-hidden="true"
    />
  );
};

export default Backdrop;
