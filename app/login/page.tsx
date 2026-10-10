"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { cn } from "@/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("erlangga@sakuin.id");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Silakan masukkan email dan kata sandi Anda.");
      return;
    }

    setIsLoading(true);

    // Simulate authenticating and redirect to /card
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/card");
      }, 700);
    }, 1100);
  };

  const handleQuickDemoLogin = () => {
    setEmail("erlangga@sakuin.id");
    setPassword("password123");
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/card");
      }, 600);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-tr from-brand-500/20 via-blue-500/15 to-purple-500/10 blur-[130px] dark:from-brand-600/25 dark:via-purple-600/15 dark:to-transparent" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-yellow-400/10 blur-[110px] dark:bg-yellow-400/5" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-500/10 blur-[120px] dark:bg-brand-500/10" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-20 flex w-full items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="/card" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-md shadow-brand-500/25 transition-transform group-hover:scale-105">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              Sakuin
            </span>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase mt-0.5">
              Card Dashboard
            </span>
          </div>
        </Link>

        {/* Right Tools: Theme Switcher & Help */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-300">
          {/* Card Container */}
          <div className="rounded-3xl border border-gray-200/80 bg-white/85 p-7 sm:p-9 shadow-xl shadow-gray-200/40 backdrop-blur-2xl dark:border-gray-800 dark:bg-gray-900/85 dark:shadow-black/50 transition-all">
            {/* Header */}
            <div className="text-center space-y-2 mb-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/60 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Portal Akses Kartu Sakuin</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Selamat Datang
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Masuk untuk mengelola kartu virtual Visa S-Card dan riwayat transaksi Anda.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-error-200 bg-error-50/80 p-3 text-xs text-error-700 dark:border-error-900/50 dark:bg-error-950/40 dark:text-error-300 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-error-600 dark:text-error-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Email atau ID Pengguna
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@sakuin.id"
                    disabled={isLoading || isSuccess}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white/70 py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 shadow-2xs transition-colors focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/70 dark:text-white dark:placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Untuk mode demo, gunakan kata sandi default atau klik 'Masuk Demo 1-Klik'.")}
                    className="text-[11px] font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 cursor-pointer"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading || isSuccess}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white/70 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-gray-900 placeholder-gray-400 shadow-2xs transition-colors focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/70 dark:text-white dark:placeholder-gray-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Options: Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-md border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Ingat sesi saya
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-[0.99] mt-2",
                  isSuccess
                    ? "bg-emerald-600 text-white shadow-emerald-500/25"
                    : "bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/25",
                  (isLoading || isSuccess) && "opacity-95"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memverifikasi akun...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 animate-bounce" />
                    <span>Login Berhasil! Mengalihkan ke /card...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/80 dark:border-gray-800" />
              </div>
              <span className="relative bg-white dark:bg-gray-900 px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Atau Akses Cepat
              </span>
            </div>

            {/* Quick Demo Login Button */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading || isSuccess}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-gray-200/80 bg-gray-50/70 hover:bg-gray-100/80 dark:border-gray-800 dark:bg-gray-800/60 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-2xs active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="h-5 w-5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center text-[10px] font-bold">
                EA
              </div>
              <span>Masuk Demo 1-Klik (Erlangga A. Arifin)</span>
            </button>

            {/* Bank-Grade Security Assurance Footer */}
            {/* <div className="mt-7 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Enkripsi 256-Bit • Dilindungi Visa 3D Secure</span>
            </div> */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center text-xs text-gray-400 dark:text-gray-600">
        <p>© 2026 Sakuin. Seluruh hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}
