"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { cn } from "@/utils";
import HtmlEditor from "./HtmlEditor";
import type { PromoItem } from "@/models/promo";
import { Modal } from "@/views/ui/modal";

interface EditGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide?: PromoItem | null;
  onSave: (guideData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">) => void;
}

const SAMPLE_BANNER_PATH = "/images/sample-images/ads.sample.png";

export const EditGuideModal: React.FC<EditGuideModalProps> = ({
  isOpen,
  onClose,
  guide,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [bannerPreviewError, setBannerPreviewError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (guide) {
        setTitle(guide.title);
        setBannerUrl(guide.bannerUrl);
        setShortDescription(guide.shortDescription);
        setContentHtml(guide.contentHtml);
      } else {
        setTitle("");
        setBannerUrl(SAMPLE_BANNER_PATH);
        setShortDescription("");
        setContentHtml(
          "<h3>Langkah-Langkah Panduan Sakuin</h3>\n<p>Tuliskan petunjuk interaktif, langkah demi langkah, dan penjelasan penggunaan fitur aplikasi di sini.</p>\n<ol>\n  <li>Langkah pertama...</li>\n  <li>Langkah kedua...</li>\n</ol>"
        );
      }
      setBannerPreviewError(false);
      setErrors({});
    }
  }, [isOpen, guide]);

  if (!isOpen) return null;

  const handleSetSampleBanner = () => {
    setBannerUrl(SAMPLE_BANNER_PATH);
    setBannerPreviewError(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Judul panduan wajib diisi";
    }
    if (!bannerUrl.trim()) {
      newErrors.bannerUrl = "Link banner/ilustrasi panduan wajib diisi";
    }
    if (!shortDescription.trim()) {
      newErrors.shortDescription = "Deskripsi singkat panduan wajib diisi";
    }
    if (!contentHtml.trim()) {
      newErrors.contentHtml = "Detail panduan wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      type: "guide",
      title: title.trim(),
      bannerUrl: bannerUrl.trim(),
      shortDescription: shortDescription.trim(),
      contentHtml: contentHtml.trim(),
      // Panduan tidak memiliki tanggal terbit (evergreen)
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
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-emerald-50/40 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {guide ? "Edit Panduan" : "Tambah Panduan"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Dokumentasi & panduan langkah interaktif langsung di dashboard pengguna
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
          {/* 1. Judul Panduan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Judul Panduan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Panduan Menggunakan SakuCard Virtual untuk Pembayaran Online"
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all",
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
              )}
            />
            {errors.title && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* 2. Link Banner / Ilustrasi Panduan (URL Gambar) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Link Banner / Ilustrasi Panduan (URL Gambar) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleSetSampleBanner}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                Pakai Sampel Ilustrasi (ads.sample.png)
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
                    : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
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
                Pratinjau Banner / Ilustrasi:
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
                        : "Masukkan link ilustrasi untuk melihat pratinjau"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Deskripsi Singkat Panduan */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Deskripsi Singkat Panduan <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-400">{shortDescription.length} karakter</span>
            </div>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ringkasan apa yang akan dipelajari pembaca dalam panduan ini..."
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all resize-y",
                errors.shortDescription
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
              )}
            />
            {errors.shortDescription && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.shortDescription}
              </p>
            )}
          </div>

          {/* 4. Detail Panduan (HTML Text Editor) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Detail Panduan (HTML Text Editor) <span className="text-red-500">*</span>
            </label>
            <HtmlEditor
              value={contentHtml}
              onChange={setContentHtml}
              placeholder="Tuliskan petunjuk, langkah berurutan, tips, dan penjelasan lengkap di sini..."
              minHeight="240px"
            />
            {errors.contentHtml && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.contentHtml}
              </p>
            )}
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>{guide ? "Simpan Perubahan" : "Simpan Panduan"}</span>
            </button>
          </div>
        </form>
    </Modal>
  );
};

export default EditGuideModal;
