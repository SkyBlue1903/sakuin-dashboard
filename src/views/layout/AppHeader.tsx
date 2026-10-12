"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSidebar } from "@/stores/useSidebarStore";
import ThemeSwitcher from "@/views/common/ThemeSwitcher";
import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import { cn } from "@/utils";

export const AppHeader: React.FC = () => {
  const { isOpen, toggleSidebar, activeTitle } = useSidebar();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    toggleSidebar();
  };

  // Close user menu on outside click (Desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Close user menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUserMenuOpen]);

  return (
    <header className="flex h-16 w-full items-center border-b border-black/[0.06] dark:border-white/[0.08] bg-white/65 dark:bg-gray-950/65 backdrop-blur-2xl backdrop-saturate-[180%] shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-colors">
      <div className="flex grow items-center justify-between px-4 py-2 md:px-6">
        {/* Left: Sidebar toggle + Active Menu Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-all cursor-pointer",
              isOpen && "bg-gray-100 dark:bg-white/10 text-brand-600 dark:text-brand-400 border-brand-300 dark:border-brand-700 shadow-xs"
            )}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-all select-none truncate">
              {activeTitle || "SakuCard"}
            </h1>
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher (Light / Dark / System) */}
          <ThemeSwitcher />

          {/* User Profile Area with Pop up */}
          <div className="relative pl-1 sm:pl-2" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className={cn(
                "group flex items-center gap-2 sm:gap-2.5 py-1 px-1.5 sm:px-2 rounded-xl transition-all cursor-pointer select-none",
                "hover:bg-gray-100 dark:hover:bg-white/5 active:scale-[0.98]",
                isUserMenuOpen && "bg-gray-100 dark:bg-white/10"
              )}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <div className="h-9 w-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-medium text-sm shadow-xs shrink-0">
                EA
              </div>
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 md:block group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                Erlangga Anugrah Arifin
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200",
                  isUserMenuOpen
                    ? "rotate-180 text-brand-500"
                    : "group-hover:text-gray-600 dark:group-hover:text-gray-300"
                )}
              />
            </button>

            {/* Floating Dropdown Menu (Same on Mobile & Desktop, like ThemeSwitcher) */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-2 border-b border-gray-100 dark:border-gray-800/80 mb-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Akun Pengguna
                  </span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block truncate mt-0.5">
                    Erlangga Anugrah Arifin
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 block truncate">
                    erlangga@sakuin.id
                  </span>
                </div>

                <div className="space-y-0.5">
                  {/* 1. Detail Profil */}
                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 transition-colors">
                      <UserCircle className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="leading-tight font-medium">Detail Profil</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500">Kelola informasi akun</div>
                    </div>
                  </Link>

                  {/* 2. Keluar (Logout) */}
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-md bg-red-100/70 text-red-600 dark:bg-red-900/40 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/60 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="leading-tight font-medium">Keluar</div>
                      <div className="text-[10px] text-red-400/80 dark:text-red-400/70">Keluar ke halaman login</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
