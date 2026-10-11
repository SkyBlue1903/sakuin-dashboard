"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronRight,
  X,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  usePromo,
  PromoItem,
} from "@/context/PromoContext";
import { Modal } from "@/components/ui/modal";

export const Panduan: React.FC = () => {
  const { promos } = usePromo();

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<PromoItem | null>(null);

  // Filter only type === "guide" (Panduan tidak memiliki tanggal terbit)
  const guides = promos.filter((p) => p.type === "guide");

  // Filter by search query
  const filteredGuides = guides.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q)
    );
  });

  // Featured highlight guide
  const featuredGuide = filteredGuides[0] || null;

  const handleOpenReader = (guide: PromoItem) => {
    setSelectedGuide(guide);
  };

  return (
    <div className="w-full flex-1 md:overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-7">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Pusat Panduan & Tutorial Sakuin</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Panduan Penggunaan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Petunjuk interaktif, langkah demi langkah, dan panduan fitur kartu virtual langsung di dashboard Anda.
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
              placeholder="Cari petunjuk & panduan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
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
      {!searchQuery && featuredGuide && (
        <div
          onClick={() => handleOpenReader(featuredGuide)}
          className="relative rounded-3xl overflow-hidden border border-emerald-100 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 dark:from-emerald-950/30 dark:via-gray-900 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-7 items-center">
            {/* Banner preview */}
            <div className="lg:col-span-7 xl:col-span-7 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 aspect-[1200/628] bg-gray-100 dark:bg-gray-800 relative shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredGuide.bannerUrl}
                alt={featuredGuide.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Panduan Unggulan
                </span>
              </div>
            </div>

            {/* Guide details (strictly NO published date) */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Panduan Interaktif di Dashboard</span>
              </div>

              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {featuredGuide.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {featuredGuide.shortDescription}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Pelajari Langkah-Langkah</span>
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
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            Semua Panduan
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            {filteredGuides.length}
          </span>
        </div>
      </div>

      {/* 4. Grid of Guides (Strictly NO published date) */}
      {filteredGuides.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white">
            Tidak Ada Panduan Ditemukan
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
            {searchQuery
              ? "Tidak ada panduan yang sesuai dengan kata kunci pencarian Anda."
              : "Belum ada panduan yang ditambahkan saat ini."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => handleOpenReader(guide)}
              className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-2xs hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-all duration-300 cursor-pointer"
            >
              {/* Thumbnail Banner */}
              <div className="relative w-full aspect-[1200/628] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={guide.bannerUrl}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-600 text-white shadow-sm backdrop-blur-md">
                    <BookOpen className="w-3 h-3" />
                    Panduan Sakuin
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {guide.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                    <span>Baca Panduan Lengkap</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>

                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Di Dashboard</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Direct Dashboard Reader Modal (Strictly NO published date, Scrollable Image) */}
      <Modal
        isOpen={!!selectedGuide}
        onClose={() => setSelectedGuide(null)}
        maxWidth="3xl"
        className="flex flex-col max-h-[92vh] overflow-hidden"
      >
        {selectedGuide && (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-emerald-50/40 dark:bg-emerald-950/20">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    Panduan Interaktif Sakuin
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                    {selectedGuide.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
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
                  {selectedGuide.title}
                </h1>
                {/* Short description quote box */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
                  {selectedGuide.shortDescription}
                </div>
              </div>

              {/* Ilustrasi Panduan (Mengalir bersama teks agar ikut ter-scroll ke atas saat membaca) */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-850 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedGuide.bannerUrl}
                  alt={selectedGuide.title}
                  className="w-full max-h-[280px] sm:max-h-[340px] object-cover"
                />
              </div>

              {/* Step by Step Details (HTML Content) */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Petunjuk & Langkah-Langkah Panduan
                </span>
                <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-850/40 border border-gray-100 dark:border-gray-800/80">
                  <div
                    className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:text-gray-900 dark:prose-strong:text-white prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50/40 dark:prose-blockquote:bg-emerald-950/20 prose-blockquote:p-3 prose-blockquote:rounded-r-xl"
                    dangerouslySetInnerHTML={{ __html: selectedGuide.contentHtml }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/40 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Panduan langsung tersedia di dashboard</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white cursor-pointer transition-colors shadow-xs"
              >
                Tutup Panduan
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Panduan;
