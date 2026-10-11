"use client";

import React, { useState, useEffect } from "react";
import { X, Pencil, Check, Sparkles } from "lucide-react";
import { cn } from "@/utils";
import { Modal } from "@/components/ui/modal";

interface EditCardNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  cardLast4: string;
  onSave: (newName: string) => void;
}

const PRESET_NAMES = [
  "Kartu Belanja",
  "Langganan",
  "Pribadi",
  "Bisnis",
  "Liburan",
  "Tabungan",
];

export const EditCardNameModal: React.FC<EditCardNameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  cardLast4,
  onSave,
}) => {
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSave(trimmed);
      onClose();
    }, 400);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Edit Nama Kartu
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
              Nama / Label Kartu
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kartu Belanja Online"
              maxLength={28}
              autoFocus
              className="w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-850 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>Beri nama unik untuk memudahkan identifikasi kartu</span>
              <span>{name.length}/28</span>
            </div>
          </div>

          {/* Quick preset chips */}
          <div>
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-2">
              Saran Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_NAMES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setName(preset)}
                  className="px-2.5 py-1 rounded-lg text-xs border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
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
              disabled={isLoading || !name.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gray-900 text-white hover:bg-gray-850 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <span className="animate-pulse">Menyimpan...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Simpan Nama</span>
                </>
              )}
            </button>
          </div>
        </form>
    </Modal>
  );
};

export default EditCardNameModal;
