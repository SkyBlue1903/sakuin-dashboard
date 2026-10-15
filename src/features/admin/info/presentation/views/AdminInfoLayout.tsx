"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Copy,
  Trash2,
  RotateCcw,
  Info as InfoIcon,
  EyeOff,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { useInfoStore } from "@/features/user/info/presentation/stores/useInfoStore";
import type { InfoItem } from "@/features/user/info/domain/info";
import type { PromoItem } from "@/features/user/promo/domain/promo";
import EditInfoModal from "@/features/admin/info/presentation/components/EditInfoModal";
import PromoDetailModal from "@/features/user/promo/presentation/components/PromoDetailModal";
import DeletePromoModal from "@/features/admin/promo/presentation/components/DeletePromoModal";
import { useToast } from "@/shared/presentation/stores/ToastContext";

export const AdminInfoLayout: React.FC = () => {
  const { infos, isLoading, loadInfos, addInfo, updateInfo, deleteInfo, duplicateInfo } =
    useInfoStore();
  const { showToast } = useToast();

  // Filters & search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "visible" | "hidden" | "highlight">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title-asc" | "title-desc">("newest");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<InfoItem | null>(null);
  const [previewingInfo, setPreviewingInfo] = useState<PromoItem | null>(null);
  const [deletingInfo, setDeletingInfo] = useState<PromoItem | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    loadInfos(true);
  }, [loadInfos]);

  // Filter & Search logic
  const filteredInfos = infos
    .filter((item) => {
      const isHidden = Boolean(item.isHidden);
      const isHighlight = Boolean(item.isHighlight);

      if (statusFilter === "visible" && isHidden) return false;
      if (statusFilter === "hidden" && !isHidden) return false;
      if (statusFilter === "highlight" && !isHighlight) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        item.title.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        (item.bannerLink && item.bannerLink.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return Number(b.id) - Number(a.id);
      }
      if (sortBy === "oldest") {
        return Number(a.id) - Number(b.id);
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
    setEditingInfo(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (item: InfoItem) => {
    setEditingInfo(item);
    setIsEditModalOpen(true);
  };

  const handleSaveInfo = async (infoData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingInfo) {
        const res = await updateInfo(editingInfo.id, infoData);
        showToast(res.message, "success");
      } else {
        const res = await addInfo(infoData);
        showToast(res.message, "success");
      }
    } catch {
      // Error handled with toast in store
    }
  };

  const handleToggleHide = async (item: InfoItem) => {
    const nextHidden = !item.isHidden;
    try {
      await updateInfo(item.id, { isHidden: nextHidden });
      showToast(
        nextHidden
          ? `Informasi "${item.title}" sekarang disembunyikan dari pengguna.`
          : `Informasi "${item.title}" sekarang ditampilkan ke pengguna.`,
        "success"
      );
    } catch {
      // Error handled in store
    }
  };

  const handleToggleHighlight = async (item: InfoItem) => {
    const nextHighlight = !item.isHighlight;
    try {
      await updateInfo(item.id, { isHighlight: nextHighlight });
      showToast(
        nextHighlight
          ? `Informasi "${item.title}" dijadikan Highlight Unggulan.`
          : `Informasi "${item.title}" dihapus dari Highlight.`,
        "success"
      );
    } catch {
      // Error handled in store
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingInfo) {
      try {
        const res = await deleteInfo(deletingInfo.id);
        showToast(res.message, "success");
      } catch {
        // Error handled in store
      } finally {
        setDeletingInfo(null);
      }
    }
  };

  const handleDuplicate = async (item: InfoItem) => {
    try {
      const duplicated = await duplicateInfo(item.id);
      if (duplicated) {
        showToast(`Informasi "${duplicated.title}" berhasil diduplikasi!`, "success");
      }
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="w-full flex-1 md:overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <InfoIcon className="w-4 h-4" />
            <span>Manajemen Informasi Sakuin</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight">
            Kelola Informasi
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Atur pengumuman resmi, berita pembaruan layanan, dan informasi langsung di dashboard pengguna (tersinkronisasi ke Supabase).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              loadInfos(true);
              showToast("Data informasi disegarkan dari Supabase");
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-secondary text-xs font-semibold shadow-ds-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Segarkan data dari database"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Segarkan</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-text-inverse text-xs sm:text-sm font-semibold shadow-ds-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Informasi</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar (Dropdown Status & Dropdown Urutkan) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul informasi atau deskripsi..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-surface text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-ds-xs transition-all"
          />
        </div>

        {/* Filter Dropdowns Section */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown: Status Informasi */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-text-tertiary hidden sm:inline" />
            <span className="text-xs text-text-tertiary hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "visible" | "hidden" | "highlight")
              }
              className="px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer shadow-ds-xs"
            >
              <option value="all">Semua Status</option>
              <option value="visible">Tampil ke Pengguna</option>
              <option value="hidden">Disembunyikan</option>
              <option value="highlight">Highlight Unggulan</option>
            </select>
          </div>

          {/* Filter Dropdown: Urutkan */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-tertiary hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "oldest" | "title-asc" | "title-desc")
              }
              className="px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer shadow-ds-xs"
            >
              <option value="newest">Terbaru Ditambahkan</option>
              <option value="oldest">Terlama</option>
              <option value="title-asc">Judul (A-Z)</option>
              <option value="title-desc">Judul (Z-A)</option>
            </select>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-surface-secondary text-[11px] text-text-tertiary font-medium border border-border-subtle">
            {filteredInfos.length} informasi
          </div>
        </div>
      </div>

      {/* 3. List of Cards / Loading / Empty State */}
      {isLoading && infos.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-surface border border-border-subtle p-8">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-text-tertiary">Memuat informasi dari database...</p>
        </div>
      ) : filteredInfos.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-surface border border-border-subtle p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <InfoIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-text-primary">
            {searchQuery || statusFilter !== "all"
              ? "Tidak Ada Informasi Ditemukan"
              : "Belum Ada Informasi"}
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mt-1 mb-5">
            {searchQuery || statusFilter !== "all"
              ? "Tidak ada item informasi yang cocok dengan filter atau kata kunci pencarian Anda."
              : "Belum ada informasi pengumuman yang dibuat di database."}
          </p>
          {searchQuery || statusFilter !== "all" ? (
            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-surface text-text-secondary text-xs font-semibold cursor-pointer shadow-ds-xs hover:bg-surface-secondary"
              >
                Reset Filter
              </button>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-text-inverse text-xs font-semibold cursor-pointer shadow-ds-xs"
              >
                <Plus className="w-4 h-4" />
                Buat Informasi Baru
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-text-inverse text-xs font-semibold cursor-pointer shadow-ds-xs"
            >
              <Plus className="w-4 h-4" />
              Buat Informasi Baru
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredInfos.map((item) => {
            const isHidden = Boolean(item.isHidden);

            return (
              <div
                key={item.id}
                className="group flex flex-col rounded-3xl border border-border-subtle bg-surface shadow-ds-xs hover:shadow-ds-md hover:border-border overflow-hidden transition-all duration-200"
              >
                {/* Banner Thumbnail (1200:628 ratio) */}
                <div
                  onClick={() => setPreviewingInfo(item as unknown as PromoItem)}
                  className="relative w-full aspect-[1200/628] bg-surface-secondary overflow-hidden cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.bannerUrl}
                    alt={item.title}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-secondary/90 text-text-inverse border-secondary/50 backdrop-blur-md shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
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

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3
                      onClick={() => setPreviewingInfo(item as unknown as PromoItem)}
                      className="text-sm sm:text-base font-bold text-text-primary line-clamp-2 hover:text-primary cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Actions Bar */}
                <div className="px-4 py-3 border-t border-border-subtle bg-surface-secondary/40 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewingInfo(item as unknown as PromoItem)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
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
                      title="Edit Informasi"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(item)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title="Duplikat Informasi"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingInfo(item as unknown as PromoItem)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Hapus Informasi"
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
      <EditInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        info={editingInfo}
        onSave={handleSaveInfo}
      />

      <PromoDetailModal
        promo={previewingInfo}
        onClose={() => setPreviewingInfo(null)}
        onEdit={(item) => {
          setPreviewingInfo(null);
          handleOpenEdit(item as InfoItem);
        }}
        onDelete={(item) => {
          setPreviewingInfo(null);
          setDeletingInfo(item as unknown as PromoItem);
        }}
      />

      <DeletePromoModal
        isOpen={!!deletingInfo}
        onClose={() => setDeletingInfo(null)}
        promo={deletingInfo}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminInfoLayout;
