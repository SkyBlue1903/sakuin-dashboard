import type { CategoryItem, MerchantItem } from "@/features/admin/merchant/domain/category";
import { Database, TablesInsert } from "@/shared/lib/supabase/database.types";
import { compressImageUrl } from "@/shared/utils/imageOptimizer";

type DbCategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type DbMerchantRow = Database["public"]["Tables"]["merchants"]["Row"];
type DbSubMerchantRow = Database["public"]["Tables"]["sub_merchants"]["Row"];

export type DbMerchantWithSubs = DbMerchantRow & {
  sub_merchants?: DbSubMerchantRow[];
};

export type DbCategoryWithRelations = DbCategoryRow & {
  merchants?: DbMerchantWithSubs[];
};

export function mapDbMerchantToMerchant(row: DbMerchantWithSubs): MerchantItem {
  return {
    id: String(row.id),
    name: row.name,
    logoUrl: row.logo_url || undefined,
    logoDarkUrl: row.logo_dark_url || undefined,
    subMerchants: (row.sub_merchants || []).map((s) => s.name.toUpperCase()),
  };
}

export function mapMerchantToDb(
  merchant: MerchantItem,
  categoryId: string
): TablesInsert<"merchants"> {
  const numId = Number(merchant.id);
  const numCatId = Number(categoryId);
  return {
    ...(isNaN(numId) ? {} : { id: numId }),
    category_id: isNaN(numCatId) ? 1 : numCatId,
    name: merchant.name,
    logo_url: merchant.logoUrl ? compressImageUrl(merchant.logoUrl) : null,
    logo_dark_url: merchant.logoDarkUrl ? compressImageUrl(merchant.logoDarkUrl) : null,
    updated_at: new Date().toISOString(),
  };
}

export function mapSubMerchantToDb(
  merchantId: string,
  subName: string
): TablesInsert<"sub_merchants"> {
  const numMerchantId = Number(merchantId);
  return {
    merchant_id: isNaN(numMerchantId) ? 1 : numMerchantId,
    name: subName.trim().toUpperCase(),
  };
}

export function mapDbToCategory(row: DbCategoryWithRelations): CategoryItem {
  return {
    id: String(row.id),
    name: row.name,
    apiCategoryName: row.api_category_name || undefined,
    description: row.description || undefined,
    iconType: row.icon_type,
    iconName: row.icon_name || undefined,
    iconSrc: row.icon_src || undefined,
    color: row.color,
    merchants: (row.merchants || []).map(mapDbMerchantToMerchant),
  };
}

export function mapCategoryToDb(category: CategoryItem): TablesInsert<"categories"> {
  const numId = Number(category.id);
  return {
    ...(isNaN(numId) ? {} : { id: numId }),
    name: category.name,
    api_category_name: category.apiCategoryName || null,
    description: category.description || null,
    icon_type: category.iconType,
    icon_name: category.iconName || null,
    icon_src: category.iconSrc ? compressImageUrl(category.iconSrc) : null,
    color: category.color,
    updated_at: new Date().toISOString(),
  };
}
