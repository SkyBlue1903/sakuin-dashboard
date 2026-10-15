import type { Metadata } from "next";
import Link from "next/link";
import { User, Mail, Phone, Calendar, ShieldCheck, CreditCard, ChevronRight, Bell, Lock } from "lucide-react";
import CardLayout from "@/features/user/card/presentation/views/CardLayout";
import ThemeSwitcher from "@/shared/presentation/components/ui/ThemeSwitcher";

export const metadata: Metadata = {
  title: "Detail Profil | Sakuin",
  description: "Informasi akun pengguna, pengaturan keamanan, dan preferensi dashboard Sakuin",
};

export default function ProfilePage() {
  return (
    <CardLayout>
      <div className="flex-1 w-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-5xl mx-auto">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-2 text-xs text-text-tertiary">
            <Link href="/card" className="hover:text-text-primary transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Detail Profil</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Profil Pengguna</h1>
          <p className="text-sm text-text-secondary">
            Kelola data diri, preferensi tampilan, dan pengaturan keamanan akun Anda.
          </p>
        </div>

        {/* Profile Card Header */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-ds-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <User className="h-8 w-8" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-text-primary">Musfiq Rahman</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Akun Terverifikasi
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">Role: Administrator Sakuin</p>
                <p className="text-xs text-text-tertiary mt-0.5">ID Pengguna: SKU-882941</p>
              </div>
            </div>

            <Link
              href="/card"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-secondary hover:bg-surface-tertiary border border-border text-text-primary transition-colors cursor-pointer"
            >
              <CreditCard className="h-4 w-4 text-primary" />
              Buka SakuCard
              <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" />
            </Link>
          </div>
        </div>

        {/* 2 Column Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Diri */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-ds-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-subtle">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-text-primary">Informasi Kontak</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-text-tertiary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-text-tertiary">Email Terdaftar</p>
                    <p className="text-sm font-medium text-text-primary break-all">musfiq.dev@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-text-tertiary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-text-tertiary">Nomor Telepon</p>
                    <p className="text-sm font-medium text-text-primary">+62 812-3456-7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-text-tertiary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-text-tertiary">Tanggal Bergabung</p>
                    <p className="text-sm font-medium text-text-primary">12 Oktober 2024</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary">
              <span>Keamanan 2FA</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Aktif</span>
            </div>
          </div>

          {/* Preferensi & Keamanan */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-ds-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-subtle">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-text-primary">Preferensi Aplikasi</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Tema Tampilan</p>
                    <p className="text-xs text-text-secondary">Pilih mode terang, gelap, atau sistem</p>
                  </div>
                  <ThemeSwitcher />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-text-tertiary" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">Notifikasi Transaksi</p>
                      <p className="text-xs text-text-secondary">Pemberitahuan real-time kartu</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                    Aktif
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-text-tertiary" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">Proteksi PIN SakuCard</p>
                      <p className="text-xs text-text-secondary">Diperlukan setiap transaksi</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                    Wajib
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border-subtle">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 transition-colors"
              >
                Keluar dari Akun
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CardLayout>
  );
}
