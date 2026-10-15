import type { PromoItem } from "./promo";
import type { Database } from "@/lib/supabase/database.types";

export type DbGuideRow = Database["public"]["Tables"]["guides"]["Row"];
export type DbGuideInsert = Database["public"]["Tables"]["guides"]["Insert"];
export type DbGuideUpdate = Database["public"]["Tables"]["guides"]["Update"];

export interface GuideItem extends Omit<PromoItem, "type"> {
  type: "guide";
  isHidden?: boolean;
  isHighlight?: boolean;
}

export function mapDbGuideToGuide(row: DbGuideRow): GuideItem {
  return {
    id: String(row.id),
    type: "guide",
    title: row.title,
    bannerUrl: row.banner_url,
    shortDescription: row.short_description,
    contentHtml: row.content_html,
    isHidden: Boolean(row.is_hidden),
    isHighlight: Boolean((row as Record<string, unknown>).is_highlight),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapGuideToDb(
  guide: Omit<PromoItem, "id" | "createdAt" | "updatedAt"> & { id?: string },
  customNextId?: number
): DbGuideInsert {
  const numId = guide.id ? Number(guide.id) : undefined;
  const validId = numId && !isNaN(numId) ? numId : customNextId;

  return {
    ...(validId ? { id: validId } : {}),
    title: guide.title.trim(),
    banner_url: guide.bannerUrl.trim(),
    short_description: guide.shortDescription.trim(),
    content_html: guide.contentHtml.trim(),
    is_hidden: Boolean(guide.isHidden),
    is_highlight: Boolean(guide.isHighlight),
    updated_at: new Date().toISOString(),
  };
}
