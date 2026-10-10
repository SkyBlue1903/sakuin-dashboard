"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Globe, ShoppingBag, Sliders, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFrozen: boolean;
  onToggleFreeze: () => void;
}

export const CardSettingsModal: React.FC<CardSettingsModalProps> = ({
  isOpen,
  onClose,
  isFrozen,
  onToggleFreeze,
}) => {
  const [onlineTx, setOnlineTx] = useState(true);
  const [internationalTx, setInternationalTx] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("500");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Pengaturan S-Card
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola keamanan dan batas transaksi kartu Anda
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 py-5">
          {/* Status Kartu */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-light-50 dark:bg-blue-light-950/40 text-blue-light-600 dark:text-blue-light-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                  Status Kartu
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isFrozen ? "Kartu sedang dibekukan" : "Kartu aktif & siap digunakan"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleFreeze}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                isFrozen
                  ? "bg-blue-light-600 text-white hover:bg-blue-light-700"
                  : "bg-error-50 text-error-600 hover:bg-error-100 dark:bg-error-950/30 dark:text-error-400"
              )}
            >
              {isFrozen ? "Buka Blokir" : "Bekukan Kartu"}
            </button>
          </div>

          {/* Transaksi Internasional */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                  Transaksi Luar Negeri
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Wajib aktif untuk kursus & layanan luar negeri (USD)
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={internationalTx}
                onChange={(e) => setInternationalTx(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
            </label>
          </div>

          {/* Transaksi Online E-Commerce */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-success-50 dark:bg-success-950/40 text-success-600 dark:text-success-400">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                  Pembayaran Online
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Untuk langganan web & belanja online
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={onlineTx}
                onChange={(e) => setOnlineTx(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
            </label>
          </div>

          {/* Batas Limit Harian */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Batas Transaksi Harian
                </span>
              </div>
              <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                ${dailyLimit} USD
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="w-full accent-brand-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Min $50</span>
              <span>Maks $2,000</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-gray-900 dark:bg-white text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 text-success-500" />
                Tersimpan!
              </>
            ) : (
              "Simpan Pengaturan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardSettingsModal;
