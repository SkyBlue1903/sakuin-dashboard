"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Search,
  Calendar,
  Clock,
  Eye,
  Edit2,
  Copy,
  Trash2,
  RotateCcw,
  EyeOff,
  Gift,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/utils";
import { usePromoStore, getPromoStatus, getPromoStatusBadge } from "@/stores/usePromoStore";
import type { PromoItem } from "@/models/promo";
import EditPromoModal from "@/views/admin/EditPromoModal";
import PromoDetailModal from "@/views/admin/PromoDetailModal";
import DeletePromoModal from "@/views/admin/DeletePromoModal";
import { useToast } from "@/stores/ToastContext";

export const AdminPromoLayout: React.FC = () => {
  const { promos, isLoading, loadPromos, addPromo, updatePromo, deletePromo, duplicatePromo } =
    usePromoStore();
  const { showToast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "scheduled" | "expired" | "hidden" | "highlight"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "ending_soon" | "title">("newest");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoItem | null>(null);
  const [previewingPromo, setPreviewingPromo] = useState<PromoItem | null>(null);
  const [deletingPromo, setDeletingPromo] = useState<PromoItem | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    loadPromos(true);
  }, [loadPromos]);

  // Filter only type === "promo"
  const promoItems = promos.filter((p) => p.type === "promo" || !p.type);

  // Filter & Search logic
  const filteredPromos = promoItems
    .filter((promo) => {
      const status = getPromoStatus(promo);
      const isHidden = Boolean(promo.isHidden);
      const isHighlight = Boolean(promo.isHighlight);

      if (filterStatus === "active" && status !== "active") return false;
      if (filterStatus === "scheduled" && status !== "scheduled") return false;
      if (filterStatus === "expired" && status !== "expired") return false;
      if (filterStatus === "hidden" && !isHidden) return false;
      if (filterStatus === "highlight" && !isHighlight) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        promo.title.toLowerCase().includes(q) ||
        promo.shortDescription.toLowerCase().includes(q) ||
        (promo.bannerLink && promo.bannerLink.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return Number(b.id) - Number(a.id);
      }
      if (sortBy === "oldest") {
        return Number(a.id) - Number(b.id);
      }
      if (sortBy === "ending_soon") {
        const timeA = a.takedownAt ? new Date(a.takedownAt).getTime() : Infinity;
        const timeB = b.takedownAt ? new Date(b.takedownAt).getTime() : Infinity;
        return timeA - timeB;
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const handleOpenCreateModal = () => {
    setEditingPromo(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (item: PromoItem) => {
    setEditingPromo(item);
    setIsEditModalOpen(true);
  };

  const handleSavePromo = async (promoData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingPromo) {
        const res = await updatePromo(editingPromo.id, promoData);
        showToast(res.message, "success");
      } else {
        const res = await addPromo(promoData);
        showToast(res.message, "success");
      }
    } catch {
      // Error handled with toast in store
    }
  };

  const handleToggleHide = async (item: PromoItem) => {
    const nextHidden = !item.isHidden;
    try {
      await updatePromo(item.id, { isHidden: nextHidden });
      showToast(
        nextHidden
          ? `Promosi "${item.title}" sekarang disembunyikan dari pengguna.`
          : `Promosi "${item.title}" sekarang ditampilkan ke pengguna.`,
        "success"
      );
    } catch {
      // Error handled in store
    }
  };

  const handleToggleHighlight = async (item: PromoItem) => {
    const nextHighlight = !item.isHighlight;
    try {
      await updatePromo(item.id, { isHighlight: nextHighlight });
      showToast(
        nextHighlight
          ? `Promosi "${item.title}" dijadikan Highlight Unggulan.`
          : `Promosi "${item.title}" dihapus dari Highlight.`,
        "success"
      );
    } catch {
      // Error handled in store
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingPromo) {
      try {
        const res = await deletePromo(deletingPromo.id);
        showToast(res.message, "success");
      } catch {
        // Error handled in store
      } finally {
        setDeletingPromo(null);
      }
    }
  };

  const handleDuplicate = async (item: PromoItem) => {
    try {
      const duplicated = await duplicatePromo(item.id);
      if (duplicated) {
        showToast(`Promosi "${duplicated.title}" berhasil diduplikasi!`, "success");
      }
    } catch {
      // Error handled in store
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full flex-1 md:overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <Gift className="w-4 h-4" />
            <span>Manajemen Promosi Sakuin</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Kelola Promosi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Atur banner penawaran, periode promo, diskon merchant, dan program reward untuk pengguna (tersinkronisasi ke Supabase).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              loadPromos(true);
              showToast("Data promosi disegarkan dari Supabase");
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Promo</span>
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
            placeholder="Cari judul promo atau deskripsi..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filter Dropdowns Section */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Dropdown: Status Promosi */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
            <span className="text-xs text-gray-400 hidden sm:inline">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "active" | "scheduled" | "expired" | "hidden" | "highlight"
                )
              }
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="scheduled">Dijadwalkan</option>
              <option value="expired">Berakhir</option>
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
                setSortBy(e.target.value as "newest" | "oldest" | "ending_soon" | "title")
              }
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="newest">Terbaru Ditambahkan</option>
              <option value="oldest">Terlama</option>
              <option value="ending_soon">Segera Berakhir</option>
              <option value="title">Judul (A-Z)</option>
            </select>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            {filteredPromos.length} promosi
          </div>
        </div>
      </div>

      {/* 3. Grid Daftar Kartu Promosi */}
      {isLoading && promoItems.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 animate-pulse space-y-4"
            >
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredPromos.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="inline-flex p-4 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-3">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Tidak ada promosi ditemukan
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ada promosi yang cocok dengan kata kunci "${searchQuery}".`
              : "Belum ada promosi yang tersimpan di database. Silakan tambahkan promosi baru."}
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Promosi Sekarang</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPromos.map((item) => {
            const badge = getPromoStatusBadge(item);
            const isHidden = Boolean(item.isHidden);

            return (
              <div
                key={item.id}
                className={cn(
                  "group rounded-2xl border bg-white dark:bg-gray-900 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md",
                  isHidden
                    ? "border-dashed border-gray-300 dark:border-gray-700 opacity-80"
                    : "border-gray-200/80 dark:border-gray-800 hover:border-blue-500/30"
                )}
              >
                {/* Banner Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.bannerUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80";
                    }}
                  />

                  {/* Badges on Banner */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-2xs",
                        badge.colorClass
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", badge.dotClass)} />
                      {badge.label}
                    </span>

                    {item.isHighlight && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-2xs">
                        <Sparkles className="w-3 h-3 text-amber-100" />
                        Highlight
                      </span>
                    )}
                  </div>

                  {/* Hidden Indicator Badge */}
                  {isHidden && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-900/80 text-gray-200 backdrop-blur-md">
                        <EyeOff className="w-3 h-3 text-amber-400" />
                        Disembunyikan
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3
                      onClick={() => setPreviewingPromo(item)}
                      className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Dates schedule */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1 text-[11px] text-gray-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-500" />
                        Terbit:
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                    {item.takedownAt && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-red-500" />
                          Selesai:
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {formatDate(item.takedownAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions Bar */}
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/40 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewingPromo(item)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
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
                      title="Edit Promosi"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(item)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title="Duplikasi Promosi"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingPromo(item)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Hapus Promosi"
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
      <EditPromoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        promo={editingPromo}
        onSave={handleSavePromo}
      />

      <PromoDetailModal
        promo={previewingPromo}
        onClose={() => setPreviewingPromo(null)}
        onEdit={(p) => {
          setPreviewingPromo(null);
          handleOpenEdit(p);
        }}
        onDelete={(p) => {
          setPreviewingPromo(null);
          setDeletingPromo(p);
        }}
      />

      <DeletePromoModal
        isOpen={Boolean(deletingPromo)}
        onClose={() => setDeletingPromo(null)}
        promo={deletingPromo}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminPromoLayout;
