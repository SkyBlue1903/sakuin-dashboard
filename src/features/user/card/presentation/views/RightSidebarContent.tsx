"use client";

import React, { useState } from "react";
import {
  Search,
  X,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { cn } from "@/shared/utils";
import TransactionMerchantAvatar from "@/features/user/card/presentation/components/TransactionMerchantAvatar";
import LazyItem from "@/shared/presentation/components/ui/LazyItem";
import { useCategory } from "@/features/admin/merchant/presentation/stores/useCategoryStore";
import type { CategoryItem } from "@/features/admin/merchant/domain/category";
import { Modal } from "@/shared/presentation/components/ui/Modal";
import { useTransactions } from "@/features/user/card/presentation/hooks/useTransactions";
import { useResponsiveInfiniteScroll } from "@/shared/hooks/useResponsiveInfiniteScroll";


import { Transaction, INITIAL_TRANSACTIONS } from "@/features/user/card/data/cardService";
export type { Transaction };

export const formatAmount = (amount: string, currency: string = "Rp") => {
  if (currency === "Rp" || currency === "IDR") {
    const isNegative = amount.startsWith("-");
    const cleanAmount = amount.replace(/^[-+]/, "").trim();
    return `${isNegative ? "-" : ""}Rp ${cleanAmount}`;
  }
  return `${amount} ${currency}`;
};

interface RightSidebarContentProps {
  className?: string;
}

export const RightSidebarContent: React.FC<RightSidebarContentProps> = ({
  className,
}) => {
  const { categories, matchMerchant } = useCategory();
  const { data: transactions = INITIAL_TRANSACTIONS } = useTransactions();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<"all" | "declined" | "success">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Helper to resolve category item & merchant details (including logo) for a transaction
  const getTransactionInfo = (tx: Transaction) => {
    // 1. Try matching with CategoryContext matcher
    const match = matchMerchant(tx.merchant);

    // Resolve Category (strictly match by matcher, categoryId, or category name)
    let category: CategoryItem | undefined = match.category || undefined;
    if (!category && tx.categoryId) {
      category = categories.find((c) => c.id === tx.categoryId);
    }
    if (!category && tx.category) {
      category = categories.find(
        (c) => c.name.toLowerCase() === tx.category.toLowerCase()
      );
    }

    // Resolve Logo URL from matched merchant item
    let logoUrl: string | undefined = match.merchant?.logoUrl;
    let logoDarkUrl: string | undefined = match.merchant?.logoDarkUrl;

    // If no logoUrl yet, check if any merchant inside the category matches
    if ((!logoUrl || !logoDarkUrl) && category?.merchants) {
      const q = tx.merchant.toLowerCase().trim();
      const matchedM = category.merchants.find((m) => {
        const mName = m.name.toLowerCase();
        if (mName === q || q.includes(mName) || mName.includes(q)) return true;
        if (
          m.subMerchants?.some((sub) => {
            const subName = sub.toLowerCase();
            return subName === q || q.includes(subName) || subName.includes(q);
          })
        ) {
          return true;
        }
        return false;
      });
      if (matchedM?.logoUrl && !logoUrl) {
        logoUrl = matchedM.logoUrl;
      }
      if (matchedM?.logoDarkUrl && !logoDarkUrl) {
        logoDarkUrl = matchedM.logoDarkUrl;
      }
    }

    return {
      category,
      merchant: match.merchant,
      logoUrl,
      logoDarkUrl,
    };
  };

  const totalDeclined = transactions.filter((t) => t.status === "Declined").length;
  const totalSuccess = transactions.filter((t) => t.status === "Success").length;

  const filteredTransactions = transactions.filter((tx) => {
    const info = getTransactionInfo(tx);
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "declined"
          ? tx.status === "Declined"
          : tx.status === "Success";

    const cleanSearch = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !cleanSearch ||
      tx.merchant.toLowerCase().includes(cleanSearch) ||
      (info.category && info.category.name.toLowerCase().includes(cleanSearch)) ||
      (info.category?.apiCategoryName && info.category.apiCategoryName.toLowerCase().includes(cleanSearch));

    return matchesFilter && matchesSearch;
  });

  // Responsive Infinite Scroll: Batasi render sesuai ukuran layar (viewport-based windowing)
  const {
    visibleCount,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useResponsiveInfiniteScroll({
    totalItems: filteredTransactions.length,
  });

  const visibleTransactions = filteredTransactions.slice(0, visibleCount);

  const selectedInfo = selectedTx ? getTransactionInfo(selectedTx) : null;

  return (
    <div className={cn("space-y-3.5", className)}>
      {/* Section Header (Sticky Pinned Header - Pepet ke Atas: Title + Filters + Search Bar) */}
      <div
        className={cn(
          "sticky top-16 md:top-0 z-20",
          "w-full pt-2 pb-3.5",
          "space-y-3",
          "bg-background/95 backdrop-blur-md",
          "border-b border-border-subtle shadow-ds-sm",
          "transition-all"
        )}
      >
        {/* Row 1: Title & Filter Tabs */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 w-full lg:max-w-none mx-auto px-4 sm:pr-6 lg:pr-8 xl:pr-10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-text-primary">
              Transaksi Kartu
            </h2>
            <p className="text-xs text-text-secondary">
              Menampilkan {visibleTransactions.length} dari {filteredTransactions.length} transaksi
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 self-start xl:self-auto bg-surface-secondary border border-border-subtle p-1 rounded-xl text-xs shrink-0 max-w-full overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                filter === "all"
                  ? "bg-surface text-text-primary font-semibold shadow-ds-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Semua ({transactions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("declined")}
              className={cn(
                "px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                filter === "declined"
                  ? "bg-surface text-text-primary font-semibold shadow-ds-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Ditolak ({totalDeclined})
            </button>
            <button
              type="button"
              onClick={() => setFilter("success")}
              className={cn(
                "px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                filter === "success"
                  ? "bg-surface text-text-primary font-semibold shadow-ds-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Berhasil ({totalSuccess})
            </button>
          </div>
        </div>

        {/* Row 2: Search Input (Ikut sticky di atas) */}
        <div className="w-full lg:max-w-none mx-auto px-4 sm:pr-6 lg:pr-8 xl:pr-10">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi, merchant, atau kategori..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-tertiary shadow-2xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Transactions Container */}
      <div className="w-full lg:max-w-none mx-auto px-4 sm:pr-6 lg:pr-8 xl:pr-10">
        <div className="rounded-2xl border border-border-subtle bg-surface shadow-ds-sm p-2 sm:p-4">
          {/* Transaction List (Lazy Loaded per row with infinite scroll) */}
          <div className="divide-y divide-border-subtle">
            {visibleTransactions.length === 0 ? (
              <div className="py-12 text-center text-sm text-text-tertiary">
                Tidak ada transaksi yang cocok dengan pencarian atau filter Anda.
              </div>
            ) : (
              visibleTransactions.map((tx) => {
                const info = getTransactionInfo(tx);
                return (
                  <LazyItem key={tx.id} placeholderHeight={64}>
                    <div
                      onClick={() => setSelectedTx(tx)}
                      className="group flex items-center justify-between p-3 sm:p-3.5 rounded-xl hover:bg-surface-secondary/70 cursor-pointer transition-all"
                    >
                      {/* Left: Merchant Logo / Category Icon / Initial + Merchant & Category / Date */}
                      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                        <TransactionMerchantAvatar
                          merchantName={tx.merchant}
                          logoUrl={info.logoUrl}
                          logoDarkUrl={info.logoDarkUrl}
                          category={info.category}
                          size="lg"
                          className="h-11 w-11 rounded-xl group-hover:scale-102 transition-transform"
                        />

                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-text-primary truncate">
                            {tx.merchant}
                          </h3>
                          <p className="text-xs text-text-tertiary mt-0.5 truncate">
                            {info.category ? info.category.name : (tx.category || "Tanpa Kategori")} • {tx.date}
                          </p>
                        </div>
                      </div>

                      {/* Right: Amount + Status Badge */}
                      <div className="text-right shrink-0 pl-3">
                        <div className="text-sm sm:text-base font-semibold text-text-primary">
                          {formatAmount(tx.amount, tx.currency)}
                        </div>

                        {tx.status === "Declined" ? (
                          <span className="inline-block mt-1 rounded-full bg-surface-secondary px-2.5 py-0.5 text-[11px] font-medium text-text-secondary border border-border">
                            Ditolak
                          </span>
                        ) : tx.status === "Success" ? (
                          <span className="inline-block mt-1 rounded-full bg-success-bg px-2.5 py-0.5 text-[11px] font-medium text-success border border-success-border">
                            Berhasil
                          </span>
                        ) : (
                          <span className="inline-block mt-1 rounded-full bg-warning-bg px-2.5 py-0.5 text-[11px] font-medium text-warning border border-warning-border">
                            Menunggu
                          </span>
                        )}
                      </div>
                    </div>
                  </LazyItem>
                );
              })
            )}
          </div>

          {/* Infinite Scroll Sentinel Anchor & Loading Indicator */}
          {hasMore && (
            <div
              ref={sentinelRef}
              className="py-4 flex items-center justify-center text-xs text-gray-400 gap-2 border-t border-gray-100/60 dark:border-gray-800/60 mt-1"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                  <span>Memuat transaksi berikutnya...</span>
                </>
              ) : (
                <span className="text-gray-400/80">Gulir ke bawah untuk memuat lebih banyak</span>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Transaction Detail Modal */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        maxWidth="md"
        className="p-6"
      >
        {selectedTx && (
          <>
            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {selectedInfo && (
              <div className="flex items-center gap-3.5 mb-6">
                <TransactionMerchantAvatar
                  merchantName={selectedTx.merchant}
                  logoUrl={selectedInfo.logoUrl}
                  logoDarkUrl={selectedInfo.logoDarkUrl}
                  category={selectedInfo.category}
                  size="xl"
                  className="h-14 w-14 rounded-2xl"
                />
                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {selectedTx.merchant}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedInfo.category ? selectedInfo.category.name : (selectedTx.category || "Tanpa Kategori")}
                    </p>
                    {selectedInfo.category?.apiCategoryName && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                        {selectedInfo.category.apiCategoryName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-4 mb-5 text-center">
              <span className="text-xs uppercase font-medium text-gray-400 tracking-wider">
                Nominal Transaksi
              </span>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                {formatAmount(selectedTx.amount, selectedTx.currency)}
              </div>
              <div className="mt-2">
                {selectedTx.status === "Declined" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-error-50 px-3 py-1 text-xs font-semibold text-error-600 dark:bg-error-500/15 dark:text-error-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Pembayaran Ditolak
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-3 py-1 text-xs font-semibold text-success-600 dark:bg-success-500/15 dark:text-success-400">
                    Pembayaran Berhasil
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Waktu Transaksi</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedTx.date}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Metode Pembayaran</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  S-Card Virtual (**** {selectedTx.cardLast4})
                </span>
              </div>
              {selectedTx.reason && (
                <div className="py-2">
                  <span className="text-gray-500 dark:text-gray-400 block mb-1">
                    Alasan Penolakan:
                  </span>
                  <div className="rounded-xl bg-orange-50 dark:bg-orange-950/20 p-3 text-xs text-orange-700 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/40">
                    {selectedTx.reason}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="mt-6 w-full rounded-2xl bg-gray-900 dark:bg-white py-3 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Tutup
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default RightSidebarContent;
