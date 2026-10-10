"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifyPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  cardLast4: string;
  correctPin?: string;
  onSuccess: () => void;
  onForgotPin?: () => void;
}

export const VerifyPinModal: React.FC<VerifyPinModalProps> = ({
  isOpen,
  onClose,
  cardName,
  cardLast4,
  correctPin = "111111",
  onSuccess,
  onForgotPin,
}) => {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state and focus input on open
  useEffect(() => {
    if (isOpen) {
      setPin("");
      setError(null);
      setIsShaking(false);
      setIsValidating(false);
      setIsSuccess(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const verifyPinValue = (enteredPin: string) => {
    if (enteredPin.length !== 6) {
      setError("PIN harus 6 digit angka.");
      return;
    }

    setIsValidating(true);
    setError(null);

    // Otomatis simulasi/proses loading verifikasi
    setTimeout(() => {
      if (enteredPin === correctPin) {
        setIsValidating(false);
        setIsSuccess(true);
        setError(null);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 500);
      } else {
        setIsValidating(false);
        setIsShaking(true);
        setError("PIN salah. Silakan coba lagi.");
        setTimeout(() => {
          setIsShaking(false);
          setPin("");
          inputRef.current?.focus();
        }, 600);
      }
    }, 600);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidating || isSuccess) return;
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setError(null);
    setPin(val);
    if (val.length === 6) {
      verifyPinValue(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6 && !isValidating && !isSuccess) {
      verifyPinValue(pin);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={isValidating || isSuccess ? undefined : onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-[92vw] sm:max-w-md rounded-3xl bg-white dark:bg-gray-900 p-5 sm:p-7 shadow-2xl border border-gray-100 dark:border-gray-800 transition-all",
          "animate-in zoom-in-95 duration-200",
          isShaking && "animate-shake"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isValidating || isSuccess}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center pt-2 pb-3">
          <div
            className={cn(
              "flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl mb-3 shadow-xs transition-colors",
              isSuccess
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                : isValidating
                ? "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
                : "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
            )}
          >
            {isSuccess ? (
              <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 animate-in zoom-in-50 duration-200" />
            ) : isValidating ? (
              <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin text-brand-600 dark:text-brand-400" />
            ) : (
              <Lock className="h-6 w-6 sm:h-7 sm:w-7" />
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {isSuccess
              ? "PIN Terverifikasi"
              : isValidating
              ? "Memverifikasi PIN..."
              : "Masukkan PIN"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-[280px]">
            {isSuccess
              ? "Membuka detail kartu Anda..."
              : isValidating
              ? "Mohon tunggu sebentar..."
              : `Masukkan 6 digit PIN untuk melihat detail ${cardName} (HINT DEV: 111111)`}
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 text-[11px] font-mono font-medium text-gray-700 dark:text-gray-300">
            **** {cardLast4}
          </span>
        </div>

        {/* Lupa PIN link */}
        {onForgotPin && (
          <div className="text-center pb-1.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onForgotPin();
              }}
              disabled={isValidating || isSuccess}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium cursor-pointer disabled:opacity-40"
            >
              Lupa PIN?
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-2.5 space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Text Field for PIN: High-contrast Dark Mode with native numeric keyboard */}
          <div>
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={handleInputChange}
                autoFocus
                placeholder="••••••"
                disabled={isValidating || isSuccess}
                style={{ colorScheme: "dark light" }}
                className={cn(
                  "w-full text-center text-xl sm:text-2xl font-mono font-bold tracking-[0.25em] sm:tracking-[0.35em] py-3.5 pl-4 pr-11 rounded-2xl border transition-all disabled:opacity-90",
                  "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500",
                  "caret-brand-500 dark:caret-brand-400",
                  "focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400",
                  error
                    ? "border-red-500 text-red-600 dark:border-red-500 dark:text-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : isSuccess
                    ? "border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20"
                    : isValidating
                    ? "border-brand-500/60 dark:border-brand-400/60 bg-brand-50/20 dark:bg-brand-950/10"
                    : "border-gray-200 dark:border-gray-700"
                )}
              />

              {/* Eye toggle / Loading indicator on the right side of the field */}
              {isValidating ? (
                <div className="absolute right-2.5 sm:right-3 p-1.5 sm:p-2 text-brand-500 dark:text-brand-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  disabled={isSuccess}
                  className="absolute right-2.5 sm:right-3 p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/60 transition-colors cursor-pointer disabled:opacity-40"
                  title={showPin ? "Sembunyikan angka" : "Lihat angka"}
                  aria-label={showPin ? "Sembunyikan angka" : "Lihat angka"}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-1.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isValidating || isSuccess}
              className="w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyPinModal;
