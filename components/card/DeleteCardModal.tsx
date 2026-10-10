"use client";

import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  cardLast4: string;
  totalCards: number;
  onConfirmDelete: () => void;
}

export const DeleteCardModal: React.FC<DeleteCardModalProps> = ({
  isOpen,
  onClose,
  cardName,
  cardLast4,
  totalCards,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const isLastCard = totalCards <= 1;

  const handleConfirm = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      onConfirmDelete();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 text-center">
        {/* Warning Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <Trash2 className="h-7 w-7" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Hapus {cardName}?
        </h3>

        {/* Description */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {isLastCard ? (
            <p className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
              Ini adalah satu-satunya kartu aktif Anda. Jika dihapus, data kartu akan direset ke pengaturan default.
            </p>
          ) : (
            <p>
              Apakah Anda yakin ingin menghapus <strong>{cardName}</strong> (**** {cardLast4})? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-all cursor-pointer shadow-xs",
              "disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            )}
          >
            {isDeleting ? (
              <span className="animate-pulse">Menghapus...</span>
            ) : (
              <span>Ya, Hapus</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCardModal;
