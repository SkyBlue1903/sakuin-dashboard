"use client";

import { create } from "zustand";
import { infoApi } from "@/services/infoApi";
import { emitToast } from "@/stores/ToastContext";
import type { InfoItem } from "@/models/info";
import type { PromoItem } from "@/models/promo";

// Pembersihan cache legacy localStorage khusus untuk item informasi jika ada sisa dummy
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("sakuin_infos");
    ["sakuin_admin_promos_v3", "sakuin_admin_promos_v2", "sakuin_admin_promos_v1"].forEach((key) => {
      const item = localStorage.getItem(key);
      if (item && item.includes('"type":"info"')) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) {
          localStorage.setItem(
            key,
            JSON.stringify(parsed.filter((p: { type?: string }) => p.type !== "info"))
          );
        }
      }
    });
  } catch {
    // Ignore storage parse error
  }
}

interface InfoStoreState {
  infos: InfoItem[];
  isLoading: boolean;
  loadInfos: (includeHidden?: boolean) => Promise<void>;
  addInfo: (
    newInfoData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean; message: string; info: InfoItem }>;
  updateInfo: (
    id: string,
    updatedData: Partial<Omit<PromoItem, "id" | "createdAt" | "updatedAt">>
  ) => Promise<{ success: boolean; message: string; info?: InfoItem }>;
  deleteInfo: (id: string) => Promise<{ success: boolean; message: string }>;
  duplicateInfo: (id: string) => Promise<InfoItem | null>;
}

export const useInfoStore = create<InfoStoreState>((set, get) => ({
  // Clean initial state (Zero dummy data, 100% dari Supabase)
  infos: [],
  isLoading: false,

  loadInfos: async (includeHidden = true) => {
    set({ isLoading: true });
    try {
      const data = await infoApi.getInfos(includeHidden);
      set({ infos: Array.isArray(data) ? data : [], isLoading: false });
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal memuat informasi dari database";
      console.error("[InfoStore] Error loadInfos:", errorDetail);
      set({ infos: [], isLoading: false });
      emitToast(`Gagal memuat informasi: ${errorDetail}`, "error");
    }
  },

  addInfo: async (newInfoData) => {
    try {
      const savedInfo = await infoApi.createInfo(newInfoData);
      set((state) => ({
        infos: [savedInfo, ...state.infos.filter((i) => i.id !== savedInfo.id)],
      }));
      return {
        success: true,
        message: `Informasi "${savedInfo.title}" berhasil ditambahkan!`,
        info: savedInfo,
      };
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal menyimpan informasi ke database";
      console.error("[InfoStore] Error createInfo:", errorDetail);
      emitToast(`Gagal menambahkan informasi: ${errorDetail}`, "error");
      throw err;
    }
  },

  updateInfo: async (id, updatedData) => {
    const previousInfos = get().infos;
    const targetInfo = previousInfos.find((i) => i.id === id);
    if (!targetInfo) {
      const err = new Error("Informasi tidak ditemukan.");
      emitToast(err.message, "error");
      throw err;
    }

    try {
      const savedInfo = await infoApi.updateInfo(id, updatedData);
      set((state) => ({
        infos: state.infos.map((item) => (item.id === id ? savedInfo : item)),
      }));
      return {
        success: true,
        message: `Informasi "${savedInfo.title}" berhasil diperbarui!`,
        info: savedInfo,
      };
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal memperbarui informasi di database";
      console.error("[InfoStore] Error updateInfo:", errorDetail);
      emitToast(`Gagal memperbarui informasi: ${errorDetail}`, "error");
      throw err;
    }
  },

  deleteInfo: async (id) => {
    const previousInfos = get().infos;
    const targetInfo = previousInfos.find((i) => i.id === id);

    try {
      await infoApi.deleteInfo(id);
      set((state) => ({
        infos: state.infos.filter((item) => item.id !== id),
      }));
      return {
        success: true,
        message: `Informasi "${targetInfo?.title || id}" berhasil dihapus.`,
      };
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal menghapus informasi dari database";
      console.error("[InfoStore] Error deleteInfo:", errorDetail);
      emitToast(`Gagal menghapus informasi: ${errorDetail}`, "error");
      throw err;
    }
  },

  duplicateInfo: async (id) => {
    const target = get().infos.find((i) => i.id === id);
    if (!target) return null;

    try {
      const result = await get().addInfo({
        type: "info",
        title: `${target.title} (Salinan)`,
        bannerUrl: target.bannerUrl,
        bannerLink: target.bannerLink,
        shortDescription: target.shortDescription,
        contentHtml: target.contentHtml,
        publishedAt: new Date().toISOString(),
        hideBeforePublished: target.hideBeforePublished,
      });

      return result.info || null;
    } catch (err: unknown) {
      console.error("[InfoStore] Error duplicateInfo:", err);
      return null;
    }
  },
}));

export const useInfo = () => {
  return useInfoStore();
};
