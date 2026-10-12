"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  Share2,
  Copy,
  Check,
  Tag,
  Flame,
  CheckCircle2,
  Gift,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/utils";
import { usePromo, getPromoStatus, getPromoStatusBadge } from "@/stores/usePromoStore";
import type { PromoItem } from "@/models/promo";
import { Modal } from "@/views/ui/modal";

export const Promo: React.FC = () => {
  const { promos } = usePromo();

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "scheduled">("all");
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter only type === "promo" and respect hideBeforePublished
  const visiblePromos = promos
    .filter((p) => p.type === "promo")
    .filter((p) => {
      if (!p.hideBeforePublished) return true;
      const now = new Date().getTime();
      const pub = p.publishedAt ? new Date(p.publishedAt).getTime() : 0;
      return now >= pub;
    });

  // Status counts for promo
  const activeCount = visiblePromos.filter((p) => getPromoStatus(p) === "active").length;
  const scheduledCount = visiblePromos.filter((p) => getPromoStatus(p) === "scheduled").length;

  // Filter items
  const filteredPromos = visiblePromos
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
      // Prioritize active promos, then newest published
      const statusA = getPromoStatus(a);
      const statusB = getPromoStatus(b);
      if (statusA === "active" && statusB !== "active") return -1;
      if (statusB === "active" && statusA !== "active") return 1;
      return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
    });

  // Featured Promo: The first active promo or first in list
  const featuredPromo =
    visiblePromos.find((p) => getPromoStatus(p) === "active") ||
    visiblePromos[0] ||
    null;

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
    <div className="w-full flex-1 md:overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-7">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Penawaran & Diskon Eksklusif Sakuin</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Promo Spesial
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Dapatkan reward cashback, voucher potongan langganan merchant, dan keuntungan ekstra bertransaksi dengan kartu SakuCard Virtual Anda.
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
              placeholder="Cari promo & merchant..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-2xs"
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

      {/* 2. Hero Featured Promo Banner */}
      {!searchQuery && featuredPromo && (
        <div
          onClick={() => setSelectedPromo(featuredPromo)}
          className="relative rounded-3xl overflow-hidden border border-brand-100 dark:border-brand-900/40 bg-gradient-to-br from-brand-50/70 via-white to-amber-50/40 dark:from-brand-950/30 dark:via-gray-900 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-7 items-center">
            {/* Banner preview */}
            <div className="lg:col-span-7 xl:col-span-7 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 aspect-[1200/628] bg-gray-100 dark:bg-gray-800 relative shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredPromo.bannerUrl}
                alt={featuredPromo.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500 text-white shadow-sm">
                  <Flame className="w-3.5 h-3.5" />
                  Promo Utama
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md">
                  <Clock className="w-3 h-3" />
                  {calculateDaysRemaining(featuredPromo)}
                </span>
              </div>
            </div>

            {/* Promo details */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-3.5">
              <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Periode: {formatDate(featuredPromo.publishedAt)} s/d {formatDate(featuredPromo.takedownAt)}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {featuredPromo.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {featuredPromo.shortDescription}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>Lihat Detail Promo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {featuredPromo.bannerLink && (
                  <a
                    href={featuredPromo.bannerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span>Kunjungi Merchant</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter Tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
              activeTab === "all"
                ? "bg-brand-500 text-white shadow-2xs"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            Semua Promo ({visiblePromos.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
              activeTab === "active"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Sedang Berlangsung ({activeCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("scheduled")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
              activeTab === "scheduled"
                ? "bg-purple-600 text-white shadow-2xs"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            <Clock className="w-3 h-3" />
            <span>Akan Datang ({scheduledCount})</span>
          </button>
        </div>
      </div>

      {/* 4. Grid of Promos */}
      {filteredPromos.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center text-brand-500">
            <Gift className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white">
            Tidak Ada Promo Ditemukan
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
            {searchQuery
              ? "Tidak ada promo yang cocok dengan kata kunci pencarian Anda."
              : "Belum ada penawaran promo dalam kategori ini saat ini."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPromos.map((promo) => {
            const badge = getPromoStatusBadge(promo);

            return (
              <div
                key={promo.id}
                onClick={() => setSelectedPromo(promo)}
                className="group flex flex-col rounded-3xl border border-gray-100 bg-white shadow-2xs hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail Banner */}
                <div className="relative w-full aspect-[1200/628] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={promo.bannerUrl}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md shadow-xs",
                        badge.colorClass
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", badge.dotClass)} />
                      {badge.label}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-md shadow-xs">
                      <Clock className="w-3 h-3" />
                      <span>{calculateDaysRemaining(promo)}</span>
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Calendar className="w-3 h-3 text-brand-500" />
                      <span>Periode: {formatDate(promo.publishedAt)} s/d {formatDate(promo.takedownAt)}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                      {promo.title}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {promo.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:underline">
                      <span>Rincian Promo</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>

                    {promo.bannerLink && (
                      <a
                        href={promo.bannerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Buka Tautan Promo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Detail Modal */}
      <Modal
        isOpen={!!selectedPromo}
        onClose={() => setSelectedPromo(null)}
        maxWidth="2xl"
        className="flex flex-col max-h-[90vh] overflow-hidden"
      >
        {selectedPromo && (
          <>
            {/* Modal Banner */}
            <div className="relative w-full aspect-[1200/628] bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden border-b border-gray-100 dark:border-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPromo.bannerUrl}
                alt={selectedPromo.title}
                className="w-full h-full object-cover"
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
                <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 font-medium mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Periode Promo: {formatDate(selectedPromo.publishedAt)} s/d {formatDate(selectedPromo.takedownAt)}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {selectedPromo.title}
                </h2>
              </div>

              {/* Short description quote */}
              <div className="p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/40 text-xs sm:text-sm text-brand-900 dark:text-brand-200 leading-relaxed font-medium">
                {selectedPromo.shortDescription}
              </div>

              {/* HTML Content Body */}
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                <div
                  className="prose dark:prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-headings:font-bold prose-a:text-brand-600 prose-img:rounded-xl"
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
                      className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline truncate block"
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
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
