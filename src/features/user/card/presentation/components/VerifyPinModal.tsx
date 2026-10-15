"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { Modal } from "@/shared/presentation/components/ui/Modal";

interface VerifyPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  cardLast4: string;
  correctPin?: string;
  onSuccess: () => void;
  onForgotPin?: () => void;
}

const VerifyPinDialog: React.FC<VerifyPinModalProps> = ({
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

  // Focus input automatically on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const verifyPinValue = (enteredPin: string) => {
    if (enteredPin.length !== 6) {
      setError("PIN harus 6 digit angka.");
      return;
    }

    setIsValidating(true);
    setError(null);

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      closeOnBackdropClick={!isValidating && !isSuccess}
      closeOnEscape={!isValidating && !isSuccess}
      className={cn(
        "p-5 sm:p-7 transition-all bg-surface border border-border-subtle",
        isShaking && "animate-shake"
      )}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        disabled={isValidating || isSuccess}
        className="absolute top-4 right-4 sm:top-5 sm:right-5 rounded-full p-2 text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="flex flex-col items-center text-center pt-2 pb-3">
        <div
          className={cn(
            "flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl mb-3 shadow-xs transition-colors",
            isSuccess
              ? "bg-success-bg text-success"
              : isValidating
              ? "bg-primary-subtle text-primary"
              : "bg-primary-subtle text-primary"
          )}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 animate-in zoom-in-50 duration-200" />
          ) : isValidating ? (
            <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin text-primary" />
          ) : (
            <Lock className="h-6 w-6 sm:h-7 sm:w-7" />
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          {isSuccess
            ? "PIN Terverifikasi"
            : isValidating
            ? "Memverifikasi PIN..."
            : "Masukkan PIN"}
        </h3>
        <p className="text-xs sm:text-sm text-foreground-secondary mt-1 max-w-[280px]">
          {isSuccess
            ? "Membuka detail kartu Anda..."
            : isValidating
            ? "Mohon tunggu sebentar..."
            : `Masukkan 6 digit PIN untuk melihat detail ${cardName}`}
        </p>

        <div className="flex items-center gap-2 mt-2.5">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-subtle border border-border-subtle text-[11px] font-mono font-medium text-foreground-secondary">
            **** {cardLast4}
          </span>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-subtle border border-border-subtle text-[11px] font-mono text-foreground-muted">
            PIN sandbox: 111111
          </span>
        </div>
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
            className="text-xs text-primary hover:underline font-medium cursor-pointer disabled:opacity-40"
          >
            Lupa PIN?
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-2.5 space-y-4">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-danger-bg border border-danger-border text-danger text-xs animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Text Field for PIN */}
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
                "bg-surface-subtle text-foreground placeholder:text-foreground-muted",
                "caret-primary",
                "focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary",
                error
                  ? "border-danger text-danger focus:border-danger focus:ring-danger/20"
                  : isSuccess
                  ? "border-success text-success bg-success-bg/40"
                  : isValidating
                  ? "border-primary/60 bg-primary-subtle/30"
                  : "border-border-subtle"
              )}
            />

            {/* Eye toggle / Loading indicator on the right side of the field */}
            {isValidating ? (
              <div className="absolute right-2.5 sm:right-3 p-1.5 sm:p-2 text-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                disabled={isSuccess}
                className="absolute right-2.5 sm:right-3 p-1.5 sm:p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-40"
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
            className="w-full py-3 px-4 rounded-xl border border-border-subtle bg-surface-subtle hover:bg-surface-hover text-xs sm:text-sm font-semibold text-foreground-secondary transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            Batal
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const VerifyPinModal: React.FC<VerifyPinModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <VerifyPinDialog {...props} />;
};

export default VerifyPinModal;
