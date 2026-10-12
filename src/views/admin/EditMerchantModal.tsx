"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Link as LinkIcon,
  Store,
  Check,
  AlertCircle,
  Sparkles,
  Trash2,
  Tag,
  Plus,
} from "lucide-react";
import { DEFAULT_MERCHANT_LOGOS, DEFAULT_SUB_MERCHANTS } from "@/stores/useCategoryStore";
import type { MerchantItem, CategoryItem } from "@/models/category";
import MerchantLogo from "./MerchantLogo";
import { cn } from "@/utils";
import { Modal } from "@/views/ui/modal";

interface EditMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantItem;
  category: CategoryItem;
  onSave: (updates: { name: string; logoUrl?: string; subMerchants?: string[] }) => void;
}

export const EditMerchantModal: React.FC<EditMerchantModalProps> = ({
  isOpen,
  onClose,
  merchant,
  category,
  onSave,
}) => {
  const [name, setName] = useState(merchant.name);
  const [logoUrl, setLogoUrl] = useState(merchant.logoUrl || "");
  const [subMerchants, setSubMerchants] = useState<string[]>(merchant.subMerchants || []);
  const [newSubInput, setNewSubInput] = useState("");
  const [imageTestStatus, setImageTestStatus] = useState<"idle" | "loading" | "valid" | "error">(
    "idle"
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setName(merchant.name);
    setLogoUrl(merchant.logoUrl || "");
    setSubMerchants(merchant.subMerchants || []);
    setImageTestStatus(merchant.logoUrl ? "valid" : "idle");
  }, [merchant, isOpen]);

  // Test image URL validity when user changes it
  useEffect(() => {
    const trimmed = logoUrl.trim();
    if (!trimmed) {
      setImageTestStatus("idle");
      return;
    }

    setImageTestStatus("loading");
    const img = new Image();
    img.src = trimmed;
    img.onload = () => {
      setImageTestStatus("valid");
    };
    img.onerror = () => {
      setImageTestStatus("error");
    };
  }, [logoUrl]);

  if (!isOpen || !mounted) return null;

  const handleAddSubMerchant = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = newSubInput.trim();
    if (!raw) return;

    // Support comma-separated additions (e.g. "MCD, Mekdi, McDonalds")
    const additions = raw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const updated = [...subMerchants];
    additions.forEach((item) => {
      if (!updated.some((s) => s.toLowerCase() === item.toLowerCase())) {
        updated.push(item);
      }
    });

    setSubMerchants(updated);
    setNewSubInput("");
  };

  const handleRemoveSubMerchant = (subToRemove: string) => {
    setSubMerchants(
      subMerchants.filter((s) => s.toLowerCase() !== subToRemove.toLowerCase())
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      logoUrl: logoUrl.trim() || undefined,
      subMerchants,
    });
    onClose();
  };

  // Suggestion if we have known default logo or sub-merchants for this merchant name
  const cleanName = name.toLowerCase().trim();
  const suggestedLogo = DEFAULT_MERCHANT_LOGOS[cleanName];
  const suggestedSubMerchants = DEFAULT_SUB_MERCHANTS[cleanName];

  const handleApplyPresetSubs = () => {
    if (!suggestedSubMerchants) return;
    const merged = [...subMerchants];
    suggestedSubMerchants.forEach((sub) => {
      if (!merged.some((s) => s.toLowerCase() === sub.toLowerCase())) {
        merged.push(sub);
      }
    });
    setSubMerchants(merged);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      portal={true}
      maxWidth="lg"
      backdropClassName="z-[9999]"
      className="max-h-[90vh] flex flex-col overflow-hidden"
    >
      {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Edit Merchant & Sub-Merchant
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kategori: <span className="font-semibold">{category.name}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-5 space-y-4">
          {/* Field 1: Nama Merchant Induk */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Nama Merchant Induk
            </label>
            <div className="relative">
              <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: McDonald's, HokBen, Alfamart..."
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          {/* Field 2: Sub-Merchant & Alias Penamaan API (Case Insensitive) */}
          <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-850/60 border border-gray-200/60 dark:border-gray-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-500" />
                <span>Sub-Merchant & Alias API</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 font-semibold normal-case">
                  Case-insensitive
                </span>
              </label>
              <span className="text-[11px] text-gray-400">
                {subMerchants.length} alias terdaftar
              </span>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              Daftar variasi nama merchant dari respon API transaksi (misal: <strong>MCD</strong>, <strong>Mekdi</strong>, <strong>HHB</strong>, <strong>Hk Hk Bnt</strong>) agar otomatis terpetakan ke merchant ini.
            </p>

            {/* Input tag alias */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubInput}
                onChange={(e) => setNewSubInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubMerchant();
                  }
                }}
                placeholder="Ketik alias lalu Enter (misal: MCD, Mekdi, HHB)..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => handleAddSubMerchant()}
                disabled={!newSubInput.trim()}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            {/* Sub-merchant Chips List */}
            {subMerchants.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-36 overflow-y-auto custom-scrollbar">
                {subMerchants.map((sub, idx) => (
                  <span
                    key={`${sub}-${idx}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200/80 dark:border-gray-700 shadow-2xs group"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubMerchant(sub)}
                      className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                      title="Hapus alias"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">
                Belum ada sub-merchant. Tambahkan alias di atas agar nama singkatan otomatis dikenali.
              </p>
            )}

            {/* Quick button to apply preset sub-merchants if available */}
            {suggestedSubMerchants && suggestedSubMerchants.length > 0 && (
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                  Rekomendasi alias bawaan: {suggestedSubMerchants.slice(0, 3).join(", ")}...
                </span>
                <button
                  type="button"
                  onClick={handleApplyPresetSubs}
                  className="text-[11px] font-bold text-purple-600 hover:underline cursor-pointer"
                >
                  Terapkan Rekomendasi
                </button>
              </div>
            )}
          </div>

          {/* Field 3: URL Logo Merchant */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Link URL Logo (Opsional)
              </label>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="text-[11px] text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Hapus Logo
                </button>
              )}
            </div>

            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://domain.com/path-to-logo.png atau .svg"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono text-xs"
              />
            </div>

            {/* Suggestion for official logo */}
            {suggestedLogo && suggestedLogo !== logoUrl && (
              <div className="mt-2 flex items-center justify-between p-2 rounded-xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50">
                <div className="flex items-center gap-2 text-xs text-purple-900 dark:text-purple-200">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Ditemukan logo resmi untuk <strong>{name}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setLogoUrl(suggestedLogo)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 active:scale-95 transition-all cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            )}
          </div>

          {/* Live Preview Card */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-850/60 p-3.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Preview Tampilan Merchant & Sub-Merchant
            </span>

            <div className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <MerchantLogo name={name || "Merchant"} logoUrl={logoUrl} size="lg" />
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block truncate">
                      {name || "Nama Merchant"}
                    </span>
                    <span className="text-xs text-gray-400 truncate block">
                      Kategori: {category.name}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                {logoUrl.trim() && (
                  <div className="shrink-0 text-right">
                    {imageTestStatus === "valid" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <Check className="w-3 h-3" />
                        Logo Valid
                      </span>
                    )}
                    {imageTestStatus === "loading" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        Memuat...
                      </span>
                    )}
                    {imageTestStatus === "error" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        <AlertCircle className="w-3 h-3" />
                        URL Gagal Dimuat
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Sub-merchant aliases preview */}
              {subMerchants.length > 0 && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] font-semibold text-gray-400 block mb-1">
                    Alias yang dikenali:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {subMerchants.slice(0, 5).map((sub, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-mono"
                      >
                        {sub}
                      </span>
                    ))}
                    {subMerchants.length > 5 && (
                      <span className="text-[10px] text-gray-400">
                        +{subMerchants.length - 5} lainnya
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
    </Modal>
  );
};

export default EditMerchantModal;
