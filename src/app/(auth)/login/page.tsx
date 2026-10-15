"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import ThemeTogglerTwo from "@/shared/presentation/components/ui/ThemeTogglerTwo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("info@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/card");
    }, 600);
  };

  const handleSocialSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/card");
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-text-primary overflow-x-hidden selection:bg-primary selection:text-text-inverse">
      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left Column: Sign In Form */}
        <div className="flex w-full flex-1 flex-col justify-between p-6 sm:p-10 lg:w-1/2 lg:p-12 xl:p-16">
          {/* Top navigation link */}
          <div className="mx-auto mb-5 w-full max-w-md sm:pt-4">
            <Link
              href="/card"
              className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronLeft className="mr-1 h-5 w-5 rtl:rotate-180" />
              Kembali ke Dashboard
            </Link>
          </div>

          {/* Form container */}
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-4 sm:py-8">
            <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-ds-md sm:p-8 lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
              {/* Header Title & Subtitle */}
              <div className="mb-6 sm:mb-8">
                <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                  Masuk ke Sakuin
                </h1>
                <p className="text-sm text-text-secondary">
                  Masukkan email dan kata sandi Anda untuk mengakses dashboard kartu virtual.
                </p>
              </div>

              {infoNotice && (
                <div className="mb-5 rounded-xl border border-info-border bg-info-bg/80 dark:bg-info-bg/30 p-3.5 text-xs text-info flex items-start justify-between gap-2 animate-in fade-in duration-200">
                  <div className="leading-relaxed">{infoNotice}</div>
                  <button
                    type="button"
                    onClick={() => setInfoNotice(null)}
                    className="p-0.5 text-info/70 hover:text-info cursor-pointer font-bold text-sm shrink-0"
                    aria-label="Tutup pemberitahuan"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Social Login Button (Full width) */}
              <div>
                <button
                  type="button"
                  onClick={handleSocialSignIn}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-surface border border-border px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary cursor-pointer shadow-2xs"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                      fill="#EB4335"
                    />
                  </svg>
                  <span>Masuk dengan Google</span>
                </button>

                {/* Divider */}
                <div className="relative py-4 sm:py-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-subtle"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-surface px-4 py-0.5 text-text-tertiary">
                      atau dengan email
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                        Email <span className="text-error">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh@sakuin.id"
                        required
                        disabled={isLoading}
                        className="h-11 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-hidden transition-colors"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                        Kata Sandi <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan kata sandi Anda"
                          required
                          disabled={isLoading}
                          className="h-11 w-full rounded-xl border border-border bg-surface ps-4 pe-11 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-hidden transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
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

                    {/* Ingat saya & Lupa kata sandi */}
                    <div className="flex items-center justify-between">
                      <label className="group flex cursor-pointer items-center gap-2.5 select-none">
                        <div className="relative h-4 w-4">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 cursor-pointer appearance-none rounded border border-border bg-surface checked:bg-primary checked:border-primary transition-colors focus:outline-hidden"
                          />
                          {rememberMe && (
                            <svg
                              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-text-inverse"
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="block text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                          Ingat saya
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setInfoNotice("Akun demo telah disiapkan otomatis dengan email info@gmail.com dan kata sandi default.");
                        }}
                        className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
                      >
                        Lupa kata sandi?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-active py-3 px-4 text-sm font-semibold text-text-inverse shadow-ds-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-primary/20 active:scale-[0.99] cursor-pointer disabled:opacity-70"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <span>Masuk</span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Footer Sign Up Link */}
                <div className="mt-5 text-center sm:text-left">
                  <p className="text-xs text-text-secondary">
                    Belum punya akun?{" "}
                    <Link
                      href="/card"
                      className="text-primary hover:text-primary-hover font-semibold transition-colors"
                    >
                      Daftar akun baru
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Brand Banner (Desktop only) */}
        <div className="lg:w-1/2 w-full min-h-screen bg-primary text-text-inverse lg:flex items-center justify-center hidden p-8 lg:p-12 xl:p-16 select-none relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-primary-active opacity-90" />
          <div className="relative z-10 flex flex-col items-center justify-center max-w-lg text-center">
            <div className="block mb-6 transition-transform duration-500 hover:scale-[1.02]">
              <Image
                width={540}
                height={600}
                src="/images/dashboard.login.png"
                alt="Sakuin Cards"
                priority
                className="w-full max-w-[440px] xl:max-w-[500px] 2xl:max-w-[560px] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Floating Theme Switcher at bottom-right */}
        <div className="fixed bottom-6 right-6 z-50">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
