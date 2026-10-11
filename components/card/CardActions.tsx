"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Settings,
  PlusCircle,
  Snowflake,
  SlidersHorizontal,
  KeyRound,
  Trash2,
  ChevronRight,
  X,
  ShieldCheck,
  Pencil,
  Palette,
} from "lucide-react";
import { cn } from "@/utils";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface CardActionsProps {
  isFrozen: boolean;
  showDetails?: boolean;
  onToggleFreeze: () => void;
  onToggleDetails?: () => void;
  onOpenTopUp: () => void;
  onOpenLimitSettings: () => void;
  onOpenChangePin: () => void;
  onOpenDeleteCard: () => void;
  onOpenEditCardName?: () => void;
  onOpenEditIllustration?: () => void;
  cardName?: string;
  cardLast4?: string;
  className?: string;
}

export const CardActions: React.FC<CardActionsProps> = ({
  isFrozen,
  showDetails,
  onToggleFreeze,
  onToggleDetails,
  onOpenTopUp,
  onOpenLimitSettings,
  onOpenChangePin,
  onOpenDeleteCard,
  onOpenEditCardName,
  onOpenEditIllustration,
  cardName = "SakuCard",
  cardLast4 = "8820",
  className,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Lock background scroll when mobile bottom sheet is open
  useLockBodyScroll(isMenuOpen);

  // Close dropdown on outside click (for desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close dropdown on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const handleAction = (callback: () => void) => {
    setIsMenuOpen(false);
    callback();
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 sm:gap-3 w-full",
        className
      )}
    >
      {/* ROW 1: Full-width Top Up Button */}
      <button
        type="button"
        onClick={onOpenTopUp}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl",
          "bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800",
          "shadow-xs hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-850",
          "active:scale-[0.99] transition-all text-xs sm:text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
        )}
      >
        <PlusCircle className="h-4 w-4 text-brand-500 dark:text-brand-400" />
        <span>Top Up</span>
      </button>

      {/* ROW 2: 2 Columns - Detail & Pengaturan */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
        {/* Bekukan Button */}
        <button
          type="button"
          onClick={onToggleFreeze}
          className={cn(
            "group flex items-center justify-center gap-1.5 sm:gap-2 py-3 px-3 rounded-2xl",
            "bg-white dark:bg-gray-900 border",
            "shadow-xs hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-850",
            "active:scale-95 transition-all text-xs sm:text-sm font-medium cursor-pointer",
            isFrozen
              ? "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20"
              : "text-gray-800 dark:text-gray-200 border-gray-200/80 dark:border-gray-800"
          )}
        >
          <Snowflake
            className={cn(
              "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
              isFrozen ? "text-blue-500 animate-pulse" : "text-gray-500 dark:text-gray-400"
            )}
          />
          <span>{isFrozen ? "Buka Blokir" : "Bekukan"}</span>
        </button>

        {/* Pengaturan Button with Dropdown (Desktop) & Sheet (Mobile) */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "w-full group flex items-center justify-center gap-1.5 sm:gap-2 py-3 px-3 rounded-2xl",
              "bg-white dark:bg-gray-900 border",
              "shadow-xs hover:bg-gray-50 dark:hover:bg-gray-850 active:scale-95 transition-all text-xs sm:text-sm font-medium cursor-pointer",
              isMenuOpen
                ? "border-brand-300 dark:border-brand-700 text-brand-600 dark:text-brand-400"
                : "border-gray-200/80 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
            )}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <Settings
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-300",
                isMenuOpen ? "rotate-90 text-brand-500" : "group-hover:rotate-45"
              )}
            />
            <span>Pengaturan</span>
          </button>

          {/* DESKTOP DROPDOWN (md:block) */}
          {isMenuOpen && (
            <div className="hidden md:block absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Atur Kartu
                </span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block truncate">
                  {cardName}
                </span>
              </div>

              {/* 1. Atur Limit Transaksi */}
              <button
                type="button"
                onClick={() => handleAction(onOpenLimitSettings)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-950/40 dark:group-hover:text-brand-400 transition-colors">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 dark:text-white block">
                    Atur Limit Transaksi
                  </span>
                </div>
              </button>

              {/* 2. Edit Ilustrasi Kartu */}
              <button
                type="button"
                onClick={() => handleAction(() => onOpenEditIllustration?.())}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 group-hover:bg-purple-50 group-hover:text-purple-600 dark:group-hover:bg-purple-950/40 dark:group-hover:text-purple-400 transition-colors">
                  <Palette className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 dark:text-white block">
                    Edit Tema Kartu
                  </span>
                </div>
              </button>

              {/* 3. Edit Nama Kartu */}
              <button
                type="button"
                onClick={() => handleAction(() => onOpenEditCardName?.())}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/40 dark:group-hover:text-blue-400 transition-colors">
                  <Pencil className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 dark:text-white block">
                    Edit Nama Kartu
                  </span>
                </div>
              </button>

              {/* 4. Ganti PIN */}
              <button
                type="button"
                onClick={() => handleAction(onOpenChangePin)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 group-hover:bg-amber-50 group-hover:text-amber-600 dark:group-hover:bg-amber-950/40 dark:group-hover:text-amber-400 transition-colors">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 dark:text-white block">
                    Ganti PIN
                  </span>
                </div>
              </button>

              {/* 4. Hapus Kartu (Danger) */}
              <button
                type="button"
                onClick={() => handleAction(onOpenDeleteCard)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-xs cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/60 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-red-600 dark:text-red-400 block">
                    Hapus Kartu
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* MOBILE BOTTOM SHEET (md:hidden) */}
          {isMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center overscroll-contain">
              {/* Dimmed backdrop */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overscroll-contain"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Slide-up Sheet */}
              <div className="relative w-full rounded-t-3xl bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-5 pb-8 shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
                {/* Pull handle indicator */}
                <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4" />

                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                      Atur Kartu
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cardName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Options List */}
                <div className="space-y-1.5">
                  {/* 1. Atur Limit Transaksi */}
                  <button
                    type="button"
                    onClick={() => handleAction(onOpenLimitSettings)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/80 active:bg-gray-100 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <SlidersHorizontal className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white block">
                          Atur Limit Transaksi
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* 2. Edit Ilustrasi Kartu */}
                  <button
                    type="button"
                    onClick={() => handleAction(() => onOpenEditIllustration?.())}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/80 active:bg-gray-100 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <Palette className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white block">
                          Edit Temas Kartu
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* 3. Edit Nama Kartu */}
                  <button
                    type="button"
                    onClick={() => handleAction(() => onOpenEditCardName?.())}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/80 active:bg-gray-100 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <Pencil className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white block">
                          Edit Nama Kartu
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* 4. Ganti PIN */}
                  <button
                    type="button"
                    onClick={() => handleAction(onOpenChangePin)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/80 active:bg-gray-100 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <KeyRound className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white block">
                          Ganti PIN
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* 4. Hapus Kartu (Danger) */}
                  <button
                    type="button"
                    onClick={() => handleAction(onOpenDeleteCard)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 active:bg-red-100 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        <Trash2 className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-red-600 dark:text-red-400 block">
                          Hapus Kartu
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardActions;
