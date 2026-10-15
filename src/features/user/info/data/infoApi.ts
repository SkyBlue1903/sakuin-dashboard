import type { InfoItem } from "@/features/user/info/domain/info";
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
 * Service Client untuk REST API Informasi (Infos)
 * Endpoint: /api/v1/infos
 */
export const infoApi = {
  /**
   * Mengambil daftar informasi dari Supabase
   * @param all Jika true (Admin), ambil semua termasuk yang hideBeforePublished.
   *            Jika false / undefined (User), hanya ambil yang publik dan sudah terbit.
   */
  async getInfos(all: boolean = false): Promise<InfoItem[]> {
    const res = await fetch(`/api/v1/infos?all=${all ? "true" : "false"}&_t=${Date.now()}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
    const data = await handleResponse<InfoItem[]>(res);
    return data || [];
  },

  /**
   * Menambahkan informasi baru ke database Supabase
   */
  async createInfo(
    info: Omit<PromoItem, "id" | "createdAt" | "updatedAt">
  ): Promise<InfoItem> {
    const res = await fetch("/api/v1/infos", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify(info),
    });
    return handleResponse<InfoItem>(res);
  },

  /**
   * Memperbarui informasi di database Supabase
   */
  async updateInfo(
    id: string,
    updates: Partial<Omit<PromoItem, "id" | "createdAt" | "updatedAt">>
  ): Promise<InfoItem> {
    const res = await fetch(`/api/v1/infos/${id}`, {
      method: "PUT",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<InfoItem>(res);
  },

  /**
   * Menghapus informasi dari database Supabase
   */
  async deleteInfo(id: string): Promise<void> {
    const res = await fetch(`/api/v1/infos/${id}`, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
    await handleResponse<unknown>(res);
  },
};
