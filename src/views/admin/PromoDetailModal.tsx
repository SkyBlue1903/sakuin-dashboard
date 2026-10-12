"use client";

import React from "react";
import {
  X,
  Calendar,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Check,
  Share2,
  EyeOff,
} from "lucide-react";
import { cn } from "@/utils";
import { getPromoStatus, getPromoStatusBadge } from "@/stores/usePromoStore";
import type { PromoItem } from "@/models/promo";
import { Modal } from "@/views/ui/modal";

interface PromoDetailModalProps {
  promo: PromoItem | null;
  onClose: () => void;
  onEdit: (promo: PromoItem) => void;
  onDelete: (promo: PromoItem) => void;
}

export const PromoDetailModal: React.FC<PromoDetailModalProps> = ({
  promo,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!promo) return null;

  const isInfo = promo.type === "info";
  const isGuide = promo.type === "guide";
  const badge = getPromoStatusBadge(promo);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const calculateDaysRemaining = () => {
    if (isGuide) return null;
    if (isInfo && !promo.takedownAt) return null;
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
    return null;
  };

  const handleCopyLink = () => {
    if (promo.bannerLink) {
      navigator.clipboard.writeText(promo.bannerLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const daysRemainingText = calculateDaysRemaining();

  return (
    <Modal
      isOpen={!!promo}
      onClose={onClose}
      maxWidth="2xl"
      className="flex flex-col max-h-[90vh] overflow-hidden"
    >
      {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/60 dark:bg-gray-850/40">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs",
                badge.colorClass
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", badge.dotClass)} />
              {badge.label}
            </span>
            {daysRemainingText && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                <Clock className="w-3.5 h-3.5" />
                {daysRemainingText}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content - Everything scrolls naturally together */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-5">
          {/* Illustration / Banner Image (Inside scroll container so it moves up as you scroll) */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-850">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={promo.bannerUrl}
              alt={promo.title}
              className="w-full max-h-[300px] sm:max-h-[340px] object-cover"
            />
          </div>

          {/* Title & Schedule Details */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug">
              {promo.title}
            </h2>

            {/* Dates row (Omitted for Panduan - Panduan does NOT have publication date) */}
            {!isGuide && (
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/60 px-2.5 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  <span>Terbit: {formatDate(promo.publishedAt)}</span>
                </div>
                {promo.takedownAt && (
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/60 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Takedown: {formatDate(promo.takedownAt)}</span>
                  </div>
                )}
              </div>
            )}

            {!isGuide && promo.hideBeforePublished && promo.publishedAt && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
                <EyeOff className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  {new Date().getTime() < new Date(promo.publishedAt).getTime()
                    ? "Item ini disembunyikan dari halaman pengguna publik sampai tanggal terbit."
                    : "Item ini diatur sembunyikan sebelum terbit (saat ini sudah terbit & terlihat publik)."}
                </span>
              </div>
            )}
          </div>

          {/* Destination Link Box (Only for Promosi) */}
          {!isInfo && !isGuide && promo.bannerLink && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Link Promosi
                </span>
                <a
                  href={promo.bannerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline truncate block"
                >
                  {promo.bannerLink}
                </a>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  title="Salin Link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={promo.bannerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Buka Tautan"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Short Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Deskripsi Singkat
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50/70 dark:bg-gray-850/50 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800/80">
              {promo.shortDescription}
            </p>
          </div>

          {/* Full HTML Content */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {isGuide
                ? "Langkah-Langkah & Detail Panduan"
                : isInfo
                ? "Rincian Informasi"
                : "Detail Promosi & Ketentuan"}
            </h4>
            <div
              dangerouslySetInnerHTML={{ __html: promo.contentHtml }}
              className={cn(
                "p-4 rounded-2xl bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800 text-sm text-gray-800 dark:text-gray-200",
                "prose prose-sm dark:prose-invert max-w-none",
                "[&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1.5",
                "[&_h4]:text-sm [&_h4]:font-bold [&_h4]:mt-3 [&_h4]:mb-1",
                "[&_p]:mb-2.5 [&_p]:leading-relaxed",
                "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2.5 [&_ul]:space-y-1",
                "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2.5",
                "[&_blockquote]:border-l-4 [&_blockquote]:border-brand-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-gray-500 dark:[&_blockquote]:text-gray-400",
                "[&_a]:text-brand-600 [&_a]:underline"
              )}
            />
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/30 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(promo);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isGuide ? "Hapus Panduan" : isInfo ? "Hapus Informasi" : "Hapus Promo"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(promo);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isGuide ? "Edit Panduan" : isInfo ? "Edit Informasi" : "Edit Promo"}
            </button>
          </div>
        </div>
    </Modal>
  );
};

export default PromoDetailModal;
