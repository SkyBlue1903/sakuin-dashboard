"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Snowflake, Copy, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils";

interface SCardProps {
  isFrozen?: boolean;
  showDetails?: boolean;
  onToggleFreeze?: () => void;
  onToggleDetails?: () => void;
  cardNumber?: string;
  maskedNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  balance?: number | string;
  cardImage?: string;
  className?: string;
}

export const SCard: React.FC<SCardProps> = ({
  isFrozen = false,
  showDetails = false,
  cardNumber = "4532 8821 9012 1995",
  maskedNumber = "**** 1995",
  cardHolder = "ERLANGGA A. ARIFIN",
  expiryDate = "08/29",
  cvv = "832",
  balance = 2450000,
  cardImage = "/images/card/gradient/card.gradient.1.png",
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cardNumber.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedBalance =
    typeof balance === "number"
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(balance)
      : balance;

  return (
    <div
      className={cn(
        "relative w-full aspect-[561/355] p-4 transition-all duration-300 select-none",
        "text-white",
        isFrozen && "saturate-[0.35] brightness-95",
        className
      )}
    >
      {/* Card Background (pre-rounded PNG) */}
      <Image
        src={cardImage}
        alt="SakuCard Background"
        fill
        priority
        className="object-contain pointer-events-none select-none z-0"
      />

      {/* Frozen Overlay */}
      {isFrozen && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[3px] text-white transition-all rounded-[28px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-lg border border-white/30 mb-2 animate-pulse">
            <Snowflake className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase bg-slate-900/70 px-3 py-1 rounded-full border border-white/20">
            Kartu Dibekukan
          </span>
        </div>
      )}

      {/* Card Content Container */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Top Header: Saldo Kartu + Eye + VIRTUAL Badge (Menempel Bersebelahan) */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider block leading-none">
              Saldo Kartu
            </span>
            <div className="flex items-center gap-2 sm:gap-2.5 mt-1 sm:mt-1.5">
              <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white block leading-none">
                {showBalance ? formattedBalance : "Rp ••••••••"}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBalance(!showBalance);
                }}
                title={showBalance ? "Sembunyikan saldo" : "Tampilkan saldo"}
                aria-label={showBalance ? "Sembunyikan saldo" : "Tampilkan saldo"}
                className="rounded-full p-1 text-white/70 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
              >
                {showBalance ? (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              {/* <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10 shrink-0">
                VIRTUAL
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Section: Masked Card Number + VISA Platinum */}
        <div className="flex items-end justify-between">
          {/* Nomor Kartu: Selalu **** xxxx (tidak ditampilkan lengkap saat lihat detail) */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm sm:text-base md:text-lg font-bold tracking-widest text-white/90">
              {maskedNumber}
            </span>
          </div>

          {/* Visa Platinum Brand */}
          <div className="flex flex-col items-end shrink-0">
            {/* Crisp Visa Logotype */}
            <Image
              src="/images/visa.white.png"
              alt="Visa"
              width={75}
              height={24}
              className="h-6 sm:h-7 w-auto object-contain"
            />
            <span className="text-[10px] sm:text-xs font-normal tracking-wide pt-1.5 text-white/80 -mt-0.5">
              Platinum
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCard;
