"use client";

import React, { useState } from "react";
import { X, Wallet, ArrowDownToLine, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  cardLast4: string;
  onSuccess: (amountFormatted: string, numericAmount: number) => void;
}

const PRESET_AMOUNTS = [
  { label: "Rp 50.000", value: 50000 },
  { label: "Rp 100.000", value: 100000 },
  { label: "Rp 250.000", value: 250000 },
  { label: "Rp 500.000", value: 500000 },
  { label: "Rp 1.000.000", value: 1000000 },
  { label: "Rp 2.000.000", value: 2000000 },
];

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  cardName,
  cardLast4,
  onSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(250000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCustomAmount(raw);
    setIsCustom(true);
  };

  const handleConfirm = () => {
    if (currentAmount < 10000) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(formatRupiah(currentAmount), currentAmount);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Top Up {cardName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kartu Visa • **** {cardLast4}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-4">
          {/* Sumber Dana */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Sumber Dana</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white block">
                  Saldo Utama Sakuin
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Rp 18.450.000
            </span>
          </div>

          {/* Preset Amounts */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Pilih Nominal
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((item) => {
                const active = !isCustom && selectedAmount === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelectPreset(item.value)}
                    className={cn(
                      "py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                      active
                        ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:border-brand-500 dark:text-brand-300 shadow-xs"
                        : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nominal Lain */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
              Atau Masukkan Nominal Sendiri
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                Rp
              </span>
              <input
                type="text"
                value={isCustom ? customAmount : ""}
                onChange={handleCustomChange}
                placeholder={isCustom ? "" : "Contoh: 150000"}
                className="w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-850 pl-10 pr-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Total & Action Button */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total Pengisian</span>
            <span className="font-bold text-gray-900 dark:text-white text-base">
              {formatRupiah(currentAmount)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={currentAmount < 10000 || isLoading}
            className={cn(
              "w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all cursor-pointer",
              "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
              "disabled:opacity-50 disabled:cursor-not-allowed shadow-xs active:scale-[0.99] flex items-center justify-center gap-2"
            )}
          >
            {isLoading ? (
              <span className="animate-pulse">Memproses Top Up...</span>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Konfirmasi Top Up</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;
