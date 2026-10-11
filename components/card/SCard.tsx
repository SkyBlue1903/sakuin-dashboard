"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Snowflake, Copy, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "relative w-full aspect-[1.586/1] rounded-3xl p-6 sm:p-7 md:p-8 shadow-2xl transition-all duration-300 select-none",
        isFrozen && "saturate-[0.35] brightness-95",
        className
      )}
      style={{
        boxShadow: isFrozen
          ? "0 10px 30px -10px rgba(0, 0, 0, 0.4)"
          : "0 20px 40px -12px rgba(0, 0, 0, 0.5), 0 6px 16px -4px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Background Image — wrapped in overflow-hidden so image is clipped to rounded corners
           while the outer div stays overflow-visible to let shadow spread */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <Image
          src="/images/Design-Kartu.png"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center select-none"
          priority
          aria-hidden
        />
        {/* Subtle dark overlay for depth */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Frozen Overlay */}
      {isFrozen && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[3px] text-white transition-all">
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
        {/* Top Header: Brand Name + Virtual Badge */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase leading-none block">
              
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-white backdrop-blur-xs">
            VIRTUAL
          </div>
        </div>

        {/* Middle Section: Subtle Contactless Waves Icon */}
        <div className="my-auto py-1">
          <div className="flex items-center gap-2 opacity-40">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8.5 16.5a5 5 0 0 1 0-9" strokeLinecap="round" />
              <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
              <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Bottom Section: Saldo & Masked Card Number + VISA Platinum */}
        <div className="flex items-end justify-between">
          {/* Left: Saldo (tepat di atas nomor kartu) & Nomor Kartu */}
          <div className="flex flex-col">
            {/* Saldo Kartu */}
            <div className="mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider block leading-none">
                Saldo Kartu
              </span>
              <div className="flex items-center gap-2 mt-1">
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
                  className="rounded-full p-1 text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  {showBalance ? (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Nomor Kartu: Selalu **** xxxx (tidak ditampilkan lengkap saat lihat detail) */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm sm:text-base md:text-lg font-bold tracking-widest text-white">
                {maskedNumber}
              </span>
            </div>
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
