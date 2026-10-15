"use client";

import React, { useState } from "react";
import { X, Pencil, Check } from "lucide-react";
import { Modal } from "@/shared/presentation/components/ui/Modal";

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

const EditCardNameDialog: React.FC<EditCardNameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  cardLast4,
  onSave,
}) => {
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);

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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" className="p-6 bg-surface border border-border-subtle">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Edit Nama Kartu
            </h3>
            <p className="text-xs text-foreground-secondary">
              Kartu Visa • **** {cardLast4}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="py-4 space-y-4">
        <div>
          <label className="text-xs font-semibold text-foreground mb-1.5 block">
            Nama / Label Kartu
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Kartu Belanja Online"
            maxLength={28}
            autoFocus
            className="w-full rounded-xl border border-border-subtle bg-surface-subtle px-4 py-2.5 text-sm font-semibold text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <div className="flex justify-between text-[11px] text-foreground-muted mt-1">
            <span>Beri nama unik untuk memudahkan identifikasi kartu</span>
            <span>{name.length}/28</span>
          </div>
        </div>

        {/* Quick preset chips */}
        <div>
          <span className="text-[11px] font-semibold text-foreground-secondary block mb-2">
            Saran Cepat:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_NAMES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setName(preset)}
                className="px-2.5 py-1 rounded-lg text-xs border border-border-subtle bg-surface-subtle hover:bg-surface-hover text-foreground-secondary transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-border-subtle flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-border-subtle text-foreground-secondary hover:bg-surface-hover transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            {isLoading ? (
              <span>Menyimpan...</span>
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

export const EditCardNameModal: React.FC<EditCardNameModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <EditCardNameDialog {...props} />;
};

export default EditCardNameModal;
