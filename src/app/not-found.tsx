import Link from "next/link";
import React from "react";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-background text-text-primary">
      <div className="mx-auto w-full max-w-md text-center flex flex-col items-center">
        {/* Visual Icon Badge */}
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-secondary border border-border shadow-ds-sm mb-6 text-primary">
          <FileQuestion className="h-10 w-10 text-primary" strokeWidth={1.8} />
        </div>

        {/* Status Code */}
        <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 mb-3 tracking-wide">
          ERROR 404
        </span>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-2">
          Halaman Tidak Ditemukan
        </h1>

        {/* Description */}
        <p className="text-sm text-text-secondary mb-8 max-w-sm">
          Alamat atau tautan yang Anda tuju tidak tersedia atau telah dipindahkan ke navigasi yang baru.
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/card"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-text-inverse hover:opacity-90 shadow-ds-sm transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Home className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-surface-secondary shadow-ds-xs transition-colors focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Ke Halaman Login
          </Link>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="absolute bottom-6 inset-x-0 text-center">
        <p className="text-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} Sakuin. Dashboard Kartu & Merchant
        </p>
      </footer>
    </div>
  );
}
