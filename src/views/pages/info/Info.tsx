"use client";

import React, { useState } from "react";
import {
  Search,
  Calendar,
  ChevronRight,
  X,
  Info as InfoIcon,
  Megaphone,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/utils";
import { usePromo } from "@/stores/usePromoStore";
import type { PromoItem } from "@/models/promo";
import { Modal } from "@/views/ui/modal";

export const Info: React.FC = () => {
  const { promos } = usePromo();

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInfo, setSelectedInfo] = useState<PromoItem | null>(null);

  // Filter only type === "info" and respect hideBeforePublished
  const visibleInfos = promos
    .filter((p) => p.type === "info")
    .filter((p) => {
      if (!p.hideBeforePublished) return true;
      const now = new Date().getTime();
      const pub = p.publishedAt ? new Date(p.publishedAt).getTime() : 0;
      return now >= pub;
    });

  // Filter by search query
  const filteredInfos = visibleInfos
    .filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());

  // Featured latest info
  const featuredInfo = filteredInfos[0] || null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleOpenReader = (info: PromoItem) => {
    setSelectedInfo(info);
  };

  return (
    <div className="w-full flex-1 md:overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-7">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <InfoIcon className="w-4 h-4" />
            <span>Pusat Informasi Sakuin</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Informasi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Pusat pengumuman penting, berita pembaruan layanan, dan informasi resmi Sakuin.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72 lg:w-80 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul informasi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Featured Highlight Card (If available and no search query) */}
      {!searchQuery && featuredInfo && (
        <div
          onClick={() => handleOpenReader(featuredInfo)}
          className="relative rounded-3xl overflow-hidden border border-blue-100 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 dark:from-blue-950/30 dark:via-gray-900 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-7 items-center">
            {/* Banner preview */}
            <div className="lg:col-span-7 xl:col-span-7 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 aspect-[1200/628] bg-gray-100 dark:bg-gray-800 relative shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredInfo.bannerUrl}
                alt={featuredInfo.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-sm">
                  <Megaphone className="w-3.5 h-3.5" />
                  Pengumuman Terbaru
                </span>
              </div>
            </div>

            {/* Info details */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-3.5">
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Terbit: {formatDate(featuredInfo.publishedAt)}</span>
              </div>

              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {featuredInfo.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {featuredInfo.shortDescription}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <InfoIcon className="w-4 h-4" />
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Section Title / Counter */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <InfoIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Semua Informasi
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
            {filteredInfos.length}
          </span>
        </div>
      </div>

      {/* 4. Grid of Information */}
      {filteredInfos.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500">
            <InfoIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white">
            Tidak Ada Informasi Ditemukan
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
            {searchQuery
              ? "Tidak ada informasi yang sesuai dengan kata kunci pencarian Anda."
              : "Belum ada informasi yang diterbitkan saat ini."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInfos.map((info) => (
            <div
              key={info.id}
              onClick={() => handleOpenReader(info)}
              className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-2xs hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-all duration-300 cursor-pointer"
            >
              {/* Thumbnail Banner */}
              <div className="relative w-full aspect-[1200/628] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={info.bannerUrl}
                  alt={info.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-600 text-white shadow-sm backdrop-blur-md">
                    <InfoIcon className="w-3 h-3" />
                    Informasi
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    <span>{formatDate(info.publishedAt)}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {info.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {info.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>

                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <InfoIcon className="w-3 h-3" />
                    <span>Pusat Info</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Direct Dashboard Reader Modal */}
      <Modal
        isOpen={!!selectedInfo}
        onClose={() => setSelectedInfo(null)}
        maxWidth="3xl"
        className="flex flex-col max-h-[92vh] overflow-hidden"
      >
        {selectedInfo && (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-blue-50/40 dark:bg-blue-950/20">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  <InfoIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Informasi Sakuin
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(selectedInfo.publishedAt)}
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                    {selectedInfo.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInfo(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Reader Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-6">
              {/* Title Header */}
              <div className="space-y-2">
                <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-snug">
                  {selectedInfo.title}
                </h1>
                {/* Short description quote box */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs sm:text-sm text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
                  {selectedInfo.shortDescription}
                </div>
              </div>

              {/* Banner Image */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-850 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedInfo.bannerUrl}
                  alt={selectedInfo.title}
                  className="w-full max-h-[280px] sm:max-h-[340px] object-cover"
                />
              </div>

              {/* Rincian Informasi (HTML Content) */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Rincian Informasi
                </span>
                <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-850/40 border border-gray-100 dark:border-gray-800/80">
                  <div
                    className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:text-gray-900 dark:prose-strong:text-white prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/40 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:p-3 prose-blockquote:rounded-r-xl"
                    dangerouslySetInnerHTML={{ __html: selectedInfo.contentHtml }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/40 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Pusat Informasi Resmi Sakuin</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedInfo(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white cursor-pointer transition-colors shadow-xs"
              >
                Tutup Informasi
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Info;
