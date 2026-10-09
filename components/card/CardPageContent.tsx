"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  TrendingDown,
  AlertCircle,
  Sparkles,
  Lock,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
} from "lucide-react";
import SCard from "@/components/card/SCard";
import CardActions from "@/components/card/CardActions";
import CardTransactions from "@/components/card/CardTransactions";
import CardSettingsModal from "@/components/card/CardSettingsModal";
import TopUpModal from "@/components/card/TopUpModal";
import ChangePinModal from "@/components/card/ChangePinModal";
import DeleteCardModal from "@/components/card/DeleteCardModal";
import EditCardNameModal from "@/components/card/EditCardNameModal";
import AddCardModal from "@/components/card/AddCardModal";
import VerifyPinModal from "@/components/card/VerifyPinModal";
import NoticeBanner from "@/components/card/NoticeBanner";
import { cn } from "@/utils";

const INITIAL_CARDS = [
  {
    id: 1,
    name: "SakuCard 1",
    number: "4532 8821 9012 1995",
    last4: "1995",
    holder: "ERLANGGA A. ARIFIN",
    exp: "08/29",
    cvv: "832",
    balance: 2450000,
    pin: "111111",
  },
  {
    id: 2,
    name: "SakuCard 2",
    number: "4111 2233 4455 8820",
    last4: "8820",
    holder: "ERLANGGA A. ARIFIN",
    exp: "12/28",
    cvv: "419",
    balance: 850000,
    pin: "111111",
  },
  {
    id: 3,
    name: "SakuCard 3",
    number: "4716 9901 3342 7704",
    last4: "7704",
    holder: "ERLANGGA A. ARIFIN",
    exp: "05/30",
    cvv: "651",
    balance: 15750000,
    pin: "111111",
  },
];

export const CardPageContent: React.FC = () => {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedCvv, setCopiedCvv] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [isVerifyPinOpen, setIsVerifyPinOpen] = useState(false);
  const [isDeleteCardOpen, setIsDeleteCardOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [showNoticeBanner, setShowNoticeBanner] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastRemoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (toastRemoveTimeoutRef.current) clearTimeout(toastRemoveTimeoutRef.current);
    };
  }, []);

  const currentCard = cards[activeCardIndex] || cards[0];

  const handlePrevCard = () => {
    setShowDetails(false);
    setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
  };

  const handleNextCard = () => {
    setShowDetails(false);
    setActiveCardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
  };

  const handleAddCardSubmit = ({
    name,
    initialDeposit,
  }: {
    name: string;
    initialDeposit: number;
  }) => {
    const nextNum = cards.length + 1;
    const randLast4 = String(Math.floor(1000 + Math.random() * 9000));
    const newCard = {
      id: nextNum,
      name: name.trim() || `SakuCard ${nextNum}`,
      number: `4532 8821 9012 ${randLast4}`,
      last4: randLast4,
      holder: "ERLANGGA A. ARIFIN",
      exp: "09/31",
      cvv: String(Math.floor(100 + Math.random() * 900)),
      balance: initialDeposit,
      pin: "111111",
    };
    setCards((prev) => [...prev, newCard]);
    setActiveCardIndex(cards.length);
    if (initialDeposit > 0) {
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(initialDeposit);
      showToast(
        `Kartu "${newCard.name}" berhasil dibuat dengan saldo awal ${formatted}!`
      );
    } else {
      showToast(`Kartu "${newCard.name}" berhasil ditambahkan!`);
    }
  };

  const handleSaveCardName = (newName: string) => {
    setCards((prev) =>
      prev.map((c, idx) =>
        idx === activeCardIndex ? { ...c, name: newName } : c
      )
    );
    showToast(`Nama kartu berhasil diubah menjadi "${newName}"`);
  };

  const handleDeleteCard = () => {
    if (cards.length <= 1) {
      const resetCard = {
        id: 1,
        name: "SakuCard 1",
        number: "4532 8821 9012 1995",
        last4: "1995",
        holder: "ERLANGGA A. ARIFIN",
        exp: "08/29",
        cvv: "832",
        balance: 2450000,
        pin: "111111",
      };
      setCards([resetCard]);
      setActiveCardIndex(0);
      showToast("Kartu berhasil direset ke pengaturan awal.");
      return;
    }
    const cardNameToDelete = currentCard.name;
    const newCards = cards.filter((_, idx) => idx !== activeCardIndex);
    setCards(newCards);
    setActiveCardIndex((prev) => (prev >= newCards.length ? newCards.length - 1 : prev));
    showToast(`${cardNameToDelete} berhasil dihapus.`);
  };

  const handleTopUpSuccess = (amountFormatted: string, numericAmount: number) => {
    setCards((prev) =>
      prev.map((c, idx) =>
        idx === activeCardIndex
          ? { ...c, balance: (c.balance || 0) + numericAmount }
          : c
      )
    );
    showToast(`Top Up ${amountFormatted} ke ${currentCard.name} berhasil!`);
  };

  const handleChangePinSuccess = (newPin?: string) => {
    if (newPin) {
      setCards((prev) =>
        prev.map((c, idx) =>
          idx === activeCardIndex ? { ...c, pin: newPin } : c
        )
      );
    }
    showToast(`PIN ${currentCard.name} berhasil diperbarui!`);
  };

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText(currentCard.number.replace(/\s+/g, ""));
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleCopyCvv = () => {
    navigator.clipboard.writeText(currentCard.cvv);
    setCopiedCvv(true);
    setTimeout(() => setCopiedCvv(false), 2000);
  };

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (toastRemoveTimeoutRef.current) clearTimeout(toastRemoveTimeoutRef.current);

    setToastMessage(msg);
    requestAnimationFrame(() => {
      setIsToastVisible(true);
    });

    toastTimeoutRef.current = setTimeout(() => {
      setIsToastVisible(false);
      toastRemoveTimeoutRef.current = setTimeout(() => {
        setToastMessage(null);
      }, 350);
    }, 2800);
  };

  const handleToggleFreeze = () => {
    const nextState = !isFrozen;
    setIsFrozen(nextState);
    showToast(
      nextState
        ? `${currentCard.name} telah berhasil dibekukan untuk keamanan.`
        : `${currentCard.name} telah diaktifkan kembali.`
    );
  };

  const handleToggleDetails = () => {
    if (showDetails) {
      setShowDetails(false);
    } else {
      setIsVerifyPinOpen(true);
    }
  };

  const handleVerifyPinSuccess = () => {
    setShowDetails(true);
    showToast(`Detail ${currentCard.name} berhasil ditampilkan.`);
  };

  return (
    <div className="w-full h-full overflow-y-auto md:overflow-hidden custom-scrollbar overscroll-contain pt-20 pb-8 md:pt-0 md:pb-0">
      {/* Toast Notification with Fluid In & Out Animation */}
      {toastMessage && (
        <div
          className={cn(
            "fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out transform pointer-events-auto",
            isToastVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-2 rounded-2xl bg-gray-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-gray-900 px-4 py-2.5 text-xs sm:text-sm font-medium shadow-2xl border border-white/10 dark:border-black/10">
            <Sparkles className="h-4 w-4 text-brand-400 dark:text-brand-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Responsive Grid Layout:
          - Mobile (screen < md): stacked single column
          - Tablet / Laptop / Desktop (screen >= md): 2 columns
            Left: Sidebar Kartu (independent scroll & bouncy overscroll)
            Right: Daftar Transaksi (independent scroll & bouncy overscroll)
      */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start w-full max-w-[500px] md:max-w-none mx-auto md:h-full md:overflow-hidden">
        {/* Left Column: Sidebar Kartu (Passes underneath glass header on scroll) */}
        <div className="md:col-span-5 lg:col-span-5 w-full md:h-full md:overflow-y-auto custom-scrollbar overscroll-contain md:pr-2.5 pt-4 md:pt-0 pb-10">
          {/* Spacer below AppHeader so initial content starts cleanly below header when not scrolled */}
          <div className="hidden md:block h-16 shrink-0 pointer-events-none" />

          {/* Sticky Header Bar: Tombol Pindah Kartu (< >) & Tambah Kartu di Baris 1, Judul & Subtitle di Baris 2 */}
          <div
            className={cn(
              "sticky top-16 z-20",
              "-mx-1 sm:-mx-2 px-2.5 sm:px-3.5 pt-2.5 pb-3.5",
              "space-y-2.5",
              "bg-gray-50 dark:bg-gray-950",
              "border-b border-gray-200/80 dark:border-gray-800/80 shadow-xs",
              "transition-all"
            )}
          >
            {/* Baris 1: < Kartu 1 dari 3 > {jarak selebar sidebar} <Tambah kartu */}
            <div className="flex items-center justify-between w-full gap-3">
              {/* < Kartu 1 dari 3 > */}
              <div className="flex h-9 items-center gap-1 px-1 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-full shadow-2xs">
                <button
                  type="button"
                  onClick={handlePrevCard}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 active:scale-95 transition-all cursor-pointer"
                  title="Kartu sebelumnya"
                  aria-label="Kartu sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-semibold text-gray-800 dark:text-gray-200 select-none whitespace-nowrap">
                  Kartu {activeCardIndex + 1} dari {cards.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextCard}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 active:scale-95 transition-all cursor-pointer"
                  title="Kartu berikutnya"
                  aria-label="Kartu berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Jarak selebar sidebar */}
              <div className="flex-1" />

              {/* <Tambah kartu */}
              <button
                type="button"
                onClick={() => setIsAddCardOpen(true)}
                className="flex h-9 items-center gap-1.5 px-4 rounded-full border border-gray-200/80 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 shadow-2xs dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-brand-500" />
                <span>Tambah kartu</span>
              </button>
            </div>

            {/* Baris 2: SakuCard 1 <aktif/dibekukan> */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {currentCard.name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide",
                  isFrozen
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isFrozen ? "bg-amber-500" : "bg-emerald-500 animate-pulse"
                  )}
                />
                {isFrozen ? "Dibekukan" : "Aktif"}
              </span>
            </div>
          </div>

          {/* Left Column Content (Scrolls underneath sticky header) */}
          <div className="space-y-5 pt-3 w-full">
            {/* Card Presentation */}
            <div className="w-full">
              <SCard
                isFrozen={isFrozen}
                showDetails={showDetails}
                onToggleFreeze={handleToggleFreeze}
                onToggleDetails={handleToggleDetails}
                cardNumber={currentCard.number}
                maskedNumber={`**** ${currentCard.last4}`}
                cardHolder={currentCard.holder}
                expiryDate={currentCard.exp}
                cvv={currentCard.cvv}
                balance={currentCard.balance}
                className="w-full"
              />
            </div>

            {/* Action Buttons: Row 1 (Top Up), Row 2 (Detail, Pengaturan) */}
            <CardActions
              isFrozen={isFrozen}
              showDetails={showDetails}
              onToggleFreeze={handleToggleFreeze}
              onToggleDetails={handleToggleDetails}
              onOpenTopUp={() => setIsTopUpOpen(true)}
              onOpenLimitSettings={() => setIsSettingsOpen(true)}
              onOpenChangePin={() => setIsChangePinOpen(true)}
              onOpenDeleteCard={() => setIsDeleteCardOpen(true)}
              onOpenEditCardName={() => setIsEditNameOpen(true)}
              cardName={currentCard.name}
              cardLast4={currentCard.last4}
              className="w-full"
            />

            {/* Detail Kartu SakuCard Panel */}
            <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4 w-full">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Detail Kartu SakuCard
                </span>
                <button
                  type="button"
                  onClick={handleToggleDetails}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {showDetails ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lihat Detail Kartu</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-400 text-xs block">Nomor Kartu</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-semibold text-gray-900 dark:text-white">
                      {showDetails ? currentCard.number : `**** ${currentCard.last4}`}
                    </span>
                    {showDetails && (
                      <button
                        type="button"
                        onClick={handleCopyCardNumber}
                        title="Salin nomor kartu"
                        className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                      >
                        {copiedNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Nama Pemegang Kartu</span>
                  <span className="font-semibold text-gray-900 dark:text-white block mt-0.5 truncate">
                    {currentCard.holder}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Masa Berlaku</span>
                  <span className="font-mono font-semibold text-gray-900 dark:text-white block mt-0.5">
                    {showDetails ? currentCard.exp : "**/**"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">CVV</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-semibold text-gray-900 dark:text-white">
                      {showDetails ? currentCard.cvv : "***"}
                    </span>
                    {showDetails && (
                      <button
                        type="button"
                        onClick={handleCopyCvv}
                        title="Salin CVV"
                        className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                      >
                        {copiedCvv ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Limit Bar */}
              {/* <div className="pt-2">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500 dark:text-gray-400">Batas Penggunaan Bulan Ini</span>
                  <span className="font-semibold text-gray-900 dark:text-white">$88.78 / $500.00</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: "17.7%" }}
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right Column: Daftar Transaksi & Metrik (Passes underneath glass header on scroll) */}
        <div className="md:col-span-7 lg:col-span-7 w-full max-w-[500px] md:max-w-none mx-auto md:h-full md:overflow-y-auto custom-scrollbar overscroll-contain md:pr-1.5 pt-4 md:pt-0 pb-10">
          {/* Spacer below AppHeader so initial content starts cleanly below header when not scrolled */}
          <div className="hidden md:block h-16 shrink-0 pointer-events-none" />

          <div className="space-y-6">
            {/* Quick Metrics (GUNAKAN BILA PERLU!) */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                  Total Tagihan Ditolak
                </span>
                <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-1">
                  -$176.27 USD
                </div>
                <span className="text-[11px] text-error-600 dark:text-error-400 mt-1 block">
                  4 Transaksi Declined
                </span>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                  Sisa Limit Harian
                </span>
                <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-1">
                  $411.22 USD
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                  Aman digunakan
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                  Keamanan 3D Secure
                </span>
                <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  Aktif
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  OTP Otomatis
                </span>
              </div>
            </div> */}

            {/* Notice Banner (Papan Peringatan) diletakkan di atas "Transaksi Kartu" */}
            {showNoticeBanner && (
              <div className="pt-2">
                <NoticeBanner
                  variant="danger"
                  title="Pemberitahuan"
                  message="Untuk mengganti tipe papan, silakan ganti bagian `variant` pada komponen NoticeBanner, terdapat beberapa opsi seperti: `danger`, `warning`, dan `info`."
                  onDismiss={() => setShowNoticeBanner(false)}
                />
              </div>
            )}

            {/* "Transaksi kartu" Section */}
            <CardTransactions />
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        cardName={currentCard.name}
        cardLast4={currentCard.last4}
        onSuccess={handleTopUpSuccess}
      />

      {/* Verify PIN Modal (Wajib Input PIN untuk Lihat Detail Kartu) */}
      <VerifyPinModal
        isOpen={isVerifyPinOpen}
        onClose={() => setIsVerifyPinOpen(false)}
        cardName={currentCard.name}
        cardLast4={currentCard.last4}
        correctPin={currentCard.pin || "111111"}
        onSuccess={handleVerifyPinSuccess}
        onForgotPin={() => setIsChangePinOpen(true)}
      />

      {/* Change PIN Modal */}
      <ChangePinModal
        isOpen={isChangePinOpen}
        onClose={() => setIsChangePinOpen(false)}
        cardName={currentCard.name}
        cardLast4={currentCard.last4}
        currentPin={currentCard.pin || "111111"}
        onSuccess={handleChangePinSuccess}
      />

      {/* Delete Card Confirmation Modal */}
      <DeleteCardModal
        isOpen={isDeleteCardOpen}
        onClose={() => setIsDeleteCardOpen(false)}
        cardName={currentCard.name}
        cardLast4={currentCard.last4}
        totalCards={cards.length}
        onConfirmDelete={handleDeleteCard}
      />

      {/* Edit Card Name Modal */}
      <EditCardNameModal
        isOpen={isEditNameOpen}
        onClose={() => setIsEditNameOpen(false)}
        currentName={currentCard.name}
        cardLast4={currentCard.last4}
        onSave={handleSaveCardName}
      />

      {/* Add Card Modal with Custom Name & Simultaneous Top Up */}
      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        defaultCardNumber={cards.length + 1}
        onAddCard={handleAddCardSubmit}
      />

      {/* Settings (Limits & Permissions) Modal */}
      <CardSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isFrozen={isFrozen}
        onToggleFreeze={handleToggleFreeze}
      />
    </div>
  );
};

export default CardPageContent;
