"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Copy,
  Trash2,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { usePromo, getPromoStatusBadge } from "@/stores/usePromoStore";
import type { PromoItem } from "@/models/promo";
import EditGuideModal from "@/views/admin/EditGuideModal";
import PromoDetailModal from "@/views/admin/PromoDetailModal";
import DeletePromoModal from "@/views/admin/DeletePromoModal";
import { useToast } from "@/stores/ToastContext";

export const AdminGuidesLayout: React.FC = () => {
  const { promos, addPromo, updatePromo, deletePromo, duplicatePromo, resetToDefault } =
    usePromo();
  const { showToast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<PromoItem | null>(null);
  const [previewingGuide, setPreviewingGuide] = useState<PromoItem | null>(null);
  const [deletingGuide, setDeletingGuide] = useState<PromoItem | null>(null);

  // Filter only type === "guide"
  const guideItems = promos.filter((p) => p.type === "guide");
  const totalCount = guideItems.length;

  // Filter & Search logic
  const filteredGuides = guideItems
    .filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const handleOpenCreateModal = () => {
    setEditingGuide(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (item: PromoItem) => {
    setEditingGuide(item);
    setIsEditModalOpen(true);
  };

  const handleSaveGuide = (guideData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => {
    if (editingGuide) {
      updatePromo(editingGuide.id, guideData);
      showToast(`Panduan "${guideData.title}" berhasil diperbarui!`);
    } else {
      addPromo(guideData);
      showToast(`Panduan "${guideData.title}" berhasil ditambahkan!`);
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
            Atur tutorial langkah demi langkah dan dokumentasi penggunaan kartu virtual langsung di dashboard pengguna (tanpa tanggal terbit).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={resetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Reset ke dummy bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Sampel (#DEV)</span>
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

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        {/* Total Panduan */}
        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Total Panduan</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {totalCount}
            </span>
            <span className="text-[11px] text-gray-400">panduan aktif</span>
          </div>
        </div>

        {/* Status Evergreen */}
        <div className="p-4 rounded-2xl border border-emerald-100 dark:border-emerald-950/30 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Akses Pengguna
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
              {totalCount}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">di dashboard</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search */}
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

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="newest">Terbaru Ditambahkan</option>
            <option value="title">Judul (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 4. Guides List (Strictly NO published date) */}
      {filteredGuides.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white">
            Tidak Ada Panduan Ditemukan
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery
              ? "Tidak ada item panduan yang cocok dengan kata kunci pencarian Anda."
              : "Belum ada panduan tutorial yang dibuat."}
          </p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredGuides.map((item) => {
            const badge = getPromoStatusBadge(item);

            return (
              <div
                key={item.id}
                className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-2xs hover:shadow-md dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-all duration-200"
              >
                {/* Banner Thumbnail (1200:628 ratio) */}
                <div
                  onClick={() => setPreviewingGuide(item)}
                  className="relative w-full aspect-[1200/628] bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.bannerUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status badge top-left */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40 backdrop-blur-md shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {badge.label}
                    </span>
                  </div>

                  {/* Top-right indicator */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-md shadow-xs">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Interaktif</span>
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Title */}
                    <h3
                      onClick={() => setPreviewingGuide(item)}
                      className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Feature indicator (Strictly NO publication date) */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50/60 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg">
                      <BookOpen className="w-3 h-3" />
                      <span>Tampil langsung di Dashboard Sakuin</span>
                    </span>
                  </div>
                </div>

                {/* Card Bottom Actions Bar */}
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/40 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewingGuide(item)}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail</span>
                  </button>

                  <div className="flex items-center gap-1">
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
                      onClick={() => {
                        duplicatePromo(item.id);
                        showToast(`Panduan "${item.title}" berhasil diduplikasi!`);
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title="Duplikat Panduan"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingGuide(item)}
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

      {/* 5. Modals */}
      {/* Guide Add/Edit Modal */}
      <EditGuideModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        guide={editingGuide}
        onSave={handleSaveGuide}
      />

      {/* Guide Detail Preview Modal */}
      <PromoDetailModal
        promo={previewingGuide}
        onClose={() => setPreviewingGuide(null)}
        onEdit={(item) => {
          setPreviewingGuide(null);
          handleOpenEdit(item);
        }}
        onDelete={(item) => {
          setPreviewingGuide(null);
          setDeletingGuide(item);
        }}
      />

      {/* Guide Delete Modal */}
      <DeletePromoModal
        isOpen={!!deletingGuide}
        onClose={() => setDeletingGuide(null)}
        promo={deletingGuide}
        onConfirm={() => {
          if (deletingGuide) {
            deletePromo(deletingGuide.id);
            showToast(`Panduan "${deletingGuide.title}" berhasil dihapus.`);
            setDeletingGuide(null);
          }
        }}
      />
    </div>
  );
};

export const AdminPanduanLayout = AdminGuidesLayout;
export default AdminGuidesLayout;

