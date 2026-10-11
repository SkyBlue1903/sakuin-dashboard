"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  ExternalLink,
  Eye,
  Edit2,
  Copy,
  Trash2,
  RotateCcw,
  Info as InfoIcon,
  CheckCircle2,
  Clock,
  EyeOff,
  BookOpen,
} from "lucide-react";
import { cn } from "@/utils";
import {
  usePromo,
  PromoItem,
  getPromoStatusBadge,
} from "@/context/PromoContext";
import EditInfoModal from "@/components/admin/EditInfoModal";
import PromoDetailModal from "@/components/admin/PromoDetailModal";
import DeletePromoModal from "@/components/admin/DeletePromoModal";

export const AdminInfoLayout: React.FC = () => {
  const { promos, addPromo, updatePromo, deletePromo, duplicatePromo, resetToDefault } =
    usePromo();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "scheduled">("all");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<PromoItem | null>(null);
  const [previewingInfo, setPreviewingInfo] = useState<PromoItem | null>(null);
  const [deletingInfo, setDeletingInfo] = useState<PromoItem | null>(null);

  // Filter only type === "info"
  const infoItems = promos.filter((p) => p.type === "info");

  // Status counts
  const now = new Date().getTime();
  const totalCount = infoItems.length;
  const publishedCount = infoItems.filter((p) => {
    const pub = p.publishedAt ? new Date(p.publishedAt).getTime() : 0;
    return now >= pub;
  }).length;
  const scheduledCount = infoItems.filter((p) => {
    const pub = p.publishedAt ? new Date(p.publishedAt).getTime() : 0;
    return now < pub;
  }).length;
  const hiddenCount = infoItems.filter(
    (p) => p.hideBeforePublished && now < (p.publishedAt ? new Date(p.publishedAt).getTime() : 0)
  ).length;

  // Filter & Search logic
  const filteredInfos = infoItems
    .filter((item) => {
      const pub = item.publishedAt ? new Date(item.publishedAt).getTime() : 0;
      const isPublished = now >= pub;

      if (filterStatus === "published" && !isPublished) return false;
      if (filterStatus === "scheduled" && isPublished) return false;

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
        return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const handleOpenCreateModal = () => {
    setEditingInfo(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (item: PromoItem) => {
    setEditingInfo(item);
    setIsEditModalOpen(true);
  };

  const handleSaveInfo = (infoData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => {
    if (editingInfo) {
      updatePromo(editingInfo.id, infoData);
    } else {
      addPromo(infoData);
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
            <InfoIcon className="w-4 h-4" />
            <span>Manajemen Informasi Sakuin</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Kelola Informasi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Atur pengumuman sistem, berita pembaruan layanan, jadwal terbit, dan checklist sembunyikan sebelum terbit.
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
            <span className="hidden sm:inline">Reset Sampel</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Informasi</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Informasi */}
        <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Total Informasi</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <InfoIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {totalCount}
            </span>
            <span className="text-[11px] text-gray-400">konten</span>
          </div>
        </div>

        {/* Sudah Terbit */}
        <div className="p-4 rounded-2xl border border-emerald-100 dark:border-emerald-950/30 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Sudah Terbit (Publik)
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
              {publishedCount}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">aktif</span>
          </div>
        </div>

        {/* Terjadwal */}
        <div className="p-4 rounded-2xl border border-purple-100 dark:border-purple-950/30 bg-purple-50/20 dark:bg-purple-950/10 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              Terjadwal
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

        {/* Disembunyikan Sebelum Terbit */}
        <div className="p-4 rounded-2xl border border-amber-100 dark:border-amber-950/30 bg-amber-50/20 dark:bg-amber-950/10 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Disembunyikan
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-400">
              {hiddenCount}
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400">dari user</span>
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
            placeholder="Cari judul informasi atau deskripsi..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  ? "bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-400 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              Semua ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("published")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                filterStatus === "published"
                  ? "bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              Terbit ({publishedCount})
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
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="newest">Terbit Terbaru</option>
            <option value="title">Judul (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 4. Information Cards List */}
      {filteredInfos.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500">
            <InfoIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white">
            Tidak Ada Informasi Ditemukan
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery
              ? "Tidak ada item informasi yang cocok dengan kata kunci pencarian Anda."
              : "Belum ada informasi dalam kategori filter ini."}
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Buat Informasi Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredInfos.map((item) => {
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
                  onClick={() => setPreviewingInfo(item)}
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
                      {isScheduled ? (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Terjadwal</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Terbit</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Title */}
                    <h3
                      onClick={() => setPreviewingInfo(item)}
                      className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
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
                        <Calendar className="w-3 h-3 text-blue-500" />
                        Terbit: {formatDate(item.publishedAt)}
                      </span>
                    </div>

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
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline max-w-full truncate"
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
                    onClick={() => setPreviewingInfo(item)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail</span>
                  </button>

                  <div className="flex items-center gap-1">
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
                      onClick={() => duplicatePromo(item.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title="Duplikat Informasi"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingInfo(item)}
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

      {/* 5. Modals */}
      {/* Info Add/Edit Modal */}
      <EditInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        info={editingInfo}
        onSave={handleSaveInfo}
      />

      {/* Info Detail Preview Modal */}
      <PromoDetailModal
        promo={previewingInfo}
        onClose={() => setPreviewingInfo(null)}
        onEdit={(item) => {
          setPreviewingInfo(null);
          handleOpenEdit(item);
        }}
        onDelete={(item) => {
          setPreviewingInfo(null);
          setDeletingInfo(item);
        }}
      />

      {/* Info Delete Modal */}
      <DeletePromoModal
        isOpen={!!deletingInfo}
        onClose={() => setDeletingInfo(null)}
        promo={deletingInfo}
        onConfirm={() => {
          if (deletingInfo) {
            deletePromo(deletingInfo.id);
            setDeletingInfo(null);
          }
        }}
      />
    </div>
  );
};

export default AdminInfoLayout;
