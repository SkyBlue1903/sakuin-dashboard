"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import ThemeTogglerTwo from "@/views/common/ThemeTogglerTwo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("info@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="relative min-h-screen w-full bg-brand-950 dark:bg-gray-950 lg:bg-white lg:dark:bg-gray-900 overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Mobile-Only Background: desktop brand color + dashboard.login.png watermark */}
      <div className="absolute inset-0 z-0 lg:hidden overflow-hidden pointer-events-none select-none">
        {/* Background color matching desktop right brand panel */}
        <div className="absolute inset-0 bg-brand-950 dark:bg-[#0c0e2b]" />

        {/* Background image: dashboard.login.png */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <Image
            src="/images/dashboard.login.png"
            alt="Sakuin Background"
            fill
            priority
            sizes="100vw"
            className="object-contain object-center opacity-30 sm:opacity-35 scale-105"
          />
        </div>

        {/* Ambient subtle vignette gradient for optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-950/45 to-brand-950/90 dark:from-[#0c0e2b]/85 dark:via-transparent dark:to-[#0c0e2b]/95" />
      </div>

      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left Column: Sign In Form */}
        <div className="flex w-full flex-1 flex-col justify-between p-6 sm:p-10 lg:w-1/2 lg:p-12 xl:p-16">
          {/* Top navigation link */}
          <div className="mx-auto mb-5 w-full max-w-md sm:pt-4">
            <Link
              href="/card"
              className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white lg:text-gray-500 lg:hover:text-gray-700 lg:dark:text-gray-400 lg:dark:hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="mr-1 h-5 w-5 rtl:rotate-180" />
              Kembali ke Dashboard
            </Link>
          </div>

          {/* Form container (glassmorphic on mobile, clean flat on desktop) */}
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-4 sm:py-8">
            <div className="rounded-3xl border border-white/10 bg-brand-950/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
              {/* Header Title & Subtitle */}
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 text-title-sm font-semibold text-white lg:text-gray-800 lg:dark:text-white/90 sm:text-title-md">
                  Masuk
                </h1>
                <p className="text-sm text-gray-300 lg:text-gray-500 lg:dark:text-gray-400">
                  Masukkan email dan kata sandi Anda untuk masuk!
                </p>
              </div>

              {/* Social Login Button (Full width) */}
              <div>
                <button
                  type="button"
                  onClick={handleSocialSignIn}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/15 border border-white/10 lg:bg-gray-100 lg:text-gray-700 lg:hover:bg-gray-200 lg:hover:text-gray-800 lg:dark:bg-white/5 lg:dark:text-white/90 lg:dark:hover:bg-white/10 lg:border-transparent cursor-pointer shadow-2xs"
                >
                  <svg
                    width="20"
                    height="20"
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
                <div className="relative py-3 sm:py-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/15 lg:border-gray-200 lg:dark:border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-brand-950/90 lg:bg-white dark:bg-gray-900 px-3 sm:px-5 py-1 text-gray-300 lg:text-gray-400 rounded-full lg:rounded-none">
                      Atau
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5 sm:space-y-6">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-200 lg:text-gray-700 lg:dark:text-gray-400">
                        Email <span className="text-red-400 lg:text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="info@gmail.com"
                        required
                        disabled={isLoading}
                        className="h-11 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-brand-400 focus:ring-3 focus:ring-brand-400/20 focus:outline-hidden lg:border-gray-300 lg:bg-transparent lg:text-gray-800 lg:dark:border-gray-700 lg:dark:bg-gray-900 lg:dark:text-white/90 lg:dark:placeholder:text-gray-500 lg:focus:border-brand-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-200 lg:text-gray-700 lg:dark:text-gray-400">
                        Kata Sandi <span className="text-red-400 lg:text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan kata sandi Anda"
                          required
                          disabled={isLoading}
                          className="h-11 w-full rounded-lg border border-white/20 bg-white/10 ps-4 pe-11 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-brand-400 focus:ring-3 focus:ring-brand-400/20 focus:outline-hidden lg:border-gray-300 lg:bg-transparent lg:text-gray-800 lg:dark:border-gray-700 lg:dark:bg-gray-900 lg:dark:text-white/90 lg:dark:placeholder:text-gray-500 lg:focus:border-brand-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-300 hover:text-white lg:text-gray-400 lg:hover:text-gray-600 lg:dark:text-gray-500 lg:dark:hover:text-gray-300 cursor-pointer"
                          aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Ingat saya & Lupa kata sandi */}
                    <div className="flex items-center justify-between">
                      <label className="group flex cursor-pointer items-center gap-3 select-none">
                        <div className="relative h-5 w-5">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/30 bg-white/10 checked:bg-brand-500 checked:border-transparent lg:border-gray-300 lg:bg-transparent lg:dark:border-gray-700 transition-colors focus:outline-hidden"
                          />
                          {rememberMe && (
                            <svg
                              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="block text-sm font-normal text-gray-200 lg:text-gray-700 lg:dark:text-gray-400">
                          Ingat saya
                        </span>
                      </label>

                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Untuk demonstrasi, akun default telah terisi otomatis.");
                        }}
                        className="text-sm font-medium text-brand-300 hover:text-brand-200 lg:text-brand-500 lg:hover:text-brand-600 lg:dark:text-brand-400 transition-colors"
                      >
                        Lupa kata sandi?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 px-4 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 active:scale-[0.99] cursor-pointer disabled:opacity-70"
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
                <div className="mt-5">
                  <p className="text-center text-sm font-normal text-gray-300 sm:text-start lg:text-gray-700 lg:dark:text-gray-400">
                    Belum punya akun?{" "}
                    <Link
                      href="/card"
                      className="text-brand-300 hover:text-brand-200 lg:text-brand-500 lg:hover:text-brand-600 lg:dark:text-brand-400 transition-colors font-medium"
                    >
                      Daftar
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Brand Banner with Sakuin Cards Image and Clean Background (Desktop only) */}
        <div className="lg:w-1/2 w-full min-h-screen bg-brand-950 dark:bg-white/5 lg:flex items-center justify-center hidden p-8 lg:p-12 xl:p-16 select-none">
          <div className="relative flex flex-col items-center justify-center max-w-lg text-center">
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
