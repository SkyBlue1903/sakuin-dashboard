"use client";

import React, { useRef } from "react";
import { useSidebar } from "@/context/SidebarContext";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import Image from "next/image";

export const AppHeader: React.FC = () => {
  const { isMobileOpen, isExpanded, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1280) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 z-40 flex w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex grow items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Sidebar toggle + Search */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
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

          {/* Search bar mockup matching screenshot */}
          <div className="relative hidden sm:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search or type command..."
              className="h-10 w-72 rounded-lg border border-gray-200 bg-transparent pl-10 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none dark:border-gray-800 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-800">
                ⌘ K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher (Light / Dark / System) */}
          <ThemeSwitcher />

          {/* Notification Mockup */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-500" />
          </div>

          {/* User Profile Avatar Mockup */}
          <div className="flex items-center gap-3 pl-2">
            <div className="h-9 w-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-medium text-sm">
              E
            </div>
            <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 md:block">
              Erlangga Anugrah Arifin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
