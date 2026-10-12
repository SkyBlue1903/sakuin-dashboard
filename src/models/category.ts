export interface MerchantItem {
  id: string;
  name: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  subMerchants?: string[];
}

export interface CategoryItem {
  id: string;
  name: string; // Nama Kategori di Sakuin.id
  apiCategoryName?: string; // Nama Kategori Respon API
  description?: string;
  iconType: "lucide" | "image";
  iconName?: string;
  iconSrc?: string;
  color: string;
  merchants: MerchantItem[];
}

export interface MatchResult {
  category: CategoryItem | null;
  exactMatch: string | null;
  merchant: MerchantItem | null;
  matchedBy: "merchant_name" | "sub_merchant" | null;
  matchedSubMerchant?: string;
}
