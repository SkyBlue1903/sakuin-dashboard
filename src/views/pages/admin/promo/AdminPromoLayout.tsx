"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  Search,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  Edit2,
  Copy,
  Trash2,
  RotateCcw,
  CheckCircle2,
  EyeOff,
  Gift,
  Flame,
} from "lucide-react";
import { cn } from "@/utils";
import { usePromo, getPromoStatus, getPromoStatusBadge } from "@/stores/usePromoStore";
import type { PromoItem } from "@/models/promo";
import EditPromoModal from "@/views/admin/EditPromoModal";
import PromoDetailModal from "@/views/admin/PromoDetailModal";
import DeletePromoModal from "@/views/admin/DeletePromoModal";

export const AdminPromoLayout: React.FC = () => {
  const { promos, addPromo, updatePromo, deletePromo, duplicatePromo, resetToDefault } =
    usePromo();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "scheduled" | "expired">("all");
  const [sortBy, setSortBy] = useState<"newest" | "ending_soon" | "title">("newest");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoItem | null>(null);
  const [previewingPromo, setPreviewingPromo] = useState<PromoItem | null>(null);
  const [deletingPromo, setDeletingPromo] = useState<PromoItem | null>(null);

  // Filter only type === "promo"
  const promoItems = promos.filter((p) => p.type === "promo");

  // Status counts
  const now = new Date().getTime();
  const totalCount = promoItems.length;
  const activeCount = promoItems.filter((p) => getPromoStatus(p) === "active").length;
  const scheduledCount = promoItems.filter((p) => getPromoStatus(p) === "scheduled").length;
  const expiredCount = promoItems.filter((p) => getPromoStatus(p) === "expired").length;

  // Filter & Search logic
  const filteredPromos = promoItems
    .filter((promo) => {
      const status = getPromoStatus(promo);
      if (filterStatus === "active" && status !== "active") return false;
      if (filterStatus === "scheduled" && status !== "scheduled") return false;
      if (filterStatus === "expired" && status !== "expired") return false;

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
        return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
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

  const handleSavePromo = (promoData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => {
    if (editingPromo) {
      updatePromo(editingPromo.id, promoData);
    } else {
      addPromo(promoData);
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

  const calculateDaysRemaining = (promo: PromoItem) => {
    const down = promo.takedownAt ? new Date(promo.takedownAt).getTime() : 0;
    const pub = promo.publishedAt ? new Date(promo.publishedAt).getTime() : 0;

    if (now < pub) {
      const diffDays = Math.ceil((pub - now) / (1000 * 60 * 60 * 24));
      return `Mulai dalam ${diffDays} hari`;
    }
    if (down && now > down) {
      return "Berakhir";
    }
    if (down) {
      const diffDays = Math.ceil((down - now) / (1000 * 60 * 60 * 24));
      return `Sisa ${diffDays} hari lagi`;
    }
    return "Aktif";
  };

  return (
    <div className="w-full flex-1 md:overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Manajemen Promo & Penawaran Sakuin</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Kelola Promo
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Kelola banner promosi merchant, diskon belanja, jadwal tayang & takedown, serta checklist sembunyikan sebelum terbit.
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Promo</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Promo */}
        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Total Promo</span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {totalCount}
            </span>
            <span className="text-[11px] text-gray-400">penawaran</span>
          </div>
        </div>

        {/* Sedang Aktif */}
        <div className="p-4 rounded-2xl border border-emerald-100 dark:border-emerald-950/30 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Sedang Aktif
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
              {activeCount}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">berjalan</span>
          </div>
        </div>

        {/* Dijadwalkan */}
        <div className="p-4 rounded-2xl border border-purple-100 dark:border-purple-950/30 bg-purple-50/20 dark:bg-purple-950/10 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              Dijadwalkan
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-700 dark:text-purple-400">
              {scheduledCount}
            </span>
            <span className="text-[11px] text-purple-600 dark:text-purple-400">mendatang</span>
          </div>
        </div>

        {/* Telah Berakhir */}
        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/30 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Telah Berakhir</span>
            <div className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-700 dark:text-gray-300">
              {expiredCount}
            </span>
            <span className="text-[11px] text-gray-400">selesai</span>
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
            placeholder="Cari judul promo atau merchant..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Filter Pills & Sort */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                filterStatus === "all"
                  ? "bg-white dark:bg-gray-900 text-brand-700 dark:text-brand-400 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              Semua ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("active")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                filterStatus === "active"
                  ? "bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              Aktif ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("scheduled")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                filterStatus === "scheduled"
                  ? "bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              Terjadwal ({scheduledCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("expired")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                filterStatus === "expired"
                  ? "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              Berakhir ({expiredCount})
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="newest">Terbit Terbaru</option>
            <option value="ending_soon">Segera Berakhir</option>
            <option value="title">Judul (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 4. Promo Cards List */}
      {filteredPromos.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center text-brand-500">
            <Gift className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white">
            Tidak Ada Promo Ditemukan
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery
              ? "Tidak ada item promo yang cocok dengan kata kunci pencarian Anda."
              : "Belum ada promo dalam kategori filter ini."}
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Buat Promo Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPromos.map((item) => {
            const badge = getPromoStatusBadge(item);
            const pubTime = item.publishedAt ? new Date(item.publishedAt).getTime() : 0;
            const isScheduled = now < pubTime;
            const isHidden = item.hideBeforePublished && isScheduled;

            return (
              <div
                key={item.id}
                className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-2xs hover:shadow-md dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-all duration-200"
              >
                {/* Banner Thumbnail (1200:628 ratio) */}
                <div
                  onClick={() => setPreviewingPromo(item)}
                  className="relative w-full aspect-[1200/628] bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.bannerUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status badge top-left */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md shadow-xs",
                        badge.colorClass
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", badge.dotClass)} />
                      {badge.label}
                    </span>
                    {isHidden && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/95 text-white backdrop-blur-md shadow-xs border border-amber-400/40">
                        <EyeOff className="w-3 h-3" />
                        Disembunyikan
                      </span>
                    )}
                  </div>

                  {/* Top-right indicator */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-md shadow-xs">
                      <Clock className="w-3 h-3" />
                      <span>{calculateDaysRemaining(item)}</span>
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Title */}
                    <h3
                      onClick={() => setPreviewingPromo(item)}
                      className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Schedule & Links Footer info */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-brand-500" />
                        Terbit: {formatDate(item.publishedAt)}
                      </span>
                    </div>
                    {item.takedownAt && (
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          Takedown: {formatDate(item.takedownAt)}
                        </span>
                      </div>
                    )}

                    {/* Hidden from user status indicator */}
                    {item.hideBeforePublished && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                        <EyeOff className="w-3.5 h-3.5 shrink-0" />
                        <span className="leading-tight">
                          {isHidden
                            ? "Disembunyikan dari pengguna sebelum terbit"
                            : "Sudah lewat tanggal terbit (terlihat publik)"}
                        </span>
                      </div>
                    )}

                    {/* Banner Target Link if present */}
                    {item.bannerLink && (
                      <div className="pt-1">
                        <a
                          href={item.bannerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:underline max-w-full truncate"
                          title={item.bannerLink}
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{item.bannerLink}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions Bar */}
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/40 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewingPromo(item)}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title="Edit Promo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicatePromo(item.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title="Duplikat Promo"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingPromo(item)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Hapus Promo"
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
      {/* Promo Add/Edit Modal */}
      <EditPromoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        promo={editingPromo}
        onSave={handleSavePromo}
      />

      {/* Promo Detail Preview Modal */}
      <PromoDetailModal
        promo={previewingPromo}
        onClose={() => setPreviewingPromo(null)}
        onEdit={(item) => {
          setPreviewingPromo(null);
          handleOpenEdit(item);
        }}
        onDelete={(item) => {
          setPreviewingPromo(null);
          setDeletingPromo(item);
        }}
      />

      {/* Promo Delete Modal */}
      <DeletePromoModal
        isOpen={!!deletingPromo}
        onClose={() => setDeletingPromo(null)}
        promo={deletingPromo}
        onConfirm={() => {
          if (deletingPromo) {
            deletePromo(deletingPromo.id);
            setDeletingPromo(null);
          }
        }}
      />
    </div>
  );
};

export default AdminPromoLayout;
