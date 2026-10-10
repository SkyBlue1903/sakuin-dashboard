"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/utils";

const Backdrop: React.FC = () => {
  const { isOpen, closeSidebar } = useSidebar();

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
