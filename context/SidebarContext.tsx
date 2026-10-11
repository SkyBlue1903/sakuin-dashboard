"use client";

import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const ROUTE_TITLE_MAP: Record<string, string> = {
  "/card": "SakuCard",
  "/info": "Informasi",
  "/guides": "Panduan",
  "/panduan": "Panduan",
  "/promo": "Promo",
  "/admin/info": "Informasi",
  "/admin/guides": "Panduan",
  "/admin/panduan": "Panduan",
  "/admin/promo": "Promo",
  "/profile": "Detail Profil",
  "/customers": "Customer List",
  "/customer-list": "Customer List",
  "/calendar": "Calendar",
  "/form-elements": "Form Elements",
  "/basic-tables": "Basic Tables",
  "/blank": "Blank Page",
  "/error-404": "404 Error",
  "/login": "Login",
  "/admin/merchant": "Kategori Merchant",
  "/": "SakuCard",
};

type SidebarContextType = {
  isOpen: boolean;
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  activeTitle: string;
  openSubmenu: string | null;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  setActiveTitle: (title: string) => void;
  toggleSubmenu: (item: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>(() => {
    return ROUTE_TITLE_MAP[pathname] || "SakuCard";
  });

  // Close sidebar and sync title on route change
  useEffect(() => {
    setIsOpen(false);
    if (ROUTE_TITLE_MAP[pathname]) {
      setActiveTitle((prev) => {
        if (pathname === "/profile" && prev === "Customer List") {
          return prev;
        }
        return ROUTE_TITLE_MAP[pathname];
      });
    }
  }, [pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const toggleMobileSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleSubmenu = (item: string) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isExpanded: isOpen,
        isMobileOpen: isOpen,
        isHovered,
        activeItem,
        activeTitle,
        openSubmenu,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        setActiveTitle,
        toggleSubmenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
