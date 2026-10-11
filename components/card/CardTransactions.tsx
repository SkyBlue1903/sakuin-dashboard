"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Music,
  Code2,
  Globe,
  Search,
  Filter,
  X,
  ShieldAlert,
  CreditCard,
  Sparkles,
  Film,
  Palette,
  Coffee,
  Gamepad2,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: string;
  currency: string;
  status: "Declined" | "Success" | "Pending";
  iconType:
    | "education"
    | "music"
    | "tech"
    | "cloud"
    | "ai"
    | "streaming"
    | "design"
    | "gaming"
    | "food";
  reason?: string;
  cardLast4: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-001",
    merchant: "coursiv.org",
    category: "Pendidikan & Kursus",
    date: "4 September, 19:44",
    amount: "-689.000",
    currency: "Rp",
    status: "Declined",
    iconType: "education",
    reason: "Batas limit transaksi internasional terlampaui",
    cardLast4: "1995",
  },
  {
    id: "tx-002",
    merchant: "coursiv.org",
    category: "Pendidikan & Kursus",
    date: "4 September, 19:44",
    amount: "-689.000",
    currency: "Rp",
    status: "Declined",
    iconType: "education",
    reason: "Upaya pembayaran ganda terdeteksi oleh sistem keamanan",
    cardLast4: "1995",
  },
  {
    id: "tx-003",
    merchant: "ChatGPT Plus Subscription",
    category: "AI & Produktivitas",
    date: "3 September, 14:10",
    amount: "-315.000",
    currency: "Rp",
    status: "Success",
    iconType: "ai",
    cardLast4: "1995",
  },
  {
    id: "tx-004",
    merchant: "Spotify Premium",
    category: "Hiburan & Musik",
    date: "1 September, 10:15",
    amount: "-54.990",
    currency: "Rp",
    status: "Success",
    iconType: "music",
    cardLast4: "1995",
  },
  {
    id: "tx-005",
    merchant: "GitHub Copilot",
    category: "Alat Pengembang",
    date: "28 Agustus, 08:30",
    amount: "-155.000",
    currency: "Rp",
    status: "Success",
    iconType: "tech",
    cardLast4: "1995",
  },
  {
    id: "tx-006",
    merchant: "Netflix 4K Premium",
    category: "Streaming Film",
    date: "26 Agustus, 21:05",
    amount: "-186.000",
    currency: "Rp",
    status: "Success",
    iconType: "streaming",
    cardLast4: "1995",
  },
  {
    id: "tx-007",
    merchant: "Google Cloud Platform",
    category: "Infrastruktur Server",
    date: "24 Agustus, 14:22",
    amount: "-455.000",
    currency: "Rp",
    status: "Success",
    iconType: "cloud",
    cardLast4: "1995",
  },
  {
    id: "tx-008",
    merchant: "AWS Cloud Services",
    category: "Layanan Cloud",
    date: "20 Agustus, 03:12",
    amount: "-840.000",
    currency: "Rp",
    status: "Success",
    iconType: "cloud",
    cardLast4: "1995",
  },
  {
    id: "tx-009",
    merchant: "Figma Professional",
    category: "Desain UI/UX",
    date: "18 Agustus, 11:45",
    amount: "-235.000",
    currency: "Rp",
    status: "Success",
    iconType: "design",
    cardLast4: "1995",
  },
  {
    id: "tx-010",
    merchant: "Steam Games Store",
    category: "Game & Hiburan",
    date: "15 Agustus, 19:30",
    amount: "-500.000",
    currency: "Rp",
    status: "Declined",
    iconType: "gaming",
    reason: "Limit transaksi game harian telah melebihi batas yang ditentukan",
    cardLast4: "1995",
  },
  {
    id: "tx-011",
    merchant: "Midjourney AI Art",
    category: "AI Generatif",
    date: "12 Agustus, 16:20",
    amount: "-465.000",
    currency: "Rp",
    status: "Success",
    iconType: "ai",
    cardLast4: "1995",
  },
  {
    id: "tx-012",
    merchant: "Starbucks Coffee Reserv.",
    category: "Makanan & Minuman",
    date: "10 Agustus, 09:15",
    amount: "-135.000",
    currency: "Rp",
    status: "Success",
    iconType: "food",
    cardLast4: "1995",
  },
  {
    id: "tx-013",
    merchant: "Adobe Creative Cloud",
    category: "Software Desain",
    date: "5 Agustus, 13:00",
    amount: "-850.000",
    currency: "Rp",
    status: "Declined",
    iconType: "design",
    reason: "Pembayaran luar negeri memerlukan verifikasi OTP manual",
    cardLast4: "1995",
  },
  {
    id: "tx-014",
    merchant: "Apple Services / iCloud",
    category: "Penyimpanan Cloud",
    date: "1 Agustus, 07:00",
    amount: "-45.000",
    currency: "Rp",
    status: "Success",
    iconType: "cloud",
    cardLast4: "1995",
  },
  {
    id: "tx-015",
    merchant: "Vercel Pro Team",
    category: "Deployment Web",
    date: "28 Juli, 18:20",
    amount: "-310.000",
    currency: "Rp",
    status: "Success",
    iconType: "tech",
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

interface CardTransactionsProps {
  className?: string;
}

export const CardTransactions: React.FC<CardTransactionsProps> = ({
  className,
}) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<"all" | "declined" | "success">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const totalDeclined = INITIAL_TRANSACTIONS.filter((t) => t.status === "Declined").length;
  const totalSuccess = INITIAL_TRANSACTIONS.filter((t) => t.status === "Success").length;

  const filteredTransactions = INITIAL_TRANSACTIONS.filter((tx) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "declined"
        ? tx.status === "Declined"
        : tx.status === "Success";

    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getTransactionIcon = (type: Transaction["iconType"]) => {
    switch (type) {
      case "education":
        return <GraduationCap className="h-5 w-5 text-gray-800 dark:text-gray-200" strokeWidth={1.75} />;
      case "music":
        return <Music className="h-5 w-5 text-gray-800 dark:text-gray-200" strokeWidth={1.75} />;
      case "tech":
        return <Code2 className="h-5 w-5 text-gray-800 dark:text-gray-200" strokeWidth={1.75} />;
      case "cloud":
        return <Cloud className="h-5 w-5 text-gray-800 dark:text-gray-200" strokeWidth={1.75} />;
      case "ai":
        return <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" strokeWidth={1.75} />;
      case "streaming":
        return <Film className="h-5 w-5 text-rose-600 dark:text-rose-400" strokeWidth={1.75} />;
      case "design":
        return <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />;
      case "gaming":
        return <Gamepad2 className="h-5 w-5 text-warning-600 dark:text-warning-400" strokeWidth={1.75} />;
      case "food":
        return <Coffee className="h-5 w-5 text-success-600 dark:text-success-400" strokeWidth={1.75} />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-800 dark:text-gray-200" strokeWidth={1.75} />;
    }
  };

  return (
    <div className={cn("space-y-3.5", className)}>
      {/* Section Header (Sticky Pinned Header - Pepet ke Atas: Title + Filters + Search Bar) */}
      <div
        className={cn(
          "sticky top-16 z-20",
          "-mx-1 sm:-mx-2 px-2.5 sm:px-3.5 pt-2 pb-3.5",
          "space-y-3",
          "bg-gray-50 dark:bg-gray-950",
          "border-b border-gray-200/80 dark:border-gray-800/80 shadow-xs",
          "transition-all"
        )}
      >
        {/* Row 1: Title & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Transaksi Kartu
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {filteredTransactions.length} dari {INITIAL_TRANSACTIONS.length} transaksi ditampilkan
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 self-start sm:self-auto bg-gray-100/90 dark:bg-gray-800/90 p-1 rounded-xl text-xs backdrop-blur-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer",
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
                "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer",
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
                "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer",
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
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi, merchant, atau kategori..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 text-gray-800 dark:text-white placeholder-gray-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Main Transactions Container */}
      <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 p-2 sm:p-4">
        {/* Transaction List (Natural flow without nested scrollbar) */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              Tidak ada transaksi yang cocok dengan pencarian atau filter Anda.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="group flex items-center justify-between p-3 sm:p-3.5 rounded-2xl hover:bg-gray-50/80 dark:hover:bg-gray-800/50 cursor-pointer transition-all"
              >
                {/* Left: Icon + Merchant & Category / Date */}
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 transition-transform group-hover:scale-105">
                    {getTransactionIcon(tx.iconType)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                      {tx.merchant}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {tx.category} • {tx.date}
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
            ))
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                {getTransactionIcon(selectedTx.iconType)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedTx.merchant}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedTx.category}
                </p>
              </div>
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
};

export default CardTransactions;
