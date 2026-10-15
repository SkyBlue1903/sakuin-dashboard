import type { CategoryItem, MerchantItem } from "@/features/admin/merchant/domain/category";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.error) {
        errorMsg = errJson.error;
      }
    } catch {
      if (res.statusText) errorMsg += ` (${res.statusText})`;
    }
    throw new Error(errorMsg);
  }
  const json = await res.json();
  return json.data;
}

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
    const data = await handleResponse<CategoryItem[]>(res);
    return data || [];
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
    return handleResponse<CategoryItem>(res);
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
    return handleResponse<CategoryItem>(res);
  },

  /**
   * Menghapus kategori berdasarkan ID (otomatis menghapus seluruh merchant terkait di database)
   */
  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`/api/v1/categories/${id}`, {
      method: "DELETE",
    });
    await handleResponse<unknown>(res);
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
    return handleResponse<MerchantItem>(res);
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
    return handleResponse<MerchantItem>(res);
  },

  /**
   * Menghapus 1 merchant berdasarkan ID
   */
  async deleteMerchant(merchantId: string): Promise<void> {
    const res = await fetch(`/api/v1/merchants/${merchantId}`, {
      method: "DELETE",
    });
    await handleResponse<unknown>(res);
  },
};
