"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Palette,
  Check,
  Sparkles,
  Tag,
  Search,
  FolderOpen,
} from "lucide-react";
import {
  CategoryIcon,
  LUCIDE_ICONS_MAP,
  PRESET_CATEGORY_IMAGES,
} from "./CategoryIcon";
import { CategoryItem } from "@/context/CategoryContext";
import { cn } from "@/utils";
import { Modal } from "@/components/ui/modal";

interface CategoryIconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: CategoryItem | null;
  onSave: (data: {
    name: string;
    apiCategoryName?: string;
    description?: string;
    iconType: "lucide" | "image";
    iconName?: string;
    iconSrc?: string;
    color: string;
  }) => void;
}

const COLOR_OPTIONS = [
  { id: "blue", name: "Biru", bg: "bg-blue-500" },
  { id: "emerald", name: "Hijau", bg: "bg-emerald-500" },
  { id: "sky", name: "Sky", bg: "bg-sky-500" },
  { id: "purple", name: "Ungu", bg: "bg-purple-500" },
  { id: "violet", name: "Violet", bg: "bg-violet-500" },
  { id: "rose", name: "Rose", bg: "bg-rose-500" },
  { id: "amber", name: "Kuning", bg: "bg-amber-500" },
  { id: "cyan", name: "Cyan", bg: "bg-cyan-500" },
  { id: "red", name: "Merah", bg: "bg-red-500" },
  { id: "indigo", name: "Indigo", bg: "bg-indigo-500" },
];

export const CategoryIconPickerModal: React.FC<CategoryIconPickerModalProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
  onSave,
}) => {
  const [apiCategoryName, setApiCategoryName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("blue");
  const [iconType, setIconType] = useState<"lucide" | "image">("lucide");
  const [iconName, setIconName] = useState("Tag");
  const [iconSrc, setIconSrc] = useState("/images/category/belanja.svg");
  const [iconSearch, setIconSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        setApiCategoryName(categoryToEdit.apiCategoryName || "");
        setName(categoryToEdit.name);
        setDescription(categoryToEdit.description || "");
        setColor(categoryToEdit.color || "blue");
        setIconType(categoryToEdit.iconType || "lucide");
        setIconName(categoryToEdit.iconName || "Tag");
        setIconSrc(categoryToEdit.iconSrc || "/images/category/belanja.svg");
      } else {
        setApiCategoryName("");
        setName("");
        setDescription("");
        setColor("blue");
        setIconType("lucide");
        setIconName("Tag");
        setIconSrc("/images/category/belanja.svg");
      }
      setIconSearch("");
      setError(null);
    }
  }, [isOpen, categoryToEdit]);

  if (!isOpen || !mounted) return null;

  const lucideIconNames = Object.keys(LUCIDE_ICONS_MAP).filter((k) =>
    k.toLowerCase().includes(iconSearch.toLowerCase().trim())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama Kategori di Sakuin.id wajib diisi.");
      return;
    }

    onSave({
      name: name.trim(),
      apiCategoryName: apiCategoryName.trim() || undefined,
      description: description.trim(),
      iconType,
      iconName: iconType === "lucide" ? iconName : undefined,
      iconSrc: iconType === "image" ? iconSrc : undefined,
      color,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      portal={true}
      maxWidth="lg"
      backdropClassName="z-[9999]"
      className="p-5 sm:p-6 flex flex-col max-h-[90vh]"
    >
      {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {categoryToEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Atur nama, mapping respons API, tema warna, dan icon kategori transaksi
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

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto overscroll-contain py-4 space-y-4 pr-1 custom-scrollbar flex-1 min-h-0">
          {/* Live Preview Box */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-850/60 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CategoryIcon
                iconType={iconType}
                iconName={iconName}
                iconSrc={iconSrc}
                color={color}
                size="md"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">
                    {name || "Pratinjau Kategori"}
                  </span>
                  {apiCategoryName.trim() && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold">
                      API: {apiCategoryName.trim()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block truncate max-w-[220px]">
                  {description || "Deskripsi kategori..."}
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gray-200/80 dark:bg-gray-700 text-gray-600 dark:text-gray-300 shrink-0">
              Preview
            </span>
          </div>

          {/* Form Fields: API Category Name (Sebelum Nama Kategori di Sakuin.id) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                Nama Kategori Respon API
              </label>
              <span className="text-[10px] text-gray-400 font-normal">
                Opsional
              </span>
            </div>
            <input
              type="text"
              value={apiCategoryName}
              onChange={(e) => setApiCategoryName(e.target.value)}
              placeholder="Contoh: FOOD_AND_BEVERAGE, RETAIL_GROCERY"
              maxLength={60}
              className="w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-850 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              Kode kategori mentah dari respon API bank / payment gateway untuk pemetaan otomatis.
            </p>
          </div>

          {/* Form Fields: Sakuin.id Category Name */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
              Nama Kategori di Sakuin.id <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Belanja, Makanan & Minuman"
              maxLength={40}
              className="w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-850 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
          </div>

          {/* Form Fields: Description */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
              Deskripsi Singkat (Opsional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Minimarket, restoran, transportasi"
              maxLength={60}
              className="w-full rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-850 px-3.5 py-2 text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Color Palettes */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Warna Tema Kategori
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition-all cursor-pointer",
                    c.bg,
                    color === c.id
                      ? "ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-gray-900 scale-110 shadow-sm"
                      : "opacity-80 hover:opacity-100 hover:scale-105"
                  )}
                >
                  {color === c.id && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection Type Tabs */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Pilih Sumber Icon
            </label>
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => setIconType("lucide")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5",
                  iconType === "lucide"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Lucide Icons</span>
              </button>
              <button
                type="button"
                onClick={() => setIconType("image")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5",
                  iconType === "image"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                )}
              >
                <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Gambar / SVG Folder</span>
              </button>
            </div>

            {/* TAB 1: Lucide Icons Grid */}
            {iconType === "lucide" && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Cari icon lucide (misal: Coffee, Car, Shop)..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-1.5 max-h-40 overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 custom-scrollbar">
                  {lucideIconNames.map((nameKey) => {
                    const Comp = LUCIDE_ICONS_MAP[nameKey];
                    const isSelected = iconName === nameKey;
                    return (
                      <button
                        key={nameKey}
                        type="button"
                        onClick={() => setIconName(nameKey)}
                        title={nameKey}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl transition-all cursor-pointer",
                          isSelected
                            ? "bg-brand-500 text-white shadow-sm ring-2 ring-brand-500/20"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        )}
                      >
                        <Comp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Preset Category Images */}
            {iconType === "image" && (
              <div className="space-y-2">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block">
                  File icon dari direktori <code>public/images/category</code>:
                </span>
                <div className="grid grid-cols-3 gap-2.5 p-1 max-h-44 overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 custom-scrollbar">
                  {PRESET_CATEGORY_IMAGES.map((img) => {
                    const isSelected = iconSrc === img.src;
                    return (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() => setIconSrc(img.src)}
                        className={cn(
                          "flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer text-center",
                          isSelected
                            ? "border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 ring-2 ring-brand-500/20"
                            : "border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:bg-gray-800/50"
                        )}
                      >
                        <div className="relative w-10 h-10 mb-1.5">
                          <Image
                            src={img.src}
                            alt={img.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate w-full block">
                          {img.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{categoryToEdit ? "Simpan Perubahan" : "Buat Kategori"}</span>
          </button>
        </div>
    </Modal>
  );
};

export default CategoryIconPickerModal;
