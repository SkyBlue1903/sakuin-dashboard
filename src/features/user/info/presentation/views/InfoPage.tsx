"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { useInfoStore } from "@/features/user/info/presentation/stores/useInfoStore";
import type { InfoItem } from "@/features/user/info/domain/info";
import type { PromoItem } from "@/features/user/promo/domain/promo";
import { Modal } from "@/shared/presentation/components/ui/Modal";
import { cn } from "@/shared/utils";

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
  const highlightCount = highlightInfos.length;
  const safeCurrentSlide =
    highlightCount > 0 ? currentSlide % highlightCount : 0;

  // Navigasi carousel
  const nextSlide = () => {
    if (highlightCount <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % highlightCount);
  };

  const prevSlide = () => {
    if (highlightCount <= 1) return;
    setCurrentSlide(
      (prev) => (prev - 1 + highlightCount) % highlightCount
    );
  };

  // Auto-advance slide setiap 5 detik (berubah-ubah tiap 5 detik)
  useEffect(() => {
    if (highlightCount <= 1 || isHovered || isDragging) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % highlightCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [highlightCount, isHovered, isDragging]);

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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight">
              Informasi
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
              Pusat pengumuman penting, berita pembaruan layanan, dan informasi resmi <span className="font-semibold text-text-primary">Sakuin.id</span>.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72 lg:w-80 shrink-0">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari informasi & pengumuman..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-surface text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-ds-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary cursor-pointer"
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
            className="relative rounded-3xl overflow-hidden border border-border-subtle bg-surface shadow-ds-sm hover:shadow-ds-md transition-all duration-300 group touch-pan-y select-none"
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
                transform: `translateX(calc(-${safeCurrentSlide * 100}% + ${dragDelta}px))`,
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
                    <div className="md:col-span-6 overflow-hidden rounded-2xl border border-border-subtle aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] max-h-64 sm:max-h-72 bg-surface-secondary relative shadow-inner">
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
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-text-inverse shadow-ds-xs">
                          <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          Unggulan
                        </span>
                      </div>
                    </div>

                    {/* Info details: md:col-span-6 */}
                    <div className="md:col-span-6 space-y-3 sm:space-y-3.5 flex flex-col justify-center">
                      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-text-primary leading-snug group-hover:text-primary transition-colors">
                        {info.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                        {info.shortDescription}
                      </p>

                      <div className="pt-1.5 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReader(info);
                          }}
                          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-text-inverse text-xs sm:text-sm font-semibold shadow-ds-xs transition-colors cursor-pointer"
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-surface/90 shadow-ds-md hover:bg-surface text-text-primary flex items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95 border border-border"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-surface/90 shadow-ds-md hover:bg-surface text-text-primary flex items-center justify-center transition-all cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95 border border-border"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indikator Titik (Dots Pagination) & Counter */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
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
                        idx === safeCurrentSlide
                          ? "w-6 bg-primary shadow-ds-xs"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      )}
                    />
                  ))}
                  <span className="text-[10px] text-white/90 font-medium ml-1">
                    {safeCurrentSlide + 1} / {highlightInfos.length}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* 3. Section Title / Counter */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <InfoIcon className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-text-primary">
              Semua Informasi
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              {filteredInfos.length}
            </span>
          </div>
        </div>

        {/* 4. Grid of Information / Loading / Empty State */}
        {isLoading && rawInfos.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-surface border border-border-subtle p-8">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-xs text-text-tertiary">Memuat informasi...</p>
          </div>
        ) : filteredInfos.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-surface border border-border-subtle p-8">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <InfoIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              {searchQuery ? "Tidak Ada Informasi Ditemukan" : "Belum Ada Informasi"}
            </h3>
            <p className="text-xs text-text-tertiary max-w-sm mx-auto mt-1">
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
                className="group flex flex-col rounded-3xl border border-border-subtle bg-surface shadow-ds-xs hover:shadow-ds-md hover:border-border overflow-hidden transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail Banner */}
                <div className="relative w-full aspect-[1200/628] bg-surface-secondary overflow-hidden">
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
                    <h3 className="text-sm sm:text-base font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {info.title}
                    </h3>

                    <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
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
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-border-subtle shrink-0 bg-surface">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <InfoIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block">
                    Informasi Sakuin
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-text-primary truncate">
                    {selectedInfo.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInfo(null)}
                className="rounded-full p-2 text-text-tertiary hover:bg-surface-secondary hover:text-text-primary cursor-pointer transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Reader Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-6">
              {/* Title Header */}
              <div className="space-y-2">
                <h1 className="text-lg sm:text-2xl font-extrabold text-text-primary leading-snug">
                  {selectedInfo.title}
                </h1>
                {/* Short description quote box */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-primary/5 border border-primary/15 text-xs sm:text-sm text-text-primary leading-relaxed font-medium">
                  {selectedInfo.shortDescription}
                </div>
              </div>

              {/* Banner Image */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-border-subtle bg-surface-secondary shadow-ds-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedInfo.bannerUrl}
                  alt={selectedInfo.title}
                  className="w-full max-h-[280px] sm:max-h-[340px] object-cover"
                />
              </div>

              {/* Rincian Informasi (HTML Content) */}
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Rincian & Penjelasan Lengkap
                </span>
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-secondary/70 border border-border-subtle">
                  <div
                    className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-text-secondary leading-relaxed prose-headings:font-bold prose-headings:text-text-primary prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:text-text-primary prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:p-3 prose-blockquote:rounded-r-xl"
                    dangerouslySetInnerHTML={{ __html: selectedInfo.contentHtml }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-border-subtle bg-surface-secondary/50 flex items-center justify-between">
              <span className="text-[11px] text-text-tertiary flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>Pusat Informasi Resmi Sakuin</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedInfo(null)}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-xs font-semibold text-text-inverse cursor-pointer transition-colors shadow-ds-xs"
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
