import type { PromoItem } from "@/features/user/promo/domain/promo";

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
 * Service Client untuk REST API Promosi (Promos)
 * Endpoint: /api/v1/promos
 */
export const promoApi = {
  /**
   * Mengambil daftar promosi dari Supabase
   * @param all Jika true (Admin), ambil semua termasuk yang tersembunyi.
   *            Jika false / undefined (User), hanya ambil yang publik (is_hidden = false).
   */
  async getPromos(all: boolean = false): Promise<PromoItem[]> {
    const res = await fetch(`/api/v1/promos?all=${all ? "true" : "false"}&_t=${Date.now()}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
    const data = await handleResponse<PromoItem[]>(res);
    return data || [];
  },

  /**
   * Menambahkan promosi baru ke database Supabase
   */
  async createPromo(
    promo: Omit<PromoItem, "id" | "createdAt" | "updatedAt">
  ): Promise<PromoItem> {
    const res = await fetch("/api/v1/promos", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify(promo),
    });
    return handleResponse<PromoItem>(res);
  },

  /**
   * Memperbarui promosi di database Supabase
   */
  async updatePromo(
    id: string,
    updates: Partial<Omit<PromoItem, "id" | "createdAt" | "updatedAt">>
  ): Promise<PromoItem> {
    const res = await fetch(`/api/v1/promos/${id}`, {
      method: "PUT",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<PromoItem>(res);
  },

  /**
   * Menghapus promosi dari database Supabase
   */
  async deletePromo(id: string): Promise<void> {
    const res = await fetch(`/api/v1/promos/${id}`, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
    await handleResponse<unknown>(res);
  },
};
