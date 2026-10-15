import type { Database } from "@/shared/lib/supabase/database.types";

export type ContentType = "promo" | "info" | "guide";

export type DbPromoRow = Database["public"]["Tables"]["promos"]["Row"];
export type DbPromoInsert = Database["public"]["Tables"]["promos"]["Insert"];
export type DbPromoUpdate = Database["public"]["Tables"]["promos"]["Update"];

export interface PromoItem {
  id: string;
  type: ContentType; // "promo" (Promosi), "info" (Informasi / Pengumuman), atau "guide" (Panduan)
  title: string; // Judul Promosi / Informasi / Panduan
  bannerUrl: string; // Link banner (URL gambar / path)
  bannerLink?: string; // Link tujuan banner (opsional, untuk promosi)
  shortDescription: string; // Deskripsi Singkat
  contentHtml: string; // Detail Lengkap (HTML text editor)
  publishedAt?: string; // Tanggal Terbit
  takedownAt?: string; // Tanggal Selesai / Takedown
  hideBeforePublished?: boolean; // Sembunyikan sebelum tanggal terbit
  isHidden?: boolean; // Sembunyikan dari pengguna
  isHighlight?: boolean; // Jadikan promosi unggulan (highlight) berukuran besar / carousel
  createdAt: string;
  updatedAt: string;
}

export type PromoStatus = "active" | "scheduled" | "expired";

/**
 * Mapping baris tabel PostgreSQL Supabase ke model domain PromoItem
 */
export function mapDbPromoToPromo(row: DbPromoRow): PromoItem {
  return {
    id: String(row.id),
    type: "promo",
    title: row.title,
    bannerUrl: row.banner_url,
    bannerLink: row.banner_link || undefined,
    shortDescription: row.short_description,
    contentHtml: row.content_html,
    publishedAt: row.published_at,
    takedownAt: row.takedown_at || undefined,
    isHidden: Boolean((row as Record<string, unknown>).is_hidden ?? false),
    isHighlight: Boolean((row as Record<string, unknown>).is_highlight ?? false),
    hideBeforePublished: Boolean((row as Record<string, unknown>).hide_before_published ?? false),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Mapping data input frontend ke format payload insert Supabase
 */
export function mapPromoToDb(
  promo: Omit<PromoItem, "id" | "createdAt" | "updatedAt"> & { id?: string },
  customNextId?: number
): DbPromoInsert {
  const numId = promo.id ? Number(promo.id) : undefined;
  const validId = numId && !isNaN(numId) ? numId : customNextId;

  return {
    ...(validId ? { id: validId } : {}),
    title: promo.title.trim(),
    banner_url: promo.bannerUrl.trim(),
    banner_link: promo.bannerLink?.trim() || null,
    short_description: promo.shortDescription.trim(),
    content_html: promo.contentHtml.trim(),
    published_at: promo.publishedAt || new Date().toISOString(),
    takedown_at: promo.takedownAt ? promo.takedownAt : null,
    is_hidden: Boolean(promo.isHidden),
    is_highlight: Boolean(promo.isHighlight),
    hide_before_published: Boolean(promo.hideBeforePublished),
    updated_at: new Date().toISOString(),
  };
}
