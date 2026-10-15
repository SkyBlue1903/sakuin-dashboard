"use client";

import React, { useState } from "react";
import {
  X,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  AlertCircle,
  EyeOff,
} from "lucide-react";
import { cn } from "@/shared/utils";
import HtmlEditor from "@/shared/presentation/components/ui/HtmlEditor";
import type { PromoItem } from "@/features/user/promo/domain/promo";
import { Modal } from "@/shared/presentation/components/ui/Modal";

interface EditPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  promo?: PromoItem | null;
  onSave: (promoData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => Promise<void> | void;
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

const EditPromoDialog: React.FC<EditPromoModalProps> = ({
  isOpen,
  onClose,
  promo,
  onSave,
}) => {
  const getDefaultDates = () => {
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(now.getDate() + 30);
    return {
      publishedAt: toDateTimeLocalString(now),
      takedownAt: toDateTimeLocalString(nextMonth),
    };
  };

  const defaultDates = getDefaultDates();

  const [title, setTitle] = useState(promo?.title || "");
  const [bannerUrl, setBannerUrl] = useState(promo?.bannerUrl || SAMPLE_BANNER_PATH);
  const [bannerLink, setBannerLink] = useState(promo?.bannerLink || (promo ? "" : SAMPLE_BANNER_LINK));
  const [shortDescription, setShortDescription] = useState(promo?.shortDescription || "");
  const [contentHtml, setContentHtml] = useState(
    promo?.contentHtml ||
      "<h3>Detail Penawaran Promo</h3>\n<p>Tuliskan informasi lengkap benefit, tata cara klaim, dan syarat ketentuan promo di sini.</p>"
  );
  const [publishedAt, setPublishedAt] = useState(promo?.publishedAt || defaultDates.publishedAt);
  const [takedownAt, setTakedownAt] = useState(promo?.takedownAt || defaultDates.takedownAt);
  const [hideBeforePublished, setHideBeforePublished] = useState(promo?.hideBeforePublished ?? false);
  const [isHidden, setIsHidden] = useState(Boolean(promo?.isHidden));
  const [isHighlight, setIsHighlight] = useState(Boolean(promo?.isHighlight));
  const [bannerPreviewError, setBannerPreviewError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave({
        type: "promo",
        title: title.trim(),
        bannerUrl: bannerUrl.trim(),
        bannerLink: bannerLink.trim() || undefined,
        shortDescription: shortDescription.trim(),
        contentHtml: contentHtml.trim(),
        publishedAt,
        takedownAt,
        hideBeforePublished,
        isHidden,
        isHighlight,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan promosi.";
      setSubmitError(msg);
    } finally {
      setIsSaving(false);
    }
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
                : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
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
              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer hover:underline"
            >
              <Sparkles className="w-3 h-3" />
              <span>Gunakan Sampel Banner</span>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={bannerUrl}
              onChange={(e) => {
                setBannerUrl(e.target.value);
                setBannerPreviewError(false);
              }}
              placeholder="https://... atau /images/sample-images/ads.sample.png"
              className={cn(
                "w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all font-mono text-xs",
                errors.bannerUrl
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
              )}
            />
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.bannerUrl && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.bannerUrl}
            </p>
          )}

          {/* Banner Preview Card */}
          {bannerUrl && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-2">
              <div className="flex items-center justify-between px-2 py-1 mb-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="font-medium">Pratinjau Banner:</span>
                <span className="text-[10px]">Aspek Rasio Bebas (Responsif)</span>
              </div>
              <div className="relative w-full rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center min-h-[120px] max-h-[220px]">
                {bannerPreviewError ? (
                  <div className="p-4 text-center text-xs text-red-500 dark:text-red-400 flex flex-col items-center gap-1">
                    <AlertCircle className="w-5 h-5" />
                    <span>Gambar gagal dimuat dari URL ini. Pastikan link gambar valid.</span>
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={bannerUrl}
                    alt="Preview banner promo"
                    className="w-full h-auto max-h-[220px] object-cover rounded-xl"
                    onError={() => setBannerPreviewError(true)}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Link Tujuan Banner (Opsional) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Link Tujuan Banner <span className="text-gray-400 font-normal lowercase">(opsional)</span>
            </label>
            <span className="text-[11px] text-gray-400">URL diarahkan saat banner diklik</span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={bannerLink}
              onChange={(e) => setBannerLink(e.target.value)}
              placeholder="https://sakuin.id/promo/... atau tautan eksternal"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all font-mono text-xs"
            />
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* 4. Deskripsi Singkat */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Deskripsi Singkat <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-gray-400">{shortDescription.length}/180 karakter</span>
          </div>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Ringkasan promo yang menarik perhatian pengguna dalam 1-2 kalimat..."
            className={cn(
              "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all resize-none",
              errors.shortDescription
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            )}
          />
          {errors.shortDescription && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.shortDescription}
            </p>
          )}
        </div>

        {/* 5. Detail Lengkap (HTML Editor) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Detail Lengkap Promo <span className="text-red-500">*</span>
          </label>
          <HtmlEditor
            value={contentHtml}
            onChange={(html) => setContentHtml(html)}
            placeholder="Tuliskan detail promosi, benefit cashback/diskon, syarat ketentuan, dan langkah klaim..."
            minHeight="220px"
          />
        </div>

        {/* 6. Jadwal Waktu Tayang (PublishedAt & TakedownAt) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-850/30">
          {/* Tanggal Terbit */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Tanggal Terbit <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleSetPublishNow}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer hover:underline"
              >
                Sekarang
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
                  : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
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
                  : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
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

        {/* 7. Checklist: Jadikan Promosi Unggulan (Highlight) */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-850/50 p-4 transition-all hover:border-blue-500/40">
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isHighlight}
              onChange={(e) => setIsHighlight(e.target.checked)}
              className="mt-0.5 h-4.5 w-4.5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 cursor-pointer accent-blue-600"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                  Jadikan Promosi Unggulan (Highlight)
                </span>
                {isHighlight && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Highlight Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Tampilkan di bagian atas halaman promosi pengguna dalam kartu besar. Jika ada lebih dari satu promosi highlight, otomatis tersusun menjadi carousel interaktif dengan auto-slide tiap 5 detik.
              </p>
            </div>
          </label>
        </div>

        {/* 8. Checklist: Sembunyikan dari Pengguna */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-850/50 p-4 transition-all hover:border-blue-500/40">
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isHidden}
              onChange={(e) => setIsHidden(e.target.checked)}
              className="mt-0.5 h-4.5 w-4.5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 cursor-pointer accent-blue-600"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                  Sembunyikan dari pengguna
                </span>
                {isHidden ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                    <EyeOff className="w-3 h-3" />
                    Disembunyikan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                    Tampil di Dashboard
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Centang opsi ini apabila promosi ingin disembunyikan sementara dari pengguna tanpa harus menghapusnya dari database.
              </p>
            </div>
          </label>
        </div>

        {/* Checklist: Sembunyikan sebelum tanggal terbit */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-850/50 p-4 transition-all hover:border-blue-500/40">
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hideBeforePublished}
              onChange={(e) => setHideBeforePublished(e.target.checked)}
              className="mt-0.5 h-4.5 w-4.5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
            />
            <div className="flex-1">
              <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 block">
                Sembunyikan dari pengguna sebelum tanggal terbit
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block leading-relaxed">
                Jika dicentang, promosi ini tidak akan muncul di halaman pengguna sampai waktu terbit tiba.
              </span>
            </div>
          </label>
        </div>

        {/* Error Message Banner on Screen */}
        {submitError && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Gagal Menyimpan Promosi:</span>
              <span>{submitError}</span>
            </div>
          </div>
        )}

        {/* Form Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : promo ? "Simpan Perubahan" : "Terbitkan Promosi"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const EditPromoModal: React.FC<EditPromoModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <EditPromoDialog {...props} />;
};

export default EditPromoModal;
