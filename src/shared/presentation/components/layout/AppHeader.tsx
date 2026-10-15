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
    <header className="flex h-16 w-full items-center border-b border-border-subtle bg-surface/85 backdrop-blur-2xl backdrop-saturate-[180%] shadow-ds-sm transition-colors">
      <div className="flex grow items-center justify-between px-4 py-2 md:px-6">
        {/* Left: Sidebar toggle + Active Menu Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-all cursor-pointer",
              isOpen && "bg-surface-secondary text-primary border-primary/30 shadow-2xs"
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
            <h1 className="text-xl font-bold tracking-tight text-text-primary transition-all select-none truncate">
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
                "hover:bg-surface-secondary active:scale-[0.98]",
                isUserMenuOpen && "bg-surface-secondary"
              )}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-text-inverse font-medium text-sm shadow-xs shrink-0">
                EA
              </div>
              <span className="hidden text-sm font-medium text-text-secondary md:block group-hover:text-text-primary transition-colors">
                Erlangga Anugrah Arifin
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-text-tertiary shrink-0 transition-transform duration-200",
                  isUserMenuOpen
                    ? "rotate-180 text-primary"
                    : "group-hover:text-text-secondary"
                )}
              />
            </button>

            {/* Floating Dropdown Menu (Same on Mobile & Desktop, like ThemeSwitcher) */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface p-1.5 shadow-ds-md z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-2 border-b border-border-subtle mb-1">
                  <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block">
                    Akun Pengguna
                  </span>
                  <span className="text-xs font-semibold text-text-primary block truncate mt-0.5">
                    Erlangga Anugrah Arifin
                  </span>
                  <span className="text-[11px] text-text-tertiary block truncate">
                    erlangga@sakuin.id
                  </span>
                </div>

                <div className="space-y-0.5">
                  {/* 1. Detail Profil */}
                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-md bg-surface-secondary text-text-secondary group-hover:bg-accent group-hover:text-primary transition-colors">
                      <UserCircle className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="leading-tight font-medium">Detail Profil</div>
                      <div className="text-[10px] text-text-tertiary">Kelola informasi akun</div>
                    </div>
                  </Link>

                  {/* 2. Keluar (Logout) */}
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-error hover:bg-error-bg transition-colors group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-md bg-error-bg text-error group-hover:bg-error-bg transition-colors">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="leading-tight font-medium">Keluar</div>
                      <div className="text-[10px] text-error/80">Keluar ke halaman login</div>
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
