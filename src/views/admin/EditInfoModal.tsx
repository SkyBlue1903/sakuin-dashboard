"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Info as InfoIcon,
  Calendar,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/utils";
import HtmlEditor from "./HtmlEditor";
import type { PromoItem } from "@/models/promo";
import { Modal } from "@/views/ui/modal";

interface EditInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  info?: PromoItem | null;
  onSave: (infoData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => Promise<void> | void;
}

const SAMPLE_BANNER_PATH = "/images/sample-images/ads.sample.png";

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

export const EditInfoModal: React.FC<EditInfoModalProps> = ({
  isOpen,
  onClose,
  info,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [bannerPreviewError, setBannerPreviewError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (info) {
        setTitle(info.title);
        setBannerUrl(info.bannerUrl);
        setBannerLink(info.bannerLink || "");
        setShortDescription(info.shortDescription);
        setContentHtml(info.contentHtml);
        setPublishedAt(info.publishedAt || toDateTimeLocalString(new Date()));
        setIsHidden(Boolean(info.isHidden));
        setIsHighlight(Boolean(info.isHighlight));
      } else {
        const now = new Date();
        setTitle("");
        setBannerUrl(SAMPLE_BANNER_PATH);
        setBannerLink("");
        setShortDescription("");
        setContentHtml(
          "<h3>Pemberitahuan Informasi Sakuin</h3>\n<p>Tuliskan penjelasan lengkap pengumuman, panduan fitur, atau pembaruan layanan untuk pengguna di sini.</p>"
        );
        setPublishedAt(toDateTimeLocalString(now));
        setIsHidden(false);
        setIsHighlight(false);
      }
      setBannerPreviewError(false);
      setErrors({});
      setSubmitError(null);
      setIsSaving(false);
    }
  }, [isOpen, info]);

  if (!isOpen) return null;

  const handleSetSampleBanner = () => {
    setBannerUrl(SAMPLE_BANNER_PATH);
    setBannerPreviewError(false);
  };

  const handleSetPublishNow = () => {
    const now = new Date();
    setPublishedAt(toDateTimeLocalString(now));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Judul informasi wajib diisi";
    }
    if (!bannerUrl.trim()) {
      newErrors.bannerUrl = "Link banner informasi wajib diisi";
    }
    if (!shortDescription.trim()) {
      newErrors.shortDescription = "Deskripsi singkat informasi wajib diisi";
    }
    if (!contentHtml.trim()) {
      newErrors.contentHtml = "Detail informasi wajib diisi";
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
        type: "info",
        title: title.trim(),
        bannerUrl: bannerUrl.trim(),
        bannerLink: bannerLink.trim() || undefined,
        shortDescription: shortDescription.trim(),
        contentHtml: contentHtml.trim(),
        publishedAt: publishedAt || toDateTimeLocalString(new Date()),
        isHidden,
        isHighlight,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan informasi ke database";
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
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-blue-50/40 dark:bg-blue-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            <InfoIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {info ? "Edit Informasi" : "Tambah Informasi"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Pengumuman atau pembaruan layanan untuk pengguna Sakuin.id
            </p>
          </div>
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
        {/* 1. Judul Informasi */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Judul Informasi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Pemberitahuan Pemeliharaan Server & Update Fitur Keamanan"
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

        {/* 2. Link Banner Informasi (URL Gambar) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Link Banner Informasi (URL Gambar) <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleSetSampleBanner}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer hover:underline"
            >
              <Sparkles className="w-3 h-3" />
              Pakai Sampel Banner (ads.sample.png)
            </button>
          </div>

          <div className="relative">
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
                  : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
              )}
            />
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
              Pratinjau Banner Informasi:
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
                      : "Masukkan link banner informasi untuk melihat pratinjau"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Link Eksternal / Artikel Terkait (Opsional) */}
          <div className="pt-1 space-y-1">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Link Artikel / Halaman Terkait (Opsional)
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={bannerLink}
                onChange={(e) => setBannerLink(e.target.value)}
                placeholder="https://sakuin.id/... (opsional)"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* 3. Deskripsi Singkat Informasi */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Deskripsi Singkat Informasi <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-gray-400">{shortDescription.length} karakter</span>
          </div>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Ringkasan 1-2 kalimat mengenai pengumuman atau informasi ini..."
            className={cn(
              "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all resize-y",
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

        {/* 4. Detail Informasi (HTML Text Editor) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Detail Informasi (HTML Text Editor) <span className="text-red-500">*</span>
          </label>
          <HtmlEditor
            value={contentHtml}
            onChange={setContentHtml}
            placeholder="Tuliskan isi pengumuman, penjelasan teknis, dan informasi lengkap di sini..."
            minHeight="220px"
          />
          {errors.contentHtml && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.contentHtml}
            </p>
          )}
        </div>

        {/* 5. Tanggal Terbit */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Tanggal Terbit
            </label>
            <button
              type="button"
              onClick={handleSetPublishNow}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer hover:underline"
            >
              ⚡ Terbit Sekarang
            </button>
          </div>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* 6. Kolom Centang: Highlight Unggulan */}
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
                  Jadikan Informasi Unggulan (Highlight)
                </span>
                {isHighlight && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Highlight Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Tampilkan di bagian atas halaman pengguna dalam kartu besar. Jika ada lebih dari satu informasi highlight, otomatis tersusun menjadi carousel interaktif.
              </p>
            </div>
          </label>
        </div>

        {/* 7. Kolom Centang: Sembunyikan dari Pengguna */}
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
                Centang opsi ini apabila informasi ingin disembunyikan sementara dari pengguna tanpa harus menghapusnya dari database.
              </p>
            </div>
          </label>
        </div>

        {/* Error Message Banner on Screen */}
        {submitError && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Gagal Menyimpan Informasi:</span>
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
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <InfoIcon className="w-4 h-4" />
            <span>{isSaving ? "Menyimpan..." : info ? "Simpan Perubahan" : "Terbitkan Informasi"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditInfoModal;
