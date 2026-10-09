"use client";

import React, { useState } from "react";
import { X, CreditCard, Wallet, Plus, Check, Sparkles } from "lucide-react";
import { cn } from "@/utils";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCardNumber: number;
  onAddCard: (data: { name: string; initialDeposit: number }) => void;
}

const PRESET_AMOUNTS = [
  { label: "Rp 0 (Tanpa Saldo)", value: 0 },
  { label: "Rp 50.000", value: 50000 },
  { label: "Rp 100.000", value: 100000 },
  { label: "Rp 250.000", value: 250000 },
  { label: "Rp 500.000", value: 500000 },
  { label: "Rp 1.000.000", value: 1000000 },
];

const PRESET_NAMES = [
  "Kartu Belanja",
  "Langganan",
  "Pribadi",
  "Tabungan",
];

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  defaultCardNumber,
  onAddCard,
}) => {
  const [cardName, setCardName] = useState(`SakuCard ${defaultCardNumber}`);
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update card name whenever defaultCardNumber changes
  React.useEffect(() => {
    if (isOpen) {
      setCardName(`SakuCard ${defaultCardNumber}`);
      setSelectedAmount(100000);
      setIsCustom(false);
      setCustomAmount("");
    }
  }, [isOpen, defaultCardNumber]);

  if (!isOpen) return null;

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const formatRupiah = (val: number) => {
    if (val === 0) return "Rp 0";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = cardName.trim() || `SakuCard ${defaultCardNumber}`;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAddCard({
        name: finalName,
        initialDeposit: currentAmount,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Tambah Kartu SakuCard Baru
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kustomisasi nama & isi saldo awal sekaligus
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* Mini Card Preview */}
          <div className="rounded-2xl bg-[#FAFF00] p-4 text-black shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm tracking-tight truncate max-w-[200px]">
                {cardName || `SakuCard ${defaultCardNumber}`}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-full">
                VIRTUAL
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[9px] font-semibold text-black/60 uppercase block leading-none">
                  Saldo Awal
                </span>
                <span className="font-black text-black text-base block leading-tight mt-0.5">
                  {formatRupiah(currentAmount)}
                </span>
                <span className="text-xs font-mono tracking-widest text-black/90 block mt-1">
                  **** ••••
                </span>
              </div>
              <span className="font-bold text-black text-xs font-sans">VISA</span>
            </div>
          </div>

          {/* 1. Nama Kartu Input */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
              Nama / Panggilan Kartu
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder={`Contoh: SakuCard ${defaultCardNumber} atau Kartu Belanja`}
              maxLength={28}
              className="w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-850 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-gray-400">Pilihan:</span>
              {PRESET_NAMES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCardName(preset)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Sumber Dana */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block">Sumber Dana Top Up</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white block">
                  Saldo Utama Sakuin
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Rp 18.450.000
            </span>
          </div>

          {/* 3. Pilihan Nominal Top Up Sekaligus */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Top Up Saldo Awal (Opsional)
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
                      "py-2 px-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center",
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

          {/* Nominal Kustom */}
          <div>
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
              Atau Masukkan Nominal Sendiri:
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                Rp
              </span>
              <input
                type="text"
                value={isCustom ? customAmount : ""}
                onChange={handleCustomChange}
                placeholder={isCustom ? "" : "Contoh: 75000"}
                className="w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-850 pl-10 pr-4 py-2 text-xs font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !cardName.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gray-900 text-white hover:bg-gray-850 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <span className="animate-pulse">Membuat Kartu...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>
                    {currentAmount > 0
                      ? `Buat & Top Up (${formatRupiah(currentAmount)})`
                      : "Buat Kartu"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;
