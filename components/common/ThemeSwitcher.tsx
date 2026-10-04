"use client";

import React, { useEffect, useRef, useState } from "react";
import { ThemeMode, useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils";

export const ThemeSwitcher: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const options: {
    mode: ThemeMode;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      mode: "light",
      label: "Terang",
      description: "",
      icon: (
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 1.667v1.666M10 16.667v1.666M3.333 10H1.667M18.333 10h-1.666M4.107 4.108l1.179 1.178M14.714 14.714l1.179 1.179M4.107 15.892l1.179-1.178M14.714 5.286l1.179-1.179M10 14.167a4.167 4.167 0 100-8.334 4.167 4.167 0 000 8.334z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      mode: "dark",
      label: "Gelap",
      description: "",
      icon: (
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.5 10.79A7.5 7.5 0 119.21 2.5a6 6 0 008.29 8.29z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      mode: "system",
      label: "Sistem",
      description: "Ikuti Perangkat",
      icon: (
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.333 4.167h13.334c.92 0 1.666.746 1.666 1.666v7.5c0 .92-.746 1.667-1.666 1.667H3.333c-.92 0-1.666-.747-1.666-1.667v-7.5c0-.92.746-1.666 1.666-1.666zM6.667 17.5h6.666M10 15v2.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const currentIcon =
    themeMode === "system" ? (
      <svg
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.333 4.167h13.334c.92 0 1.666.746 1.666 1.666v7.5c0 .92-.746 1.667-1.666 1.667H3.333c-.92 0-1.666-.747-1.666-1.667v-7.5c0-.92.746-1.666 1.666-1.666zM6.667 17.5h6.666M10 15v2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : theme === "dark" ? (
      <svg
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.5 10.79A7.5 7.5 0 119.21 2.5a6 6 0 008.29 8.29z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 1.667v1.666M10 16.667v1.666M3.333 10H1.667M18.333 10h-1.666M4.107 4.108l1.179 1.178M14.714 14.714l1.179 1.179M4.107 15.892l1.179-1.178M14.714 5.286l1.179-1.179M10 14.167a4.167 4.167 0 100-8.334 4.167 4.167 0 000 8.334z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={`Tema saat ini: ${themeMode} (${theme})`}
        aria-label="Toggle Theme Menu"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        {currentIcon}

        {/* Small dot when in System mode to show it is automatic */}
        {themeMode === "system" && (
          <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
        )}
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Tema Tampilan
          </div>
          <div className="space-y-0.5">
            {options.map((item) => {
              const isSelected = themeMode === item.mode;
              return (
                <button
                  key={item.mode}
                  onClick={() => {
                    setThemeMode(item.mode);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        isSelected
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {item.icon}
                    </span>
                    <div className="text-left">
                      <div>{item.label}</div>
                      <div className="text-[11px] font-normal text-gray-400 dark:text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <svg
                      className="h-4 w-4 text-brand-600 dark:text-brand-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10l4 4L16 6" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
