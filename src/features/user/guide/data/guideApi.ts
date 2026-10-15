import type { GuideItem } from "@/features/user/guide/domain/guide";
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
 * Service Client untuk REST API Panduan (Guides)
 * Endpoint: /api/v1/guides
 */
export const guideApi = {
  /**
   * Mengambil daftar panduan dari Supabase
   * @param all Jika true (Admin), ambil semua termasuk yang isHidden = true.
   *            Jika false / undefined (User), hanya ambil yang isHidden = false.
   */
  async getGuides(all: boolean = false): Promise<GuideItem[]> {
    const res = await fetch(`/api/v1/guides?all=${all ? "true" : "false"}&_t=${Date.now()}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
    const data = await handleResponse<GuideItem[]>(res);
    return data || [];
  },

  /**
   * Menambahkan panduan baru ke database Supabase
   */
  async createGuide(
    guide: Omit<PromoItem, "id" | "createdAt" | "updatedAt">
  ): Promise<GuideItem> {
    const res = await fetch("/api/v1/guides", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify(guide),
    });
    return handleResponse<GuideItem>(res);
  },

  /**
   * Memperbarui panduan di database Supabase
   */
  async updateGuide(
    id: string,
    updates: Partial<Omit<PromoItem, "id" | "createdAt" | "updatedAt">>
  ): Promise<GuideItem> {
    const res = await fetch(`/api/v1/guides/${id}`, {
      method: "PUT",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<GuideItem>(res);
  },

  /**
   * Menghapus panduan dari database Supabase
   */
  async deleteGuide(id: string): Promise<void> {
    const res = await fetch(`/api/v1/guides/${id}`, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
    await handleResponse<unknown>(res);
  },
};
