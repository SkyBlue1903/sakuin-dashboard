"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  ArrowRightLeft,
  Store,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Edit3,
  Link as LinkIcon,
  Tag,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Moon,
  Loader2,
} from "lucide-react";
import { useCategory } from "@/features/admin/merchant/presentation/stores/useCategoryStore";
import type { MerchantItem } from "@/features/admin/merchant/domain/category";
import CategoryIcon from "@/features/admin/merchant/presentation/components/CategoryIcon";
import MerchantLogo from "@/features/admin/merchant/presentation/components/MerchantLogo";
import MoveMerchantModal from "@/features/admin/merchant/presentation/components/MoveMerchantModal";
import EditMerchantModal from "@/features/admin/merchant/presentation/components/EditMerchantModal";
import LazyItem from "@/shared/presentation/components/ui/LazyItem";
import {
  useResponsiveInfiniteScroll,
  type UseInfiniteScrollOptions,
} from "@/shared/hooks/useResponsiveInfiniteScroll";
import { cn } from "@/shared/utils";
import { compressImageUrl } from "@/shared/utils/imageOptimizer";
import { useToast } from "@/shared/presentation/stores/ToastContext";

interface RightSidebarContentProps {
  className?: string;
  infiniteScrollOptions?: Partial<UseInfiniteScrollOptions>;
}

export const RightSidebarContent: React.FC<RightSidebarContentProps> = ({
  className,
  infiniteScrollOptions,
}) => {
  const {
    activeCategory,
    categories,
    mobileView,
    setMobileView,
    addMerchant,
    updateMerchant,
    removeMerchant,
    matchMerchant,
  } = useCategory();

  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [newMerchantName, setNewMerchantName] = useState("");
  const [newMerchantLogoUrl, setNewMerchantLogoUrl] = useState("");
  const [newMerchantLogoDarkUrl, setNewMerchantLogoDarkUrl] = useState("");
  const [newMerchantAliases, setNewMerchantAliases] = useState("");
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);

  // Modal states
  const [editingMerchant, setEditingMerchant] = useState<MerchantItem | null>(null);
  const [movingMerchant, setMovingMerchant] = useState<MerchantItem | null>(null);

  // Test Simulator state
  const [testQuery, setTestQuery] = useState("");

  // Filtering: searches parent merchant name OR any sub-merchant / alias (case-insensitive)
  const cleanSearch = searchQuery.toLowerCase().trim();
  const filteredMerchants = (activeCategory?.merchants || []).filter((m) => {
    if (!cleanSearch) return true;
    if (m.name.toLowerCase().includes(cleanSearch)) return true;
    if (
      m.subMerchants &&
      m.subMerchants.some((sub) => sub.toLowerCase().includes(cleanSearch))
    ) {
      return true;
    }
    return false;
  });

  // Responsive Infinite Scroll: Batasi render sesuai ukuran layar (viewport-based windowing)
  const scrollConfig: UseInfiniteScrollOptions = {
    totalItems: filteredMerchants.length,
    initialBatchSize: infiniteScrollOptions?.initialBatchSize,
    loadMoreBatchSize: infiniteScrollOptions?.loadMoreBatchSize,
    threshold: infiniteScrollOptions?.threshold,
  };

  const {
    visibleCount,
    hasMore,
    sentinelRef,
  } = useResponsiveInfiniteScroll(scrollConfig);

  const visibleMerchants = filteredMerchants.slice(0, visibleCount);

  // Ketika kategori kosong: kosong melompong di desktop, dan tidak terlihat di mobile
  if (!activeCategory || categories.length === 0) {
    return <div className="hidden md:block flex-1 min-w-0" />;
  }

  const handleAddMerchantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchantName.trim()) return;

    const parsedAliases = newMerchantAliases
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0);

    const rawLogo = newMerchantLogoUrl.trim();
    const rawLogoDark = newMerchantLogoDarkUrl.trim();

    const result = addMerchant(activeCategory.id, {
      name: newMerchantName.trim(),
      logoUrl: rawLogo ? compressImageUrl(rawLogo) : undefined,
      logoDarkUrl: rawLogoDark ? compressImageUrl(rawLogoDark) : undefined,
      subMerchants: parsedAliases.length > 0 ? parsedAliases : undefined,
    });

    if (result.success) {
      showToast(`Merchant "${newMerchantName.trim()}" berhasil ditambahkan!`);
      setNewMerchantName("");
      setNewMerchantLogoUrl("");
      setNewMerchantLogoDarkUrl("");
      setNewMerchantAliases("");
      setIsOptionsExpanded(false);
      setStatusMessage({ text: result.message, isError: false });
    } else {
      showToast(result.message, "error");
      setStatusMessage({ text: result.message, isError: true });
    }

    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleSaveEditMerchant = (updates: {
    name: string;
    logoUrl?: string;
    logoDarkUrl?: string;
    subMerchants?: string[];
  }) => {
    if (!editingMerchant) return;
    const sanitizedUpdates = {
      ...updates,
      logoUrl: updates.logoUrl ? compressImageUrl(updates.logoUrl) : undefined,
      logoDarkUrl: updates.logoDarkUrl ? compressImageUrl(updates.logoDarkUrl) : undefined,
    };
    const result = updateMerchant(activeCategory.id, editingMerchant.id, sanitizedUpdates);
    if (result.success) {
      showToast(`Merchant "${updates.name}" berhasil diperbarui!`);
      setStatusMessage({ text: result.message, isError: false });
    } else {
      showToast(result.message, "error");
      setStatusMessage({ text: result.message, isError: true });
    }
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleDeleteMerchant = (merchant: MerchantItem) => {
    if (confirm(`Yakin ingin menghapus merchant "${merchant.name}" dari kategori ini?`)) {
      removeMerchant(activeCategory.id, merchant.id);
      showToast(`Merchant "${merchant.name}" berhasil dihapus.`);
      setStatusMessage({
        text: `Merchant "${merchant.name}" berhasil dihapus.`,
        isError: false,
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    }
  };

  const testResult = testQuery.trim() ? matchMerchant(testQuery) : null;

  // Preset test queries for user quick-click
  const quickTestCases = [
    "Hhb H16 The Park Smg",
    "MCD Drive Thru",
    "Mekdi Kemang",
    "HHB",
    "Hk Hk Bnt Citra",
    "Alfa Midi 0812",
    "KFC Delivery",
  ];

  return (
    <div
      className={cn(
        "flex-1 min-w-0 w-full md:h-full md:overflow-y-auto custom-scrollbar pb-10",
        mobileView === "categories" ? "hidden md:block" : "block",
        className
      )}
    >
      {/* Sticky Header Bar: Active Category Title & Search Bar */}
      <div
        className={cn(
          "sticky top-16 md:top-0 z-20",
          "w-full pt-2 pb-3.5",
          "space-y-3",
          "bg-background/95 backdrop-blur-md",
          "border-b border-border-subtle shadow-xs",
          "transition-all",
          "py-4"
        )}
      >
        {/* Mobile Navigation Back Button */}
        <div className="md:hidden flex items-center justify-between w-full px-4 sm:pr-6 pb-0.5">
          <button
            type="button"
            onClick={() => setMobileView("categories")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold text-text-primary shadow-ds-xs hover:bg-surface-secondary active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-primary" />
            <span>Kembali ke Kategori</span>
          </button>
          <span className="text-[11px] font-medium text-text-tertiary">
            {activeCategory.name}
          </span>
        </div>

        {/* Row 1: Category Info & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full lg:max-w-none mx-auto px-4 sm:pr-6 lg:pr-8 xl:pr-10">
          <div className="flex items-center gap-3 min-w-0">
            <CategoryIcon
              iconType={activeCategory.iconType}
              iconName={activeCategory.iconName}
              iconSrc={activeCategory.iconSrc}
              color={activeCategory.color}
              size="lg"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-bold text-text-primary truncate">
                  {activeCategory.name}
                </h2>
                {activeCategory.apiCategoryName && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                    API: {activeCategory.apiCategoryName}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-secondary text-text-secondary border border-border-subtle">
                  {activeCategory.merchants.length} Merchant
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5 truncate">
                {activeCategory.description || "Daftar merchant yang dipetakan ke kategori ini"}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Search Input for Merchants & Sub-merchants */}
        <div className="w-full lg:max-w-none mx-auto px-4 sm:pr-6 lg:pr-8 xl:pr-10">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari merchant atau sub-merchant (misal: MCD, HHB, Alfamart)...`}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-tertiary shadow-ds-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4 pt-4 w-full lg:max-w-none mx-auto px-4 sm:pr-6 lg:pr-8 xl:pr-10">
        {/* Context Information Notice Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-info-bg border border-info-border text-info flex items-start gap-3">
          <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed space-y-1">
            <p className="font-semibold text-info">
              Pemetaan Sub-Merchant & Penanganan Singkatan API
            </p>
            <p className="text-info/80 text-xs">
              Sistem mengenali variasi nama dan singkatan transaksi secara <strong>case-insensitive</strong>. Contoh: respon API dengan teks <code className="font-bold">MCD</code> atau <code className="font-bold">Mekdi</code> akan otomatis terpetakan ke <strong>McDonald&apos;s</strong>, dan <code className="font-bold">HHB</code> atau <code className="font-bold">Hk Hk Bnt</code> akan masuk ke <strong>HokBen</strong>.
            </p>
          </div>
        </div>

        {/* Quick Add Merchant Form */}
        <div className="rounded-2xl sm:rounded-3xl border border-border-subtle bg-surface shadow-ds-xs p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm font-bold text-text-primary flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              <span>Tambah Merchant ke Kategori Ini</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isOptionsExpanded ? "Sembunyikan Opsi" : "+ Opsi Logo & Sub-merchant"}</span>
              {isOptionsExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <form onSubmit={handleAddMerchantSubmit} className="space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newMerchantName}
                  onChange={(e) => setNewMerchantName(e.target.value)}
                  placeholder="Nama merchant induk (contoh: McDonald's, HokBen, Alfamart...)"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-border bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!newMerchantName.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 active:scale-95 text-text-inverse text-xs sm:text-sm font-semibold shadow-ds-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Merchant</span>
              </button>
            </div>

            {/* Optional Logo URL & Sub-merchant Inputs */}
            {isOptionsExpanded && (
              <div className="p-3.5 rounded-2xl bg-surface-secondary border border-border-subtle space-y-3 animate-in fade-in duration-200">

                {/* Field Logo URL */}
                <div>
                  <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block mb-1">
                    URL Logo Gambar (Opsional)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                      <input
                        type="url"
                        value={newMerchantLogoUrl}
                        onChange={(e) => setNewMerchantLogoUrl(e.target.value)}
                        placeholder="https://domain.com/logo.svg atau .png"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono shadow-ds-xs"
                      />
                    </div>
                    {newMerchantLogoUrl && (
                      <div className="shrink-0 flex items-center gap-2">
                        <MerchantLogo
                          name={newMerchantName || "M"}
                          logoUrl={newMerchantLogoUrl}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Field Logo URL (Dark Mode) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-secondary" />
                      <span>URL Logo Gambar (Dark Mode, Opsional)</span>
                    </label>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-semibold">
                      Otomatis di Dark Mode
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                      <input
                        type="url"
                        value={newMerchantLogoDarkUrl}
                        onChange={(e) => setNewMerchantLogoDarkUrl(e.target.value)}
                        placeholder="https://domain.com/logo-white.svg atau .png (Khusus mode gelap)"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono shadow-ds-xs"
                      />
                    </div>
                    {newMerchantLogoDarkUrl && (
                      <div className="shrink-0 flex items-center gap-2 p-1 rounded-xl bg-gray-900 border border-gray-700" title="Preview Dark Mode">
                        <MerchantLogo
                          name={newMerchantName || "M"}
                          logoUrl={newMerchantLogoDarkUrl}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-text-tertiary mt-1 block">
                    Otomatis tampil saat tema gelap aktif. Jika dikosongkan, akan tetap memakai logo reguler.
                  </span>
                </div>

                {/* Field Sub-merchant / Aliases */}
                <div>
                  <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block mb-1">
                    Sub-Merchant / Alias API (Pisahkan dengan koma)
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                    <input
                      type="text"
                      value={newMerchantAliases}
                      onChange={(e) => setNewMerchantAliases(e.target.value.toUpperCase())}
                      placeholder="Contoh: MCD, MEKDI, MCDONALDS, PT REKSO"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-text-primary uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-ds-xs"
                    />
                  </div>
                  <span className="text-[10px] text-text-tertiary mt-1 block">
                    Semua transaksi yang mengandung teks di atas otomatis terpetakan ke merchant ini.
                  </span>
                </div>
              </div>
            )}
          </form>

          {/* Feedback Status Alert */}
          {statusMessage && (
            <div
              className={cn(
                "mt-2.5 p-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200",
                statusMessage.isError
                  ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/40"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
              )}
            >
              {statusMessage.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Merchant List Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 p-2 sm:p-4">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Daftar Merchant ({filteredMerchants.length > visibleMerchants.length ? `${visibleMerchants.length} dari ${filteredMerchants.length}` : filteredMerchants.length})
            </span>
            <span className="text-xs text-gray-400">
              Kategori: {activeCategory.name}
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {filteredMerchants.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
                  <Store className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Tidak ada Merchant Terdaftar
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                  {searchQuery
                    ? "Tidak ada merchant atau sub-merchant yang cocok dengan kata kunci pencarian."
                    : `Belum ada merchant di kategori ${activeCategory.name}. Tambahkan merchant pertama Anda melalui formulir di atas.`}
                </p>
              </div>
            ) : (
              <>
                {visibleMerchants.map((merchant) => {
                  const subCount = merchant.subMerchants?.length || 0;
                  return (
                    <LazyItem key={merchant.id} placeholderHeight={68}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 gap-2.5 rounded-2xl hover:bg-gray-50/80 dark:hover:bg-gray-850/60 transition-all group">
                        {/* Left: Merchant Logo + Name & Sub-merchant Chips */}
                        <div className="flex items-start gap-3 min-w-0 pr-2">
                          <MerchantLogo
                            name={merchant.name}
                            logoUrl={merchant.logoUrl}
                            logoDarkUrl={merchant.logoDarkUrl}
                            size="lg"
                            className="mt-0.5 sm:mt-0"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate block">
                                {merchant.name}
                              </span>
                              {merchant.logoUrl && (
                                <span
                                  className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                  title={merchant.logoUrl}
                                >
                                  <LinkIcon className="w-2.5 h-2.5" />
                                  Logo
                                </span>
                              )}
                              {merchant.logoDarkUrl && (
                                <span
                                  className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                                  title={`Logo Dark: ${merchant.logoDarkUrl}`}
                                >
                                  <Moon className="w-2.5 h-2.5" />
                                  Dark Logo
                                </span>
                              )}
                            </div>

                            {/* Sub-merchant Chips */}
                            <div className="flex flex-wrap items-center gap-1">
                              {subCount > 0 ? (
                                <>
                                  {merchant.subMerchants!.slice(0, 4).map((sub, i) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium font-mono uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                    >
                                      {sub}
                                    </span>
                                  ))}
                                  {subCount > 4 && (
                                    <span className="text-[10px] font-semibold text-primary">
                                      +{subCount - 4} alias
                                    </span>
                                  )}
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setEditingMerchant(merchant)}
                                  className="text-[11px] text-text-tertiary hover:text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Tambah sub-merchant / singkatan API</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center justify-end gap-1 sm:gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => setEditingMerchant(merchant)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                            title="Edit merchant dan sub-merchant"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMovingMerchant(merchant)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                            title="Pindahkan ke kategori lain"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Pindah</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMerchant(merchant)}
                            className="p-1.5 rounded-xl text-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                            title="Hapus merchant dari kategori ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </LazyItem>
                  );
                })}

                {/* Sentinel Loader */}
                {hasMore && (
                  <div
                    ref={sentinelRef}
                    className="py-4 flex items-center justify-center gap-2 text-xs text-text-tertiary"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Memuat lebih banyak merchant...</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Real-time Merchant Matching Simulator */}
        <div className="rounded-2xl sm:rounded-3xl border border-border-subtle bg-surface shadow-ds-xs p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h4 className="text-xs sm:text-sm font-bold text-text-primary">
              Simulator Pengenalan Kategori & Sub-Merchant API
            </h4>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Uji coba string nama transaksi dari respon API gateway (misal: <code>MCD Drive Thru</code>, <code>Mekdi</code>, <code>HHB</code>, atau <code>Hk Hk Bnt</code>) untuk memastikan pemetaan otomatis berjalan akurat secara <strong>case-insensitive</strong>.
          </p>

          {/* Quick preset chips to test */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-text-tertiary mr-1">Contoh cepat:</span>
            {quickTestCases.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTestQuery(sample)}
                className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-surface-secondary text-text-secondary hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border border-border-subtle"
              >
                {sample}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Ketik nama transaksi API mentah, misal: MCD, HHB, Mekdi, Alfa Midi..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-border bg-surface-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            />
            {testQuery && (
              <button
                type="button"
                onClick={() => setTestQuery("")}
                className="px-3.5 py-2 text-xs rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text-secondary cursor-pointer shadow-ds-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Simulator Result Output */}
          {testQuery.trim() && (
            <div className="p-4 rounded-2xl border text-xs bg-gray-50 dark:bg-gray-850 border-gray-200 dark:border-gray-800 animate-in fade-in duration-150 space-y-2.5">
              {testResult?.category && testResult.merchant ? (
                <>
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-200/60 dark:border-gray-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <MerchantLogo
                        name={testResult.merchant.name}
                        logoUrl={testResult.merchant.logoUrl}
                        logoDarkUrl={testResult.merchant.logoDarkUrl}
                        size="md"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-gray-900 dark:text-white block truncate">
                          {testResult.merchant.name}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs block">
                          Kategori: <strong>{testResult.category.name}</strong>
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Berhasil Dipetakan
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-600 dark:text-gray-300 space-y-1">
                    {testResult.matchedBy === "sub_merchant" ? (
                      <p className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          Dikenali melalui alias sub-merchant: <strong className="font-mono bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded">&quot;{testResult.matchedSubMerchant}&quot;</strong> (Case-insensitive)
                        </span>
                      </p>
                    ) : (
                      <p className="text-emerald-700 dark:text-emerald-300">
                        Dikenali langsung dari nama merchant induk: <strong>&quot;{testResult.exactMatch}&quot;</strong>
                      </p>
                    )}
                    <p className="text-gray-500 dark:text-gray-400">
                      Hasil di transaksi website: Gambar logo dan nama merchant akan tertulis rapi sebagai <strong>{testResult.merchant.name}</strong> di bawah kategori <strong>{testResult.category.name}</strong>.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white block">
                      Belum Dikenali (Akan masuk kategori &quot;Lainnya&quot;)
                    </span>
                    <span className="text-gray-500 text-[11px]">
                      Tambahkan teks &quot;{testQuery}&quot; sebagai sub-merchant / alias di salah satu merchant di atas agar otomatis terpetakan.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Merchant Modal */}
      {editingMerchant && (
        <EditMerchantModal
          isOpen={true}
          onClose={() => setEditingMerchant(null)}
          merchant={editingMerchant}
          category={activeCategory}
          onSave={handleSaveEditMerchant}
        />
      )}

      {/* Move Merchant Modal */}
      {movingMerchant && (
        <MoveMerchantModal
          isOpen={true}
          onClose={() => setMovingMerchant(null)}
          merchant={movingMerchant}
          currentCategory={activeCategory}
        />
      )}
    </div>
  );
};

export default RightSidebarContent;
