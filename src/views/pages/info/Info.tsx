"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Info as InfoIcon,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import { useInfoStore } from "@/stores/useInfoStore";
import type { InfoItem } from "@/models/info";
import type { PromoItem } from "@/models/promo";
import { Modal } from "@/views/ui/modal";
import { cn } from "@/utils";

export const Info: React.FC = () => {
  const { infos: rawInfos, loadInfos, isLoading } = useInfoStore();

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInfo, setSelectedInfo] = useState<InfoItem | PromoItem | null>(null);

  // Carousel & Drag states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const wasDraggingRef = useRef(false);

  // Muat informasi dari Supabase khusus untuk user (hanya yang tidak disembunyikan)
  useEffect(() => {
    loadInfos(false);
  }, [loadInfos]);

  // Hanya tampilkan informasi yang TIDAK disembunyikan dari pengguna
  const infos = rawInfos.filter((p) => !p.isHidden);

  // Filter by search query
  const filteredInfos = infos.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q)
    );
  });

  // Informasi yang dicentang Highlight oleh Admin
  const highlightInfos = infos.filter((p) => Boolean(p.isHighlight));

  // Reset currentSlide jika di luar jangkauan
  useEffect(() => {
    if (currentSlide >= highlightInfos.length && highlightInfos.length > 0) {
      setCurrentSlide(0);
    }
  }, [currentSlide, highlightInfos.length]);

  // Navigasi carousel
  const nextSlide = useCallback(() => {
    if (highlightInfos.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % highlightInfos.length);
  }, [highlightInfos.length]);

  const prevSlide = useCallback(() => {
    if (highlightInfos.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + highlightInfos.length) % highlightInfos.length);
  }, [highlightInfos.length]);

  // Auto-advance slide setiap 5 detik (berubah-ubah tiap 5 detik)
  useEffect(() => {
    if (highlightInfos.length <= 1 || isHovered || isDragging) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [highlightInfos.length, isHovered, isDragging, nextSlide]);

  // Gesture handling: Touch (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragDelta(0);
    wasDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const delta = e.touches[0].clientX - dragStartX;
    setDragDelta(delta);
    if (Math.abs(delta) > 10) {
      wasDraggingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (dragStartX === null) return;
    if (dragDelta < -40) {
      nextSlide();
    } else if (dragDelta > 40) {
      prevSlide();
    }
    setIsDragging(false);
    setDragStartX(null);
    setDragDelta(0);
  };

  // Gesture handling: Mouse Drag (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragDelta(0);
    wasDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX === null || !isDragging) return;
    const delta = e.clientX - dragStartX;
    setDragDelta(delta);
    if (Math.abs(delta) > 10) {
      wasDraggingRef.current = true;
    }
  };

  const handleMouseUp = () => {
    if (dragStartX === null) return;
    if (dragDelta < -40) {
      nextSlide();
    } else if (dragDelta > 40) {
      prevSlide();
    }
    setIsDragging(false);
    setDragStartX(null);
    setDragDelta(0);
  };

  const handleOpenReader = (info: InfoItem | PromoItem) => {
    setSelectedInfo(info);
  };

  const handleSlideCardClick = (info: InfoItem) => {
    if (!wasDraggingRef.current) {
      handleOpenReader(info);
    }
  };

  return (
    <div className="w-full flex-1 md:overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="w-full max-w-5xl mx-auto space-y-7">
        {/* 1. Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Informasi
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Pusat pengumuman penting, berita pembaruan layanan, dan informasi resmi <span className="font-bold text-black dark:text-white">Sakuin.id</span>.
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
                placeholder="Cari informasi & pengumuman..."
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

        {/* 2. Highlight Section (Single Card atau Touch-Optimized Carousel jika > 1) */}
        {!searchQuery && highlightInfos.length > 0 && (
          <div
            className="relative rounded-3xl overflow-hidden border border-blue-100 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 dark:from-blue-950/30 dark:via-gray-900 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300 group touch-pan-y select-none"
            onMouseEnter={() => {
              if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                setIsHovered(true);
              }
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              if (isDragging) handleMouseUp();
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Track slider */}
            <div
              className="flex w-full"
              style={{
                transform: `translateX(calc(-${currentSlide * 100}% + ${dragDelta}px))`,
                transition: isDragging ? "none" : "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {highlightInfos.map((info) => (
                <div
                  key={info.id}
                  onClick={() => handleSlideCardClick(info)}
                  className="w-full shrink-0 cursor-pointer"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-7 p-5 sm:p-6 lg:p-7 items-center">
                    {/* Banner preview: md:col-span-6 */}
                    <div className="md:col-span-6 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] max-h-64 sm:max-h-72 bg-gray-100 dark:bg-gray-800 relative shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={info.bannerUrl}
                        alt={info.title}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        draggable={false}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-sm">
                          <Star className="w-3.5 h-3.5 text-amber-300" />
                          Unggulan
                        </span>
                      </div>
                    </div>

                    {/* Info details: md:col-span-6 */}
                    <div className="md:col-span-6 space-y-3 sm:space-y-3.5 flex flex-col justify-center">
                      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {info.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {info.shortDescription}
                      </p>

                      <div className="pt-1.5 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReader(info);
                          }}
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
              ))}
            </div>

            {/* Navigation Arrows (Hanya tampil jika ada lebih dari 1 highlight) */}
            {highlightInfos.length > 1 && (
              <>
                {/* Tombol Kiri */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  aria-label="Informasi Sebelumnya"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-white/85 dark:bg-gray-900/85 shadow-md hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Tombol Kanan */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  aria-label="Informasi Berikutnya"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-white/85 dark:bg-gray-900/85 shadow-md hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indikator Titik (Dots Pagination) & Counter */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 dark:bg-black/60 backdrop-blur-md border border-white/10">
                  {highlightInfos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(idx);
                      }}
                      aria-label={`Buka slide informasi ke-${idx + 1}`}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 cursor-pointer",
                        idx === currentSlide
                          ? "w-6 bg-blue-400 shadow-xs"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      )}
                    />
                  ))}
                  <span className="text-[10px] text-white/90 font-medium ml-1">
                    {currentSlide + 1} / {highlightInfos.length}
                  </span>
                </div>
              </>
            )}
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

        {/* 4. Grid of Information / Loading / Empty State */}
        {isLoading && rawInfos.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-xs text-gray-400">Memuat informasi...</p>
          </div>
        ) : filteredInfos.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500">
              <InfoIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-800 dark:text-white">
              {searchQuery ? "Tidak Ada Informasi Ditemukan" : "Belum Ada Informasi"}
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
              {searchQuery
                ? "Tidak ada informasi yang sesuai dengan kata kunci pencarian Anda."
                : "Belum ada informasi yang tersedia saat ini. Silakan kembali lagi nanti."}
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
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {info.title}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                      {info.shortDescription}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    Informasi Sakuin
                  </span>
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
                  Rincian & Penjelasan Lengkap
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
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
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
