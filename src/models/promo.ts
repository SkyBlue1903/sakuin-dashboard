export type ContentType = "promo" | "info" | "guide";

export interface PromoItem {
  id: string;
  type: ContentType; // "promo" (Promosi), "info" (Informasi / Pengumuman), atau "guide" (Panduan)
  title: string; // Judul Promosi / Informasi / Panduan
  bannerUrl: string; // Link banner (URL gambar / path)
  bannerLink?: string; // Link tujuan banner (opsional, untuk promosi)
  shortDescription: string; // Deskripsi Singkat
  contentHtml: string; // Detail Lengkap (HTML text editor)
  publishedAt?: string; // Tanggal Terbit (wajib untuk info & promo, TIDAK ADA untuk panduan)
  takedownAt?: string; // Tanggal Takedown (waktu & tanggal format: YYYY-MM-DDTHH:mm, untuk promosi)
  hideBeforePublished?: boolean; // Sembunyikan dari pengguna sebelum tanggal terbit
  createdAt: string;
  updatedAt: string;
}

export type PromoStatus = "active" | "scheduled" | "expired";
