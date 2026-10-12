"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Calendar,
  Clock,
  Sparkles,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/utils";
import HtmlEditor from "./HtmlEditor";
import type { PromoItem } from "@/models/promo";
import { Modal } from "@/views/ui/modal";

interface EditPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  promo?: PromoItem | null;
  onSave: (promoData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => void;
}

const SAMPLE_BANNER_PATH = "/images/sample-images/ads.sample.png";
const SAMPLE_BANNER_LINK = "https://sakuin.id/promo/super-cashback-oktober";

// Format date to datetime-local input string YYYY-MM-DDTHH:mm
const toDateTimeLocalString = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const EditPromoModal: React.FC<EditPromoModalProps> = ({
  isOpen,
  onClose,
  promo,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [takedownAt, setTakedownAt] = useState("");
  const [hideBeforePublished, setHideBeforePublished] = useState(false);
  const [bannerPreviewError, setBannerPreviewError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (promo) {
        setTitle(promo.title);
        setBannerUrl(promo.bannerUrl);
        setBannerLink(promo.bannerLink || "");
        setShortDescription(promo.shortDescription);
        setContentHtml(promo.contentHtml);
        setPublishedAt(promo.publishedAt || toDateTimeLocalString(new Date()));
        setTakedownAt(promo.takedownAt || "");
        setHideBeforePublished(promo.hideBeforePublished ?? false);
      } else {
        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setDate(now.getDate() + 30);

        setTitle("");
        setBannerUrl(SAMPLE_BANNER_PATH);
        setBannerLink(SAMPLE_BANNER_LINK);
        setShortDescription("");
        setHideBeforePublished(false);
        setContentHtml(
          "<h3>Detail Penawaran Promo</h3>\n<p>Tuliskan informasi lengkap benefit, tata cara klaim, dan syarat ketentuan promo di sini.</p>"
        );
        setPublishedAt(toDateTimeLocalString(now));
        setTakedownAt(toDateTimeLocalString(nextMonth));
      }
      setBannerPreviewError(false);
      setErrors({});
    }
  }, [isOpen, promo]);

  if (!isOpen) return null;

  const handleSetSampleBanner = () => {
    setBannerUrl(SAMPLE_BANNER_PATH);
    if (!bannerLink) {
      setBannerLink(SAMPLE_BANNER_LINK);
    }
    setBannerPreviewError(false);
  };

  const handleSetPublishNow = () => {
    const now = new Date();
    setPublishedAt(toDateTimeLocalString(now));
  };

  const handleAddDaysToTakedown = (days: number) => {
    const baseDate = publishedAt ? new Date(publishedAt) : new Date();
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + days);
    setTakedownAt(toDateTimeLocalString(targetDate));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Judul promosi wajib diisi";
    }
    if (!bannerUrl.trim()) {
      newErrors.bannerUrl = "Link banner promosi wajib diisi";
    }
    if (!shortDescription.trim()) {
      newErrors.shortDescription = "Deskripsi singkat promosi wajib diisi";
    }
    if (!publishedAt) {
      newErrors.publishedAt = "Tanggal terbit wajib ditentukan";
    }
    if (!takedownAt) {
      newErrors.takedownAt = "Tanggal takedown wajib ditentukan";
    } else if (publishedAt && new Date(takedownAt) <= new Date(publishedAt)) {
      newErrors.takedownAt = "Tanggal takedown harus setelah tanggal terbit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      type: "promo",
      title: title.trim(),
      bannerUrl: bannerUrl.trim(),
      bannerLink: bannerLink.trim() || "#",
      shortDescription: shortDescription.trim(),
      contentHtml: contentHtml.trim(),
      publishedAt,
      takedownAt,
      hideBeforePublished,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      className="flex flex-col max-h-[90vh] overflow-hidden"
    >
      {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-850/30">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {promo ? "Edit Promo" : "Tambah Promo Baru"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Atur banner, jadwal tayang, deskripsi, dan rincian promosi untuk pengguna kartu Sakuin
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-5">
          {/* 1. Judul Promosi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Judul Promosi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Promo Super Cashback 50% Transaksi Kartu Sakuin"
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all",
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500"
              )}
            />
            {errors.title && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* 2. Link Banner & Banner Live Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Link Banner Promosi (URL Gambar) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleSetSampleBanner}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 cursor-pointer hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                Pakai Sampel Banner (ads.sample.png)
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={bannerUrl}
                  onChange={(e) => {
                    setBannerUrl(e.target.value);
                    setBannerPreviewError(false);
                  }}
                  placeholder="/images/sample-images/ads.sample.png atau https://..."
                  className={cn(
                    "w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all",
                    errors.bannerUrl
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500"
                  )}
                />
              </div>
            </div>
            {errors.bannerUrl && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.bannerUrl}
              </p>
            )}

            {/* Live Banner Preview Box */}
            <div className="mt-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850/50 p-2.5 overflow-hidden">
              <span className="text-[11px] font-medium text-gray-400 block mb-1.5 px-1">
                Pratinjau Banner:
              </span>
              <div className="relative w-full aspect-[1200/628] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center border border-gray-200/60 dark:border-gray-700">
                {bannerUrl && !bannerPreviewError ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={bannerUrl}
                    alt="Pratinjau Banner"
                    onError={() => setBannerPreviewError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-gray-400">
                    <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                    <span className="text-xs">
                      {bannerPreviewError
                        ? "Gagal memuat gambar dari URL tersebut"
                        : "Masukkan link banner untuk melihat pratinjau"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Link Tujuan Banner (Link Aksi / Target URL) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Link Tujuan Banner (URL Aksi / Promosi)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={bannerLink}
                onChange={(e) => setBannerLink(e.target.value)}
                placeholder="https://sakuin.id/promo/super-cashback-oktober"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-brand-500 focus:ring-brand-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Tautan yang akan dibuka saat pengguna mengetuk banner promosi.
            </p>
          </div>

          {/* 4. Deskripsi Singkat Promosi */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Deskripsi Singkat Promosi <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-400">{shortDescription.length} karakter</span>
            </div>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ringkasan 1-2 kalimat untuk kartu promo atau push notification..."
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all resize-y",
                errors.shortDescription
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500"
              )}
            />
            {errors.shortDescription && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.shortDescription}
              </p>
            )}
          </div>

          {/* 5. Detail Promosi (HTML text editor) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Detail Promosi (HTML Text Editor)
            </label>
            <HtmlEditor
              value={contentHtml}
              onChange={setContentHtml}
              placeholder="Tuliskan syarat & ketentuan, rincian diskon, dan informasi lengkap..."
              minHeight="200px"
            />
          </div>

          {/* 6. Jadwal: Tanggal Terbit & Tanggal Takedown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Tanggal Terbit */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Tanggal Terbit <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleSetPublishNow}
                  className="text-[11px] font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 cursor-pointer hover:underline"
                >
                  ⚡ Terbit Sekarang
                </button>
              </div>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className={cn(
                  "w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 focus:outline-none focus:ring-1 transition-all",
                  errors.publishedAt
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500"
                )}
              />
              {errors.publishedAt && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.publishedAt}
                </p>
              )}
            </div>

            {/* Tanggal Takedown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Tanggal Takedown <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleAddDaysToTakedown(7)}
                    className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-[10px] text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    +7h
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddDaysToTakedown(30)}
                    className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-[10px] text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    +30h
                  </button>
                </div>
              </div>
              <input
                type="datetime-local"
                value={takedownAt}
                onChange={(e) => setTakedownAt(e.target.value)}
                className={cn(
                  "w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 focus:outline-none focus:ring-1 transition-all",
                  errors.takedownAt
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500"
                )}
              />
              {errors.takedownAt && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.takedownAt}
                </p>
              )}
            </div>
          </div>

          {/* Checklist: Sembunyikan dari pengguna sebelum tanggal terbit */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/40 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors">
              <input
                type="checkbox"
                checked={hideBeforePublished}
                onChange={(e) => setHideBeforePublished(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-md border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer accent-brand-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-gray-900 dark:text-white block">
                  Sembunyikan dari pengguna sebelum tanggal terbit
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5 block">
                  Jika dicentang, promosi ini tidak akan muncul di halaman pengguna sampai waktu terbit tiba.
                </span>
              </div>
            </label>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {promo ? "Simpan Perubahan" : "Terbitkan Promosi"}
            </button>
          </div>
        </form>
    </Modal>
  );
};

export default EditPromoModal;
