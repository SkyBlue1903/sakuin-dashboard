"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit2,
  Copy,
  Trash2,
  RotateCcw,
  BookOpen,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useGuideStore } from "@/stores/useGuideStore";
import type { GuideItem } from "@/models/guide";
import type { PromoItem } from "@/models/promo";
import EditGuideModal from "@/views/admin/EditGuideModal";
import PromoDetailModal from "@/views/admin/PromoDetailModal";
import DeletePromoModal from "@/views/admin/DeletePromoModal";
import { useToast } from "@/stores/ToastContext";
import { cn } from "@/utils";

export const AdminGuidesLayout: React.FC = () => {
  const {
    guides,
    isLoading,
    loadGuides,
    addGuide,
    updateGuide,
    deleteGuide,
    duplicateGuide,
  } = useGuideStore();
  const { showToast } = useToast();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "visible" | "hidden" | "highlight">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title-asc" | "title-desc">("newest");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<PromoItem | null>(null);
  const [previewingGuide, setPreviewingGuide] = useState<PromoItem | null>(null);
  const [deletingGuide, setDeletingGuide] = useState<PromoItem | null>(null);

  // Muat data dari Supabase saat awal render (termasuk yang disembunyikan untuk Admin)
  useEffect(() => {
    loadGuides(true);
  }, [loadGuides]);

  // Filter & Search logic
  const filteredGuides = guides
    .filter((item) => {
      // 1. Filter Search (Judul atau deskripsi)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q);
      if (!matchesSearch) return false;

      // 2. Filter Status (Semua / Tampil / Disembunyikan / Highlight)
      if (statusFilter === "visible") return !item.isHidden;
      if (statusFilter === "hidden") return Boolean(item.isHidden);
      if (statusFilter === "highlight") return Boolean(item.isHighlight);
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  const handleOpenCreateModal = () => {
    setEditingGuide(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (item: GuideItem) => {
    setEditingGuide(item as unknown as PromoItem);
    setIsEditModalOpen(true);
  };

  const handleSaveGuide = async (guideData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => {
    if (editingGuide) {
      await updateGuide(editingGuide.id, guideData);
      showToast(`Panduan "${guideData.title}" berhasil diperbarui!`, "success");
    } else {
      await addGuide(guideData);
      showToast(`Panduan "${guideData.title}" berhasil ditambahkan!`, "success");
    }
  };

  const handleToggleHide = async (guide: GuideItem) => {
    const nextHidden = !guide.isHidden;
    try {
      await updateGuide(guide.id, { isHidden: nextHidden });
      showToast(
        nextHidden
          ? `Panduan "${guide.title}" sekarang disembunyikan dari pengguna.`
          : `Panduan "${guide.title}" sekarang ditampilkan ke pengguna.`,
        "success"
      );
    } catch {
      // Error toast emitted by store
    }
  };

  const handleToggleHighlight = async (guide: GuideItem) => {
    const nextHighlight = !guide.isHighlight;
    try {
      await updateGuide(guide.id, { isHighlight: nextHighlight });
      showToast(
        nextHighlight
          ? `Panduan "${guide.title}" dijadikan Highlight.`
          : `Panduan "${guide.title}" dihapus dari Highlight.`,
        "success"
      );
    } catch {
      // Error toast emitted by store
    }
  };

  return (
    <div className="w-full flex-1 md:overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Manajemen Panduan Sakuin</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Kelola Panduan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Atur tutorial langkah demi langkah dan dokumentasi penggunaan kartu virtual langsung di dashboard pengguna (tersinkronisasi ke Supabase).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              loadGuides(true);
              showToast("Data panduan disegarkan dari Supabase");
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            title="Segarkan data dari database"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Segarkan</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Panduan</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar (Dropdown Status & Dropdown Urutkan) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul panduan atau deskripsi..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Dropdowns Section */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown: Status Panduan */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
            <span className="text-xs text-gray-400 hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "visible" | "hidden" | "highlight")}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="visible">Tampil ke Pengguna</option>
              <option value="hidden">Disembunyikan</option>
              <option value="highlight">Highlight Unggulan</option>
            </select>
          </div>

          {/* Filter Dropdown: Urutkan */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "oldest" | "title-asc" | "title-desc")
              }
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="newest">Terbaru Ditambahkan</option>
              <option value="oldest">Terlama</option>
              <option value="title-asc">Judul (A-Z)</option>
              <option value="title-desc">Judul (Z-A)</option>
            </select>
          </div>

          <div className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            {filteredGuides.length} panduan
          </div>
        </div>
      </div>

      {/* 3. Guides List */}
      {/* 3. Guides List / Loading / Empty State */}
      {isLoading && guides.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-xs text-gray-400">Memuat panduan dari database...</p>
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white">
            {searchQuery || statusFilter !== "all"
              ? "Tidak Ada Panduan Ditemukan"
              : "Belum Ada Panduan"}
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery || statusFilter !== "all"
              ? "Tidak ada item panduan yang cocok dengan filter atau kata kunci pencarian Anda."
              : "Belum ada panduan tutorial yang dibuat di database."}
          </p>
          {searchQuery || statusFilter !== "all" ? (
            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold cursor-pointer shadow-xs hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                Reset Filter
              </button>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Buat Panduan Baru
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Buat Panduan Baru
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredGuides.map((item) => {
            const isHidden = Boolean(item.isHidden);

            return (
              <div
                key={item.id}
                className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-2xs hover:shadow-md dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-all duration-200"
              >
                {/* Banner Thumbnail (1200:628 ratio) */}
                <div
                  onClick={() => setPreviewingGuide(item as unknown as PromoItem)}
                  className="relative w-full aspect-[1200/628] bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.bannerUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status badge top-left: Tampil vs Disembunyikan */}
                  <div className="absolute top-3 left-3">
                    {isHidden ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-amber-500/90 text-white border-amber-400/50 backdrop-blur-md shadow-xs">
                        <EyeOff className="w-3 h-3" />
                        Disembunyikan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-emerald-500/90 text-white border-emerald-400/50 backdrop-blur-md shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Tampil ke Pengguna
                      </span>
                    )}
                  </div>

                  {/* Top-right indicator (Highlight badge jika aktif) */}
                  {item.isHighlight && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-xs">
                        <Sparkles className="w-3 h-3 text-yellow-200" />
                        <span>Highlight</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content Body (Bersih tanpa banner 'Tampil langsung di Dashboard sakuin') */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3
                      onClick={() => setPreviewingGuide(item as unknown as PromoItem)}
                      className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Actions Bar */}
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/40 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewingGuide(item as unknown as PromoItem)}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {/* Quick Visibility Toggle Button (Dibalik: ditampilkan = mata terbuka, hidden = mata dicoret) */}
                    <button
                      type="button"
                      onClick={() => handleToggleHide(item)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title={
                        isHidden
                          ? "Sedang disembunyikan (klik untuk tampilkan)"
                          : "Sedang ditampilkan (klik untuk sembunyikan)"
                      }
                    >
                      {isHidden ? (
                        <EyeOff className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </button>

                    {/* Quick Highlight Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleHighlight(item)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title={item.isHighlight ? "Hapus dari Highlight" : "Jadikan Highlight"}
                    >
                      <Sparkles
                        className={cn(
                          "w-3.5 h-3.5 transition-colors",
                          item.isHighlight
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-400 hover:text-amber-500"
                        )}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title="Edit Panduan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const dup = await duplicateGuide(item.id);
                          if (dup) {
                            showToast(`Panduan "${item.title}" berhasil diduplikasi!`, "success");
                          }
                        } catch {
                          // Error toast emitted by store
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title="Duplikat Panduan"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingGuide(item as unknown as PromoItem)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Hapus Panduan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <EditGuideModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        guide={editingGuide}
        onSave={handleSaveGuide}
      />

      <PromoDetailModal
        promo={previewingGuide}
        onClose={() => setPreviewingGuide(null)}
        onEdit={(guide) => {
          setPreviewingGuide(null);
          handleOpenEdit(guide as unknown as GuideItem);
        }}
        onDelete={(guide) => {
          setPreviewingGuide(null);
          setDeletingGuide(guide);
        }}
      />

      <DeletePromoModal
        promo={deletingGuide}
        isOpen={!!deletingGuide}
        onClose={() => setDeletingGuide(null)}
        onConfirm={async () => {
          if (deletingGuide) {
            const title = deletingGuide.title;
            const id = deletingGuide.id;
            setDeletingGuide(null);
            try {
              await deleteGuide(id);
              showToast(`Panduan "${title}" berhasil dihapus.`, "success");
            } catch {
              // Error toast emitted by store
            }
          }
        }}
      />
    </div>
  );
};

export default AdminGuidesLayout;
export const AdminPanduanLayout = AdminGuidesLayout;
