"use client";

import React, { useState } from "react";
import { Plus, Search, Edit3, Trash2, Layers, ChevronRight, Loader2 } from "lucide-react";
import { useCategory } from "@/features/admin/merchant/presentation/stores/useCategoryStore";
import type { CategoryItem } from "@/features/admin/merchant/domain/category";
import CategoryIcon from "@/features/admin/merchant/presentation/components/CategoryIcon";
import CategoryIconPickerModal from "@/features/admin/merchant/presentation/components/CategoryIconPickerModal";
import {
  useResponsiveInfiniteScroll,
  type UseInfiniteScrollOptions,
} from "@/shared/hooks/useResponsiveInfiniteScroll";
import { cn } from "@/shared/utils";
import { useToast } from "@/shared/presentation/stores/ToastContext";

interface LeftSidebarContentProps {
  className?: string;
  infiniteScrollOptions?: Partial<UseInfiniteScrollOptions>;
}

export const LeftSidebarContent: React.FC<LeftSidebarContentProps> = ({
  className,
  infiniteScrollOptions,
}) => {
  const {
    categories,
    activeCategoryId,
    setActiveCategoryId,
    mobileView,
    setMobileView,
    addCategory,
    updateCategory,
    deleteCategory,
    totalMerchantsCount,
  } = useCategory();

  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    (cat.apiCategoryName && cat.apiCategoryName.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  );

  // Responsive Infinite Scroll: Batasi render kategori sesuai ukuran layar
  const scrollConfig: UseInfiniteScrollOptions = {
    totalItems: filteredCategories.length,
    initialBatchSize: infiniteScrollOptions?.initialBatchSize,
    loadMoreBatchSize: infiniteScrollOptions?.loadMoreBatchSize,
    threshold: infiniteScrollOptions?.threshold,
  };

  const {
    visibleCount,
    hasMore,
    sentinelRef,
  } = useResponsiveInfiniteScroll(scrollConfig);

  // Pastikan kategori yang sedang aktif selalu masuk dalam render
  const activeIndex = filteredCategories.findIndex((c) => c.id === activeCategoryId);
  const effectiveVisibleCount = activeIndex >= 0 ? Math.max(visibleCount, activeIndex + 1) : visibleCount;
  const visibleCategories = filteredCategories.slice(0, effectiveVisibleCount);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (cat: CategoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Yakin ingin menghapus kategori "${cat.name}"? Merchant di dalamnya akan terhapus.`)) {
      deleteCategory(cat.id);
      showToast(`Kategori "${cat.name}" berhasil dihapus.`);
    }
  };

  const handleSaveCategory = (data: {
    id?: string;
    name: string;
    apiCategoryName?: string;
    description?: string;
    iconType: "lucide" | "image";
    iconName?: string;
    iconSrc?: string;
    color: string;
  }) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
      showToast(`Kategori "${data.name}" berhasil diperbarui!`);
    } else {
      addCategory(data);
      showToast(`Kategori "${data.name}" berhasil ditambahkan!`);
    }
  };

  return (
    <div
      className={cn(
        "w-full md:w-[360px] lg:w-[400px] xl:w-[430px] 2xl:w-[460px] shrink-0 md:h-full md:overflow-y-auto custom-scrollbar pt-0 pb-10",
        mobileView === "merchants" ? "hidden md:block" : "block",
        className
      )}
    >
      {/* Sticky Header Bar: Title, Count, + Tambah Kategori */}
      <div
        className={cn(
          "sticky top-16 md:top-0 z-20 w-full pt-2 pb-3.5 space-y-3 bg-background/95 backdrop-blur-md border-b border-border-subtle shadow-xs transition-all py-4"
        )}
      >
        {/* Row 1: Header + Tambah Kategori Button */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full max-w-[500px] lg:max-w-none mx-auto px-4 sm:pl-6 lg:pl-8 xl:pl-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                Kategori
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                {categories.length}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              {totalMerchantsCount} merchant terdaftar
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex h-9 items-center gap-1.5 px-3 sm:px-4 rounded-full border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-text-primary shadow-ds-xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* Row 2: Search input for categories (hanya tampil jika ada kategori) */}
        {categories.length > 0 && (
          <div className="w-full max-w-[500px] lg:max-w-none mx-auto px-4 sm:pl-6 lg:pl-8 xl:pl-10">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kategori..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-tertiary shadow-ds-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category List */}
      <div className="space-y-2 pt-3 w-full max-w-[500px] lg:max-w-none mx-auto px-4 sm:pl-6 lg:pl-8 xl:pl-10">
        {categories.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-dashed border-border-subtle bg-surface space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto text-text-tertiary">
              <Layers className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-text-secondary">
              Tidak ada kategori, silakan tambah kategori terlebih dahulu
            </p>
            <div className="flex items-center justify-center pt-1">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 active:scale-95 text-text-inverse text-xs font-semibold shadow-ds-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kategori</span>
              </button>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-border-subtle bg-surface text-xs text-text-tertiary">
            Kategori tidak ditemukan.
          </div>
        ) : (
          <>
            {visibleCategories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setMobileView("merchants");
                  }}
                  className={cn(
                    "group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer text-left",
                    isActive
                      ? "bg-surface border-primary shadow-ds-xs ring-1 ring-primary/20"
                      : "bg-surface border-border-subtle hover:border-border"
                  )}
                >
                  {/* Left: Icon + Category Info */}
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <CategoryIcon
                      iconType={cat.iconType}
                      iconName={cat.iconName}
                      iconSrc={cat.iconSrc}
                      color={cat.color}
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn(
                          "text-xs sm:text-sm font-bold truncate block",
                          isActive
                            ? "text-primary"
                            : "text-text-primary"
                        )}>
                          {cat.name}
                        </span>
                        {cat.apiCategoryName && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                            {cat.apiCategoryName}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-text-tertiary block truncate mt-0.5">
                        {cat.merchants.length} merchant terdaftar
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions (Edit & Delete on hover/active) + Chevron on mobile */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditModal(cat, e)}
                      title="Edit kategori"
                      className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCategory(cat, e)}
                      title="Hapus kategori"
                      className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-text-tertiary md:hidden ml-0.5" />
                  </div>
                </div>
              );
            })}

            {/* Sentinel Loader */}
            {hasMore && effectiveVisibleCount < filteredCategories.length && (
              <div
                ref={sentinelRef}
                className="py-3 flex items-center justify-center gap-2 text-xs text-text-tertiary"
              >
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Memuat lebih banyak kategori...</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Tambah / Edit Kategori */}
      <CategoryIconPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default LeftSidebarContent;
