"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Search,
  Calendar,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Gift,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { usePromoStore, getPromoStatus, getPromoStatusBadge } from "@/features/user/promo/presentation/stores/usePromoStore";
import type { PromoItem } from "@/features/user/promo/domain/promo";
import { Modal } from "@/shared/presentation/components/ui/Modal";

export const Promo: React.FC = () => {
  const { promos: rawPromos, loadPromos, isLoading } = usePromoStore();

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "scheduled">("all");
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Carousel & Drag states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const wasDraggingRef = useRef(false);

  // Muat promosi dari Supabase khusus untuk user (hanya yang tidak disembunyikan)
  useEffect(() => {
    loadPromos(false);
  }, [loadPromos]);

  // Hanya tampilkan promosi yang TIDAK disembunyikan dan sesuai jadwal tayang
  const promos = rawPromos
    .filter((p) => p.type === "promo" || !p.type)
    .filter((p) => !p.isHidden)
    .filter((p) => {
      if (!p.hideBeforePublished) return true;
      const now = new Date().getTime();
      const pub = p.publishedAt ? new Date(p.publishedAt).getTime() : 0;
      return now >= pub;
    });

  // Highlight promos (yang dicentang Highlight oleh admin)
  const highlightPromos = promos.filter((p) => Boolean(p.isHighlight));
  const highlightCount = highlightPromos.length;

  // Safe active slide index derived without triggering cascading setState in effect
  const safeCurrentSlide =
    highlightCount > 0 ? currentSlide % highlightCount : 0;

  // Navigasi carousel
  const nextSlide = () => {
    if (highlightCount <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % highlightCount);
  };

  const prevSlide = () => {
    if (highlightCount <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + highlightCount) % highlightCount);
  };

  // Auto-advance slide setiap 5 detik
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

  const handleOpenReader = (promo: PromoItem) => {
    setSelectedPromo(promo);
  };

  const handleSlideCardClick = (promo: PromoItem) => {
    if (!wasDraggingRef.current) {
      handleOpenReader(promo);
    }
  };

  // Filter items berdasarkan tab & search
  const filteredPromos = promos
    .filter((promo) => {
      if (activeTab === "active" && getPromoStatus(promo) !== "active") return false;
      if (activeTab === "scheduled" && getPromoStatus(promo) !== "scheduled") return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        promo.title.toLowerCase().includes(q) ||
        promo.shortDescription.toLowerCase().includes(q) ||
        (promo.bannerLink && promo.bannerLink.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const statusA = getPromoStatus(a);
      const statusB = getPromoStatus(b);
      if (statusA === "active" && statusB !== "active") return -1;
      if (statusB === "active" && statusA !== "active") return 1;
      return Number(b.id) - Number(a.id);
    });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const calculateDaysRemaining = (promo: PromoItem) => {
    const now = new Date().getTime();
    const down = promo.takedownAt ? new Date(promo.takedownAt).getTime() : 0;
    const pub = promo.publishedAt ? new Date(promo.publishedAt).getTime() : 0;

    if (now < pub) {
      const diffDays = Math.ceil((pub - now) / (1000 * 60 * 60 * 24));
      return `Mulai dalam ${diffDays} hari`;
    }
    if (down && now > down) {
      return "Telah berakhir";
    }
    if (down) {
      const diffDays = Math.ceil((down - now) / (1000 * 60 * 60 * 24));
      return `Sisa ${diffDays} hari lagi`;
    }
    return "Promo Berjalan";
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex-1 md:overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="w-full max-w-5xl mx-auto space-y-7">
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight">
              Promosi
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
              Dapatkan penawaran istimewa, diskon eksklusif merchant, dan cashback terbaik dari <span className="font-semibold text-text-primary">Sakuin.id</span>.
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
                placeholder="Cari promo & diskon..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-2xs"
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
        {!searchQuery && highlightPromos.length > 0 && (
          <div
            className="relative rounded-2xl overflow-hidden border border-border-subtle bg-surface shadow-ds-sm hover:shadow-ds-md transition-all duration-300 group touch-pan-y select-none"
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
              {highlightPromos.map((promo) => {
                const badge = getPromoStatusBadge(promo);

                return (
                  <div
                    key={promo.id}
                    onClick={() => handleSlideCardClick(promo)}
                    className="w-full shrink-0 p-5 sm:p-7 lg:p-8 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-center">
                      {/* Left: Text & Details */}
                      <div className="md:col-span-6 space-y-3.5 order-2 md:order-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-text-inverse shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 fill-current" />
                            Promo Unggulan
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
                              badge.colorClass
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", badge.dotClass)} />
                            {badge.label}
                          </span>
                          <span className="text-xs text-text-tertiary">
                            {calculateDaysRemaining(promo)}
                          </span>
                        </div>

                        <h2 className="text-lg sm:text-2xl font-bold text-text-primary leading-snug group-hover:text-primary transition-colors">
                          {promo.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-text-secondary line-clamp-3 leading-relaxed">
                          {promo.shortDescription}
                        </p>

                        <div className="pt-2 flex items-center gap-3">
                          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs sm:text-sm font-semibold transition-colors shadow-ds-sm">
                            <span>Lihat Penawaran</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>

                      {/* Right: Banner Image */}
                      <div className="md:col-span-6 order-1 md:order-2">
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-xs bg-surface-secondary border border-border-subtle">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={promo.bannerUrl}
                            alt={promo.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 pointer-events-none"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Arrows Navigasi (jika > 1 slide) */}
            {highlightPromos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Slide sebelumnya"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/90 hover:bg-surface text-text-primary border border-border shadow-ds-sm backdrop-blur-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Slide berikutnya"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/90 hover:bg-surface text-text-primary border border-border shadow-ds-sm backdrop-blur-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                  {highlightPromos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Slide ke-${idx + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(idx);
                      }}
                      className={cn(
                        "h-1.5 rounded-full transition-all cursor-pointer",
                        safeCurrentSlide === idx
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-surface-tertiary hover:bg-text-tertiary"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 3. Filter Tabs Bar */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
                activeTab === "all"
                  ? "bg-primary text-text-inverse shadow-ds-sm"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              )}
            >
              Semua Promo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
                activeTab === "active"
                  ? "bg-primary text-text-inverse shadow-ds-sm"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              )}
            >
              Sedang Aktif
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("scheduled")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
                activeTab === "scheduled"
                  ? "bg-primary text-text-inverse shadow-ds-sm"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              )}
            >
              Akan Datang
            </button>
          </div>

          <span className="text-xs text-text-tertiary font-medium hidden sm:inline">
            Menampilkan {filteredPromos.length} promo
          </span>
        </div>

        {/* 4. Grid Promosi */}
        {isLoading && promos.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border-subtle bg-surface p-4 animate-pulse space-y-4"
              >
                <div className="w-full h-40 bg-surface-secondary rounded-xl" />
                <div className="h-4 bg-surface-secondary rounded w-3/4" />
                <div className="h-3 bg-surface-secondary rounded w-full" />
                <div className="h-3 bg-surface-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredPromos.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-border-subtle bg-surface">
            <div className="inline-flex p-4 rounded-full bg-accent text-primary mb-3">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              Tidak ada promosi ditemukan
            </h3>
            <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ada promo yang cocok dengan kata kunci "${searchQuery}".`
                : "Saat ini belum ada penawaran promosi yang tersedia."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPromos.map((promo) => {
              const badge = getPromoStatusBadge(promo);

              return (
                <div
                  key={promo.id}
                  onClick={() => handleOpenReader(promo)}
                  className="group rounded-2xl border border-border-subtle hover:border-primary/40 bg-surface overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-ds-sm hover:shadow-ds-md cursor-pointer"
                >
                  {/* Banner */}
                  <div className="relative aspect-video w-full overflow-hidden bg-surface-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={promo.bannerUrl}
                      alt={promo.title}
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
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border backdrop-blur-md shadow-2xs",
                          badge.colorClass
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", badge.dotClass)} />
                        {badge.label}
                      </span>

                      {promo.isHighlight && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-secondary text-text-inverse shadow-2xs">
                          <Sparkles className="w-3 h-3 fill-current" />
                          Highlight
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-overlay text-white backdrop-blur-md">
                        <Clock className="w-3 h-3" />
                        {calculateDaysRemaining(promo)}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                        {promo.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                        {promo.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                      <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-primary" />
                        {formatDate(promo.publishedAt)}
                      </span>
                      <span className="font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Lihat Promo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Reader Modal */}
      <Modal
        isOpen={Boolean(selectedPromo)}
        onClose={() => setSelectedPromo(null)}
        maxWidth="2xl"
        className="flex flex-col max-h-[90vh] overflow-hidden"
      >
        {selectedPromo && (
          <>
            {/* Modal Banner */}
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden border-b border-gray-100 dark:border-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPromo.bannerUrl}
                alt={selectedPromo.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <button
                type="button"
                onClick={() => setSelectedPromo(null)}
                className="absolute top-3 right-3 rounded-full p-2 bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs cursor-pointer transition-colors shadow-md"
              >
                <X className="h-4.5 w-4.5" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm",
                    getPromoStatusBadge(selectedPromo).colorClass
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", getPromoStatusBadge(selectedPromo).dotClass)} />
                  {getPromoStatusBadge(selectedPromo).label}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md">
                  <Clock className="w-3.5 h-3.5" />
                  {calculateDaysRemaining(selectedPromo)}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Periode Promo: {formatDate(selectedPromo.publishedAt)}
                    {selectedPromo.takedownAt ? ` s/d ${formatDate(selectedPromo.takedownAt)}` : ""}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {selectedPromo.title}
                </h2>
              </div>

              {/* Short description quote */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
                {selectedPromo.shortDescription}
              </div>

              {/* HTML Content Body */}
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                <div
                  className="prose dark:prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: selectedPromo.contentHtml }}
                />
              </div>

              {/* Banner Action Link */}
              {selectedPromo.bannerLink && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
                  <div className="min-w-0 pr-3">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                      Tautan Penawaran
                    </span>
                    <a
                      href={selectedPromo.bannerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline truncate block"
                    >
                      {selectedPromo.bannerLink}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(selectedPromo.bannerLink || "")}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      title="Salin Link"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={selectedPromo.bannerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                    >
                      <span>Klaim Sekarang</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/40 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedPromo(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs font-semibold text-gray-800 dark:text-white cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Promo;
