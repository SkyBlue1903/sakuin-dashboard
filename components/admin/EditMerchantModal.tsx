"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Link as LinkIcon,
  Store,
  Check,
  AlertCircle,
  Trash2,
  Tag,
  Plus,
  Moon,
  Key,
  Copy,
} from "lucide-react";
import {
  MerchantItem,
  CategoryItem,
} from "@/context/CategoryContext";
import MerchantLogo from "./MerchantLogo";
import { cn } from "@/utils";
import { Modal } from "@/components/ui/modal";

interface EditMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantItem;
  category: CategoryItem;
  onSave: (updates: {
    name: string;
    logoUrl?: string;
    logoDarkUrl?: string;
    subMerchants?: string[];
  }) => void;
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
  const [logoDarkUrl, setLogoDarkUrl] = useState(merchant.logoDarkUrl || "");
  const [subMerchants, setSubMerchants] = useState<string[]>(merchant.subMerchants || []);
  const [newSubInput, setNewSubInput] = useState("");
  const [imageTestStatus, setImageTestStatus] = useState<"idle" | "loading" | "valid" | "error">(
    "idle"
  );
  const [darkImageTestStatus, setDarkImageTestStatus] = useState<"idle" | "loading" | "valid" | "error">(
    "idle"
  );
  const [copiedId, setCopiedId] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setName(merchant.name);
    setLogoUrl(merchant.logoUrl || "");
    setLogoDarkUrl(merchant.logoDarkUrl || "");
    setSubMerchants((merchant.subMerchants || []).map((s) => s.trim().toUpperCase()));
    setImageTestStatus(merchant.logoUrl ? "valid" : "idle");
    setDarkImageTestStatus(merchant.logoDarkUrl ? "valid" : "idle");
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

  // Test dark image URL validity when user changes it
  useEffect(() => {
    const trimmed = logoDarkUrl.trim();
    if (!trimmed) {
      setDarkImageTestStatus("idle");
      return;
    }

    setDarkImageTestStatus("loading");
    const img = new Image();
    img.src = trimmed;
    img.onload = () => {
      setDarkImageTestStatus("valid");
    };
    img.onerror = () => {
      setDarkImageTestStatus("error");
    };
  }, [logoDarkUrl]);

  if (!isOpen || !mounted) return null;

  const handleAddSubMerchant = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = newSubInput.trim();
    if (!raw) return;

    // Support comma-separated additions (e.g. "MCD, HHB, MEKDI")
    const additions = raw
      .split(",")
      .map((item) => item.trim().toUpperCase())
      .filter((item) => item.length > 0);

    const updated = [...subMerchants];
    additions.forEach((item) => {
      if (!updated.some((s) => s.toUpperCase() === item)) {
        updated.push(item);
      }
    });

    setSubMerchants(updated);
    setNewSubInput("");
  };

  const handleRemoveSubMerchant = (subToRemove: string) => {
    setSubMerchants(
      subMerchants.filter((s) => s.toUpperCase() !== subToRemove.toUpperCase())
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      logoUrl: logoUrl.trim() || undefined,
      logoDarkUrl: logoDarkUrl.trim() || undefined,
      subMerchants: subMerchants.map((s) => s.trim().toUpperCase()),
    });
    onClose();
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
          {/* Field: ID Tabel */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand-500" />
                <span>ID Tabel</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(merchant.id);
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                  }}
                  className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer font-sans normal-case"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500 font-semibold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin ID</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                value={merchant.id}
                readOnly
                disabled
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200/80 dark:border-gray-800 bg-gray-100/80 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 font-mono select-all cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              ID numerik incremental pada tabel merchants di database (Primary Key).
            </p>
          </div>

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
              Daftar variasi nama merchant dari respon API transaksi (misal: <strong>MCD</strong>, <strong>MEKDI</strong>, <strong>HHB</strong>, <strong>HK HK BNT</strong>) agar otomatis terpetakan ke merchant ini.
            </p>

            {/* Input tag alias */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubInput}
                onChange={(e) => setNewSubInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubMerchant();
                  }
                }}
                placeholder="Ketik alias lalu Enter (misal: MCD, HHB, MEKDI)..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-brand-500"
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
          </div>

          {/* Field 4: URL Logo Gambar (Dark Mode, Opsional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>URL Logo Gambar (Dark Mode, Opsional)</span>
              </label>
              {logoDarkUrl && (
                <button
                  type="button"
                  onClick={() => setLogoDarkUrl("")}
                  className="text-[11px] text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Hapus Logo Dark
                </button>
              )}
            </div>

            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={logoDarkUrl}
                onChange={(e) => setLogoDarkUrl(e.target.value)}
                placeholder="https://domain.com/path-to-logo-dark.png atau .svg (Khusus Dark Mode)"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Otomatis digunakan saat tampilan dark mode aktif. Jika kosong, akan memakai logo utama.
            </p>
          </div>

          {/* Live Preview Card */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-850/60 p-3.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Preview Tampilan Merchant & Sub-Merchant
            </span>

            <div className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <MerchantLogo
                    name={name || "Merchant"}
                    logoUrl={logoUrl}
                    logoDarkUrl={logoDarkUrl}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900 dark:text-white block truncate">
                        {name || "Nama Merchant"}
                      </span>
                    </div>
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
