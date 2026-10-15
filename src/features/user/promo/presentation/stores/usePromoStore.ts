"use client";

import { create } from "zustand";
import { promoApi } from "@/services/promoApi";
import { emitToast } from "@/stores/ToastContext";
import type { PromoItem, PromoStatus, ContentType } from "@/models/promo";

export { type PromoItem, type PromoStatus, type ContentType };

// Helper status promosi
export const getPromoStatus = (promo: PromoItem): PromoStatus => {
  const now = new Date().getTime();
  const pub = promo.publishedAt ? new Date(promo.publishedAt).getTime() : 0;
  const down = promo.takedownAt ? new Date(promo.takedownAt).getTime() : Infinity;

  if (now < pub) return "scheduled";
  if (now > down) return "expired";
  return "active";
};

export const getPromoStatusBadge = (
  promoOrStatus: PromoItem | PromoStatus
): { label: string; colorClass: string; dotClass: string } => {
  const status = typeof promoOrStatus === "string" ? promoOrStatus : getPromoStatus(promoOrStatus);

  switch (status) {
    case "active":
      return {
        label: "Aktif",
        colorClass:
          "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40",
        dotClass: "bg-emerald-500 animate-pulse",
      };
    case "scheduled":
      return {
        label: "Dijadwalkan",
        colorClass:
          "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/40",
        dotClass: "bg-purple-500",
      };
    case "expired":
      return {
        label: "Berakhir",
        colorClass:
          "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
        dotClass: "bg-gray-400",
      };
  }
};

// Pembersihan cache legacy localStorage untuk promo agar tidak ada sisa dummy
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("sakuin_promos");
    localStorage.removeItem("sakuin_admin_promos_v3");
    localStorage.removeItem("sakuin_admin_promos_v2");
    localStorage.removeItem("sakuin_admin_promos_v1");
  } catch {
    // Ignore storage parse error
  }
}

interface PromoStoreState {
  promos: PromoItem[];
  isLoading: boolean;
  initPromos: () => void;
  loadPromos: (includeHidden?: boolean) => Promise<void>;
  addPromo: (
    newPromoData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean; message: string; promo: PromoItem }>;
  updatePromo: (
    id: string,
    updatedData: Partial<Omit<PromoItem, "id" | "createdAt" | "updatedAt">>
  ) => Promise<{ success: boolean; message: string; promo?: PromoItem }>;
  deletePromo: (id: string) => Promise<{ success: boolean; message: string }>;
  duplicatePromo: (id: string) => Promise<PromoItem | null>;
}

export const usePromoStore = create<PromoStoreState>((set, get) => ({
  // Clean initial state (Zero dummy data, 100% dari Supabase)
  promos: [],
  isLoading: false,

  initPromos: () => {
    // Backward compatibility for StoreInitializer
  },

  loadPromos: async (includeHidden = true) => {
    set({ isLoading: true });
    try {
      const data = await promoApi.getPromos(includeHidden);
      set({ promos: Array.isArray(data) ? data : [], isLoading: false });
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal memuat promosi dari database";
      console.error("[PromoStore] Error loadPromos:", errorDetail);
      set({ promos: [], isLoading: false });
      emitToast(`Gagal memuat promosi: ${errorDetail}`, "error");
    }
  },

  addPromo: async (newPromoData) => {
    try {
      const savedPromo = await promoApi.createPromo(newPromoData);
      set((state) => ({
        promos: [savedPromo, ...state.promos.filter((p) => p.id !== savedPromo.id)],
      }));
      return {
        success: true,
        message: `Promosi "${savedPromo.title}" berhasil ditambahkan!`,
        promo: savedPromo,
      };
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal menyimpan promosi ke database";
      console.error("[PromoStore] Error createPromo:", errorDetail);
      emitToast(`Gagal menambahkan promosi: ${errorDetail}`, "error");
      throw err;
    }
  },

  updatePromo: async (id, updatedData) => {
    const previousPromos = get().promos;
    const targetPromo = previousPromos.find((p) => p.id === id);
    if (!targetPromo) {
      const err = new Error("Promosi tidak ditemukan.");
      emitToast(err.message, "error");
      throw err;
    }

    try {
      const savedPromo = await promoApi.updatePromo(id, updatedData);
      set((state) => ({
        promos: state.promos.map((item) => (item.id === id ? savedPromo : item)),
      }));
      return {
        success: true,
        message: `Promosi "${savedPromo.title}" berhasil diperbarui!`,
        promo: savedPromo,
      };
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal memperbarui promosi di database";
      console.error("[PromoStore] Error updatePromo:", errorDetail);
      emitToast(`Gagal memperbarui promosi: ${errorDetail}`, "error");
      throw err;
    }
  },

  deletePromo: async (id) => {
    const previousPromos = get().promos;
    const targetPromo = previousPromos.find((p) => p.id === id);

    try {
      await promoApi.deletePromo(id);
      set((state) => ({
        promos: state.promos.filter((item) => item.id !== id),
      }));
      return {
        success: true,
        message: `Promosi "${targetPromo?.title || id}" berhasil dihapus.`,
      };
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal menghapus promosi dari database";
      console.error("[PromoStore] Error deletePromo:", errorDetail);
      emitToast(`Gagal menghapus promosi: ${errorDetail}`, "error");
      throw err;
    }
  },

  duplicatePromo: async (id) => {
    const target = get().promos.find((p) => p.id === id);
    if (!target) return null;

    try {
      const result = await get().addPromo({
        type: "promo",
        title: `${target.title} (Salinan)`,
        bannerUrl: target.bannerUrl,
        bannerLink: target.bannerLink,
        shortDescription: target.shortDescription,
        contentHtml: target.contentHtml,
        publishedAt: new Date().toISOString(),
        takedownAt: target.takedownAt,
        isHidden: target.isHidden,
        isHighlight: target.isHighlight,
        hideBeforePublished: target.hideBeforePublished,
      });

      return result.promo || null;
    } catch (err: unknown) {
      console.error("[PromoStore] Error duplicatePromo:", err);
      return null;
    }
  },
}));

export const usePromo = () => {
  return usePromoStore();
};
