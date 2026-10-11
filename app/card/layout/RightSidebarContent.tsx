"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  CreditCard,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/utils";
import CategoryIcon from "@/components/admin/CategoryIcon";
import MerchantLogo from "@/components/admin/MerchantLogo";
import TransactionMerchantAvatar from "@/components/card/TransactionMerchantAvatar";
import {
  useCategory,
  CategoryItem,
  MerchantItem,
} from "@/context/CategoryContext";
import { Modal } from "@/components/ui/modal";
import { useTransactions } from "@/hooks/useTransactions";

export interface Transaction {
  id: string;
  merchant: string;
  categoryId?: string;
  category: string;
  date: string;
  amount: string;
  currency: string;
  status: "Declined" | "Success" | "Pending";
  reason?: string;
  cardLast4: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-001",
    merchant: "coursiv.org",
    categoryId: "7",
    category: "Pendidikan & Kursus",
    date: "4 September, 19:44",
    amount: "-689.000",
    currency: "Rp",
    status: "Declined",
    reason: "Batas limit transaksi internasional terlampaui",
    cardLast4: "1995",
  },
  {
    id: "tx-002",
    merchant: "coursiv.org",
    categoryId: "7",
    category: "Pendidikan & Kursus",
    date: "4 September, 19:44",
    amount: "-689.000",
    currency: "Rp",
    status: "Declined",
    reason: "Upaya pembayaran ganda terdeteksi oleh sistem keamanan",
    cardLast4: "1995",
  },
  {
    id: "tx-003",
    merchant: "ChatGPT Plus Subscription",
    categoryId: "5",
    category: "AI & Produktivitas",
    date: "3 September, 14:10",
    amount: "-315.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-004",
    merchant: "Spotify Premium",
    categoryId: "6",
    category: "Hiburan & Musik",
    date: "1 September, 10:15",
    amount: "-54.990",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-005",
    merchant: "GitHub Copilot",
    categoryId: "4",
    category: "Alat Pengembang & IT",
    date: "28 Agustus, 08:30",
    amount: "-155.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-006",
    merchant: "Netflix",
    categoryId: "6",
    category: "Hiburan & Musik",
    date: "26 Agustus, 21:05",
    amount: "-186.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-007",
    merchant: "Tokopedia",
    categoryId: "1",
    category: "Belanja & Retail",
    date: "24 Agustus, 16:30",
    amount: "-425.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-008",
    merchant: "AWS Cloud",
    categoryId: "4",
    category: "Alat Pengembang & IT",
    date: "20 Agustus, 03:12",
    amount: "-840.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-009",
    merchant: "Figma Professional",
    categoryId: "5",
    category: "AI & Produktivitas",
    date: "18 Agustus, 11:45",
    amount: "-235.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-010",
    merchant: "Steam Games",
    categoryId: "6",
    category: "Hiburan & Musik",
    date: "15 Agustus, 19:30",
    amount: "-500.000",
    currency: "Rp",
    status: "Declined",
    reason: "Limit transaksi game harian telah melebihi batas yang ditentukan",
    cardLast4: "1995",
  },
  {
    id: "tx-011",
    merchant: "Midjourney",
    categoryId: "5",
    category: "AI & Produktivitas",
    date: "12 Agustus, 16:20",
    amount: "-465.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-012",
    merchant: "Starbucks Coffee",
    categoryId: "2",
    category: "Makanan & Minuman",
    date: "10 Agustus, 09:15",
    amount: "-135.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-013",
    merchant: "Pertamina",
    categoryId: "3",
    category: "Transportasi & Bensin",
    date: "8 Agustus, 17:40",
    amount: "-350.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-014",
    merchant: "PLN Pascabayar",
    categoryId: "8",
    category: "Tagihan & Utilitas",
    date: "5 Agustus, 10:00",
    amount: "-485.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-015",
    merchant: "Halodoc",
    categoryId: "9",
    category: "Kesehatan & Farmasi",
    date: "3 Agustus, 14:15",
    amount: "-180.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-016",
    merchant: "McDonald's",
    categoryId: "2",
    category: "Makanan & Minuman",
    date: "1 Agustus, 12:30",
    amount: "-115.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-017",
    merchant: "Vercel Pro Team",
    categoryId: "4",
    category: "Alat Pengembang & IT",
    date: "28 Juli, 18:20",
    amount: "-310.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-018",
    merchant: "Alfamart",
    categoryId: "1",
    category: "Belanja & Retail",
    date: "25 Juli, 20:10",
    amount: "-78.500",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-019",
    merchant: "Warung Kopi Senja",
    categoryId: "2",
    category: "Makanan & Minuman",
    date: "24 Juli, 15:45",
    amount: "-32.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
  {
    id: "tx-020",
    merchant: "Toko Kelontong Berkah",
    categoryId: "unknown",
    category: "Lain-lain",
    date: "22 Juli, 11:20",
    amount: "-45.000",
    currency: "Rp",
    status: "Success",
    cardLast4: "1995",
  },
];

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

  const selectedInfo = selectedTx ? getTransactionInfo(selectedTx) : null;

  return (
    <div className={cn("space-y-3.5", className)}>
      {/* Section Header (Sticky Pinned Header - Pepet ke Atas: Title + Filters + Search Bar) */}
      <div
        className={cn(
          "sticky top-16 md:top-0 z-20",
          "w-full pt-2 pb-3.5",
          "space-y-3",
          "bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur-md",
          "border-b border-gray-200/80 dark:border-gray-800/80 shadow-xs",
          "transition-all"
        )}
      >
        {/* Row 1: Title & Filter Tabs */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 w-full lg:max-w-none mx-auto px-4 sm:pr-6 lg:pr-8 xl:pr-10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Transaksi Kartu
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {filteredTransactions.length} dari {INITIAL_TRANSACTIONS.length} transaksi ditampilkan
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 self-start xl:self-auto bg-gray-100/90 dark:bg-gray-800/90 p-1 rounded-xl text-xs backdrop-blur-xs shrink-0 max-w-full overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                filter === "all"
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              Semua ({INITIAL_TRANSACTIONS.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("declined")}
              className={cn(
                "px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap",
                filter === "declined"
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              Berhasil ({totalSuccess})
            </button>
          </div>
        </div>

        {/* Row 2: Search Input (Ikut sticky di atas) */}
        <div className="w-full lg:max-w-none mx-auto px-4 sm:pr-6 lg:pr-8 xl:pr-10">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi, merchant, atau kategori..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 text-gray-800 dark:text-white placeholder-gray-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-brand-500 "
            />
          </div>
        </div>
      </div>

      {/* Main Transactions Container */}
      <div className="w-full lg:max-w-none mx-auto px-4 sm:pr-6 lg:pr-8 xl:pr-10">
        <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-sm
         dark:border-gray-800 dark:bg-gray-900 p-2 sm:p-4">
          {/* Transaction List (Natural flow without nested scrollbar) */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {filteredTransactions.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">
                Tidak ada transaksi yang cocok dengan pencarian atau filter Anda.
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const info = getTransactionInfo(tx);
                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="group flex items-center justify-between p-3 sm:p-3.5 rounded-2xl hover:bg-gray-50/80 dark:hover:bg-gray-800/50 cursor-pointer transition-all"
                  >
                    {/* Left: Merchant Logo / Category Icon / Initial + Merchant & Category / Date */}
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      <TransactionMerchantAvatar
                        merchantName={tx.merchant}
                        logoUrl={info.logoUrl}
                        logoDarkUrl={info.logoDarkUrl}
                        category={info.category}
                        size="lg"
                        className="h-11 w-11 rounded-2xl group-hover:scale-105"
                      />

                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                          {tx.merchant}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                          {info.category ? info.category.name : (tx.category || "Tanpa Kategori")} • {tx.date}
                        </p>
                      </div>
                    </div>

                    {/* Right: Amount + Status Badge */}
                    <div className="text-right shrink-0 pl-3">
                      <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                        {formatAmount(tx.amount, tx.currency)}
                      </div>

                      {tx.status === "Declined" ? (
                        <span className="inline-block mt-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          Ditolak
                        </span>
                      ) : tx.status === "Success" ? (
                        <span className="inline-block mt-1 rounded-full bg-success-50 px-2.5 py-0.5 text-[11px] font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400">
                          Berhasil
                        </span>
                      ) : (
                        <span className="inline-block mt-1 rounded-full bg-warning-50 px-2.5 py-0.5 text-[11px] font-medium text-warning-600 dark:bg-warning-500/10 dark:text-warning-400">
                          Menunggu
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
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
