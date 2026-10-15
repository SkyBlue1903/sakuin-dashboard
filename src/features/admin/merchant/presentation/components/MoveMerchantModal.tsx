"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { useCategory } from "@/features/admin/merchant/presentation/stores/useCategoryStore";
import type { CategoryItem, MerchantItem } from "@/features/admin/merchant/domain/category";
import { useToast } from "@/shared/presentation/stores/ToastContext";
import CategoryIcon from "@/features/admin/merchant/presentation/components/CategoryIcon";
import MerchantLogo from "@/features/admin/merchant/presentation/components/MerchantLogo";
import { cn } from "@/shared/utils";
import { Modal } from "@/shared/presentation/components/ui/Modal";

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
  const { showToast } = useToast();
  const availableCategories = categories.filter((c) => c.id !== currentCategory.id);
  const [targetCategoryId, setTargetCategoryId] = useState<string>(
    availableCategories[0]?.id || ""
  );

  if (!isOpen) return null;

  const merchantObj: MerchantItem =
    typeof merchant === "string" ? { id: merchant, name: merchant } : merchant;

  const handleMove = () => {
    if (!targetCategoryId) return;
    const targetCat = categories.find((c) => c.id === targetCategoryId);
    moveMerchant(merchantObj.id, currentCategory.id, targetCategoryId);
    showToast(
      `Merchant "${merchantObj.name}" berhasil dipindahkan ke kategori ${targetCat?.name || "baru"}!`
    );
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
      className="p-5 sm:p-6 bg-surface border border-border-subtle"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <MerchantLogo
            name={merchantObj.name}
            logoUrl={merchantObj.logoUrl}
            logoDarkUrl={merchantObj.logoDarkUrl}
            size="lg"
          />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Pindahkan Merchant
            </h3>
            <p className="text-xs text-foreground-secondary">
              Pindahkan &quot;{merchantObj.name}&quot; ke kategori lain
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

      {/* Body */}
      <div className="py-4 space-y-4">
        <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle">
          <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block mb-1">
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
            <span className="text-sm font-bold text-foreground">
              {currentCategory.name}
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground-secondary mb-2 block">
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
                      ? "border-primary bg-primary-subtle ring-1 ring-primary"
                      : "border-border-subtle hover:bg-surface-hover"
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
                    <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {cat.name}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border-subtle flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-border-subtle bg-surface-subtle hover:bg-surface-hover text-xs sm:text-sm font-semibold text-foreground-secondary transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleMove}
          className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>Pindahkan</span>
        </button>
      </div>
    </Modal>
  );
};

export default MoveMerchantModal;
