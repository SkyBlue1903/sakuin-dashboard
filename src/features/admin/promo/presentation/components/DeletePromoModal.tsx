"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import type { PromoItem } from "@/features/user/promo/domain/promo";
import { Modal } from "@/shared/presentation/components/ui/Modal";

interface DeletePromoModalProps {
  promo: PromoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePromoModal: React.FC<DeletePromoModalProps> = ({
  promo,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!promo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" className="p-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 mb-4 border border-red-100 dark:border-red-900/40">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          Hapus {promo.type === "guide" ? "Panduan" : promo.type === "info" ? "Informasi" : "Promosi"} Ini?
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Apakah Anda yakin ingin menghapus {promo.type === "guide" ? "panduan" : promo.type === "info" ? "informasi" : "promosi"}{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            &quot;{promo.title}&quot;
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="mt-6 flex w-full items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePromoModal;
