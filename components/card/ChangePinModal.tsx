"use client";

import React, { useState } from "react";
import { X, KeyRound, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils";
import { Modal } from "@/components/ui/modal";

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  cardLast4: string;
  currentPin?: string;
  onSuccess: (newPin?: string) => void;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({
  isOpen,
  onClose,
  cardName,
  cardLast4,
  currentPin = "111111",
  onSuccess,
}) => {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (oldPin.length !== 6) {
      setError("PIN saat ini harus 6 digit angka.");
      return;
    }
    if (oldPin !== currentPin) {
      setError("PIN saat ini salah. Silakan periksa kembali.");
      return;
    }
    if (newPin.length !== 6) {
      setError("PIN baru harus 6 digit angka.");
      return;
    }
    if (newPin !== confirmPin) {
      setError("Konfirmasi PIN baru tidak cocok.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(newPin);
      onClose();
      setOldPin("");
      setNewPin("");
      setConfirmPin("");
    }, 700);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" className="p-6">
      {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Ganti PIN Kartu
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {cardName} (**** {cardLast4})
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
        <form onSubmit={handleSave} className="py-4 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
              PIN Saat Ini (6 digit)
            </label>
            <input
              type={showPin ? "text" : "password"}
              maxLength={6}
              value={oldPin}
              onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              style={{ colorScheme: "dark light" }}
              className="w-full tracking-widest text-center text-lg font-mono rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
              PIN Baru (6 digit)
            </label>
            <input
              type={showPin ? "text" : "password"}
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              style={{ colorScheme: "dark light" }}
              className="w-full tracking-widest text-center text-lg font-mono rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
              Konfirmasi PIN Baru
            </label>
            <input
              type={showPin ? "text" : "password"}
              maxLength={6}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              style={{ colorScheme: "dark light" }}
              className="w-full tracking-widest text-center text-lg font-mono rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1.5 cursor-pointer"
            >
              {showPin ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showPin ? "Sembunyikan Angka" : "Lihat Angka PIN"}</span>
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || newPin.length !== 6 || confirmPin.length !== 6}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gray-900 text-white hover:bg-gray-850 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <span className="animate-pulse">Menyimpan...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Simpan PIN</span>
                </>
              )}
            </button>
          </div>
        </form>
    </Modal>
  );
};

export default ChangePinModal;
