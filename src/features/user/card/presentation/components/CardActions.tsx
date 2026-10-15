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
  Pencil,
  Palette,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";

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
  onToggleFreeze,
  onOpenTopUp,
  onOpenLimitSettings,
  onOpenChangePin,
  onOpenDeleteCard,
  onOpenEditCardName,
  onOpenEditIllustration,
  cardName = "SakuCard",
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
          "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl",
          "bg-primary hover:bg-primary-hover active:bg-primary-active text-text-inverse font-semibold text-xs sm:text-sm",
          "shadow-ds-sm active:scale-[0.99] transition-all cursor-pointer"
        )}
      >
        <PlusCircle className="h-4 w-4" />
        <span>Top Up Saldo</span>
      </button>

      {/* ROW 2: 2 Columns - Bekukan & Pengaturan */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
        {/* Bekukan Button */}
        <button
          type="button"
          onClick={onToggleFreeze}
          className={cn(
            "group flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 rounded-xl border",
            "shadow-2xs active:scale-95 transition-all text-xs sm:text-sm font-medium cursor-pointer",
            isFrozen
              ? "text-info border-info-border bg-info-bg/50 dark:bg-info-bg/25"
              : "text-text-primary border-border bg-surface hover:bg-surface-secondary"
          )}
        >
          <Snowflake
            className={cn(
              "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
              isFrozen ? "text-info" : "text-text-tertiary"
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
              "w-full group flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 rounded-xl border",
              "shadow-2xs active:scale-95 transition-all text-xs sm:text-sm font-medium cursor-pointer",
              isMenuOpen
                ? "border-primary text-primary bg-surface-secondary"
                : "border-border bg-surface text-text-primary hover:bg-surface-secondary"
            )}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <Settings
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-300",
                isMenuOpen ? "rotate-90 text-primary" : "text-text-tertiary group-hover:rotate-45"
              )}
            />
            <span>Pengaturan</span>
          </button>

          {/* DESKTOP DROPDOWN (md:block) */}
          {isMenuOpen && (
            <div className="hidden md:block absolute right-0 top-full mt-2 w-64 rounded-xl bg-surface border border-border shadow-ds-lg p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-border-subtle mb-1">
                <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider block">
                  Atur Kartu
                </span>
                <span className="text-xs font-semibold text-text-primary block truncate">
                  {cardName}
                </span>
              </div>

              {/* 1. Atur Limit Transaksi */}
              <button
                type="button"
                onClick={() => handleAction(onOpenLimitSettings)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface-secondary transition-colors text-xs cursor-pointer group text-text-primary"
              >
                <div className="p-1.5 rounded-md bg-surface-secondary text-text-secondary group-hover:bg-accent group-hover:text-primary transition-colors">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium block">
                    Atur Limit Transaksi
                  </span>
                </div>
              </button>

              {/* 2. Edit Tema Kartu */}
              <button
                type="button"
                onClick={() => handleAction(() => onOpenEditIllustration?.())}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface-secondary transition-colors text-xs cursor-pointer group text-text-primary"
              >
                <div className="p-1.5 rounded-md bg-surface-secondary text-text-secondary group-hover:bg-accent group-hover:text-primary transition-colors">
                  <Palette className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium block">
                    Edit Tema Kartu
                  </span>
                </div>
              </button>

              {/* 3. Edit Nama Kartu */}
              <button
                type="button"
                onClick={() => handleAction(() => onOpenEditCardName?.())}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface-secondary transition-colors text-xs cursor-pointer group text-text-primary"
              >
                <div className="p-1.5 rounded-md bg-surface-secondary text-text-secondary group-hover:bg-accent group-hover:text-primary transition-colors">
                  <Pencil className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium block">
                    Edit Nama Kartu
                  </span>
                </div>
              </button>

              {/* 4. Ganti PIN */}
              <button
                type="button"
                onClick={() => handleAction(onOpenChangePin)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface-secondary transition-colors text-xs cursor-pointer group text-text-primary"
              >
                <div className="p-1.5 rounded-md bg-surface-secondary text-text-secondary group-hover:bg-warning-bg group-hover:text-warning transition-colors">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium block">
                    Ganti PIN
                  </span>
                </div>
              </button>

              {/* 5. Hapus Kartu (Danger) */}
              <button
                type="button"
                onClick={() => handleAction(onOpenDeleteCard)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-error hover:bg-error-bg/60 transition-colors text-xs cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-error-bg text-error transition-colors">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium block">
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
                className="fixed inset-0 bg-overlay backdrop-blur-xs animate-in fade-in duration-200 overscroll-contain"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Slide-up Sheet */}
              <div className="relative w-full rounded-t-3xl bg-surface border-t border-border-subtle p-5 pb-8 shadow-ds-lg z-10 animate-in slide-in-from-bottom duration-300">
                {/* Pull handle indicator */}
                <div className="h-1.5 w-12 rounded-full bg-surface-tertiary mx-auto mb-4" />

                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
                  <div>
                    <h4 className="font-bold text-text-primary text-base">
                      Atur Kartu
                    </h4>
                    <p className="text-xs text-text-tertiary">
                      {cardName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full text-text-tertiary hover:bg-surface-secondary transition-colors cursor-pointer"
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
                    className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-surface-secondary active:bg-surface-tertiary transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-surface-secondary text-text-secondary">
                        <SlidersHorizontal className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-text-primary block">
                          Atur Limit Transaksi
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-tertiary" />
                  </button>

                  {/* 2. Edit Tema Kartu */}
                  <button
                    type="button"
                    onClick={() => handleAction(() => onOpenEditIllustration?.())}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-surface-secondary active:bg-surface-tertiary transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-surface-secondary text-text-secondary">
                        <Palette className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-text-primary block">
                          Edit Tema Kartu
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-tertiary" />
                  </button>

                  {/* 3. Edit Nama Kartu */}
                  <button
                    type="button"
                    onClick={() => handleAction(() => onOpenEditCardName?.())}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-surface-secondary active:bg-surface-tertiary transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-surface-secondary text-text-secondary">
                        <Pencil className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-text-primary block">
                          Edit Nama Kartu
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-tertiary" />
                  </button>

                  {/* 4. Ganti PIN */}
                  <button
                    type="button"
                    onClick={() => handleAction(onOpenChangePin)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-surface-secondary active:bg-surface-tertiary transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-warning-bg text-warning">
                        <KeyRound className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-text-primary block">
                          Ganti PIN
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-tertiary" />
                  </button>

                  {/* 5. Hapus Kartu (Danger) */}
                  <button
                    type="button"
                    onClick={() => handleAction(onOpenDeleteCard)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-error-bg/60 active:bg-error-bg transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-error-bg text-error">
                        <Trash2 className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-error block">
                          Hapus Kartu
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-error/60" />
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
