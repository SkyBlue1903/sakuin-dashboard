import { CategoryItem, MerchantItem } from "@/context/CategoryContext";

/**
 * Service Client untuk REST API Kategori & Merchant
 * Endpoints: /api/v1/categories & /api/v1/merchants
 */
export const categoryApi = {
  // ==========================================
  // KATEGORI API
  // ==========================================

  /**
   * Mengambil semua daftar kategori beserta relasi merchant-nya
   */
  async getCategories(): Promise<CategoryItem[]> {
    const res = await fetch("/api/v1/categories");
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Menambahkan kategori baru
   */
  async createCategory(category: CategoryItem): Promise<CategoryItem> {
    const res = await fetch("/api/v1/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  /**
   * Memperbarui kategori
   */
  async updateCategory(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem> {
    const res = await fetch(`/api/v1/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  /**
   * Menghapus kategori berdasarkan ID (otomatis menghapus seluruh merchant terkait di database)
   */
  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`/api/v1/categories/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
  },

  // ==========================================
  // MERCHANT API (Granular & Hemat Bandwidth)
  // ==========================================

  /**
   * Menambahkan 1 merchant ke kategori tertentu
   */
  async createMerchant(categoryId: string, merchant: MerchantItem): Promise<MerchantItem> {
    const res = await fetch("/api/v1/merchants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, merchant }),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  /**
   * Memperbarui 1 merchant (nama, logo, sub-merchants, atau pindah categoryId)
   */
  async updateMerchant(
    merchantId: string,
    updates: Partial<MerchantItem> & { categoryId?: string }
  ): Promise<MerchantItem> {
    const res = await fetch(`/api/v1/merchants/${merchantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  /**
   * Menghapus 1 merchant berdasarkan ID
   */
  async deleteMerchant(merchantId: string): Promise<void> {
    const res = await fetch(`/api/v1/merchants/${merchantId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
  },
};
