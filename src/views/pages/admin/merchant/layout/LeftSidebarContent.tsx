"use client";

import React, { useState } from "react";
import { Plus, Search, Edit3, Trash2, Check, Sparkles, Layers, ChevronRight, RotateCcw } from "lucide-react";
import { useCategory } from "@/stores/useCategoryStore";
import type { CategoryItem } from "@/models/category";
import CategoryIcon from "@/views/admin/CategoryIcon";
import CategoryIconPickerModal from "@/views/admin/CategoryIconPickerModal";
import { cn } from "@/utils";
import { useToast } from "@/stores/ToastContext";

export const LeftSidebarContent: React.FC = () => {
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
        mobileView === "merchants" ? "hidden md:block" : "block"
      )}
    >
      {/* Sticky Header Bar: Title, Count, + Tambah Kategori */}
      <div
        className={cn(
          "sticky top-16 md:top-0 z-20 w-full pt-2 pb-3.5 space-y-3 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 shadow-xs transition-all"
        )}
      >
        {/* Row 1: Header + Tambah Kategori Button */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full max-w-[500px] lg:max-w-none mx-auto px-4 sm:pl-6 lg:pl-8 xl:pl-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Kategori
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
                {categories.length}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {totalMerchantsCount} merchant terdaftar
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex h-9 items-center gap-1.5 px-3 sm:px-4 rounded-full border border-gray-200/80 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 shadow-2xs dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-brand-500" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* Row 2: Search input for categories (hanya tampil jika ada kategori) */}
        {categories.length > 0 && (
          <div className="w-full max-w-[500px] lg:max-w-none mx-auto px-4 sm:pl-6 lg:pl-8 xl:pl-10">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kategori..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 text-gray-800 dark:text-white placeholder-gray-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category List */}
      <div className="space-y-2 pt-3 w-full max-w-[500px] lg:max-w-none mx-auto px-4 sm:pl-6 lg:pl-8 xl:pl-10">
        {categories.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
              <Layers className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">
              Tidak ada kategori, silakan tambah kategori terlebih dahulu
            </p>
            <div className="flex items-center justify-center pt-1">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kategori</span>
              </button>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs text-gray-400">
            Kategori tidak ditemukan.
          </div>
        ) : (
          filteredCategories.map((cat) => {
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
                    ? "bg-white dark:bg-gray-900 border-brand-500/80 dark:border-brand-500 shadow-sm ring-1 ring-brand-500/20"
                    : "bg-white/80 dark:bg-gray-900/60 border-gray-100 dark:border-gray-800/80 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700"
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
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-gray-900 dark:text-white"
                      )}>
                        {cat.name}
                      </span>
                      {cat.apiCategoryName && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium">
                          {cat.apiCategoryName}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 block truncate mt-0.5">
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
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteCategory(cat, e)}
                    title="Hapus kategori"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 md:hidden ml-0.5" />
                </div>
              </div>
            );
          })
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
