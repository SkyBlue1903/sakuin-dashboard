"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRightLeft, Check } from "lucide-react";
import { useCategory } from "@/stores/useCategoryStore";
import type { CategoryItem, MerchantItem } from "@/models/category";
import CategoryIcon from "./CategoryIcon";
import MerchantLogo from "./MerchantLogo";
import { cn } from "@/utils";
import { Modal } from "@/views/ui/modal";

interface MoveMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantItem | string;
  currentCategory: CategoryItem;
  onSuccess?: () => void;
}

export const MoveMerchantModal: React.FC<MoveMerchantModalProps> = ({
  isOpen,
  onClose,
  merchant,
  currentCategory,
  onSuccess,
}) => {

  const { categories, moveMerchant } = useCategory();
  const availableCategories = categories.filter((c) => c.id !== currentCategory.id);
  const [targetCategoryId, setTargetCategoryId] = useState<string>(
    availableCategories[0]?.id || ""
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const merchantObj: MerchantItem =
    typeof merchant === "string" ? { id: merchant, name: merchant } : merchant;

  const handleMove = () => {
    if (!targetCategoryId) return;
    moveMerchant(merchantObj.id, currentCategory.id, targetCategoryId);
    onSuccess?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      portal={true}
      maxWidth="md"
      backdropClassName="z-[9999]"
      className="p-5 sm:p-6"
    >
      {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <MerchantLogo name={merchantObj.name} logoUrl={merchantObj.logoUrl} size="lg" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Pindahkan Merchant
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pindahkan &quot;{merchantObj.name}&quot; ke kategori lain
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
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Kategori Saat Ini
            </span>
            <div className="flex items-center gap-2.5">
              <CategoryIcon
                iconType={currentCategory.iconType}
                iconName={currentCategory.iconName}
                iconSrc={currentCategory.iconSrc}
                color={currentCategory.color}
                size="sm"
              />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {currentCategory.name}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Pilih Kategori Tujuan Baru:
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto overscroll-contain pr-1 custom-scrollbar">
              {availableCategories.map((cat) => {
                const isSelected = targetCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setTargetCategoryId(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left",
                      isSelected
                        ? "border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 ring-1 ring-brand-500"
                        : "border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CategoryIcon
                        iconType={cat.iconType}
                        iconName={cat.iconName}
                        iconSrc={cat.iconSrc}
                        color={cat.color}
                        size="sm"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {cat.name}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleMove}
            className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Pindahkan</span>
          </button>
        </div>
    </Modal>
  );
};

export default MoveMerchantModal;
