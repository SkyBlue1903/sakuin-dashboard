import type { PromoItem } from "./promo";
import type { Database } from "@/lib/supabase/database.types";

export type DbInfoRow = Database["public"]["Tables"]["infos"]["Row"];
export type DbInfoInsert = Database["public"]["Tables"]["infos"]["Insert"];
export type DbInfoUpdate = Database["public"]["Tables"]["infos"]["Update"];

export interface InfoItem extends Omit<PromoItem, "type"> {
  type: "info";
  bannerLink?: string;
  publishedAt: string;
  isHidden?: boolean;
  isHighlight?: boolean;
  hideBeforePublished?: boolean;
}

/**
 * Mapping baris tabel PostgreSQL Supabase ke model domain InfoItem
 */
export function mapDbInfoToInfo(row: DbInfoRow): InfoItem {
  return {
    id: String(row.id),
    type: "info",
    title: row.title,
    bannerUrl: row.banner_url,
    bannerLink: row.banner_link || undefined,
    shortDescription: row.short_description,
    contentHtml: row.content_html,
    publishedAt: row.published_at,
    isHidden: Boolean((row as Record<string, unknown>).is_hidden ?? false),
    isHighlight: Boolean((row as Record<string, unknown>).is_highlight ?? false),
    hideBeforePublished: Boolean(row.hide_before_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Mapping data input frontend ke format payload insert Supabase
 */
export function mapInfoToDb(
  info: Omit<PromoItem, "id" | "createdAt" | "updatedAt"> & { id?: string },
  customNextId?: number
): DbInfoInsert {
  const numId = info.id ? Number(info.id) : undefined;
  const validId = numId && !isNaN(numId) ? numId : customNextId;

  return {
    ...(validId ? { id: validId } : {}),
    title: info.title.trim(),
    banner_url: info.bannerUrl.trim(),
    banner_link: info.bannerLink?.trim() || null,
    short_description: info.shortDescription.trim(),
    content_html: info.contentHtml.trim(),
    published_at: info.publishedAt || new Date().toISOString(),
    is_hidden: Boolean(info.isHidden),
    is_highlight: Boolean(info.isHighlight),
    hide_before_published: Boolean(info.hideBeforePublished),
    updated_at: new Date().toISOString(),
  };
}
