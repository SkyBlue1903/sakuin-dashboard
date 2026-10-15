"use client";

import { create } from "zustand";
import { guideApi } from "@/services/guideApi";
import { emitToast } from "@/stores/ToastContext";
import type { GuideItem } from "@/models/guide";
import type { PromoItem } from "@/models/promo";

// Pembersihan cache legacy localStorage khusus untuk item guide jika ada sisa
if (typeof window !== "undefined") {
  try {
    ["sakuin_admin_promos_v3", "sakuin_admin_promos_v2", "sakuin_admin_promos_v1", "sakuin_guides"].forEach((key) => {
      const item = localStorage.getItem(key);
      if (item && item.includes('"type":"guide"')) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) {
          localStorage.setItem(
            key,
            JSON.stringify(parsed.filter((p: { type?: string }) => p.type !== "guide"))
          );
        }
      }
    });
  } catch {
    // Ignore storage parse error
  }
}

interface GuideStoreState {
  guides: GuideItem[];
  isLoading: boolean;
  loadGuides: (includeHidden?: boolean) => Promise<void>;
  addGuide: (
    newGuideData: Omit<PromoItem, "id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean; message: string; guide: GuideItem }>;
  updateGuide: (
    id: string,
    updatedData: Partial<Omit<PromoItem, "id" | "createdAt" | "updatedAt">>
  ) => Promise<{ success: boolean; message: string; guide?: GuideItem }>;
  deleteGuide: (id: string) => Promise<{ success: boolean; message: string }>;
  duplicateGuide: (id: string) => Promise<GuideItem | null>;
}

export const useGuideStore = create<GuideStoreState>((set, get) => ({
  // Clean initial state (Zero dummy data, 100% dari Supabase)
  guides: [],
  isLoading: false,

  loadGuides: async (includeHidden = true) => {
    set({ isLoading: true });
    try {
      const data = await guideApi.getGuides(includeHidden);
      set({ guides: Array.isArray(data) ? data : [], isLoading: false });
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal memuat panduan dari database";
      console.error("[GuideStore] Error loadGuides:", errorDetail);
      set({ guides: [], isLoading: false });
      emitToast(`Gagal memuat panduan: ${errorDetail}`, "error");
    }
  },

  addGuide: async (newGuideData) => {
    try {
      const savedGuide = await guideApi.createGuide(newGuideData);
      set((state) => ({
        guides: [savedGuide, ...state.guides.filter((g) => g.id !== savedGuide.id)],
      }));
      return {
        success: true,
        message: `Panduan "${savedGuide.title}" berhasil ditambahkan!`,
        guide: savedGuide,
      };
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal menyimpan panduan ke database";
      console.error("[GuideStore] Error createGuide:", errorDetail);
      emitToast(`Gagal menambahkan panduan: ${errorDetail}`, "error");
      throw err;
    }
  },

  updateGuide: async (id, updatedData) => {
    const previousGuides = get().guides;
    const targetGuide = previousGuides.find((g) => g.id === id);
    if (!targetGuide) {
      const err = new Error("Panduan tidak ditemukan.");
      emitToast(err.message, "error");
      throw err;
    }

    try {
      const savedGuide = await guideApi.updateGuide(id, updatedData);
      set((state) => ({
        guides: state.guides.map((item) => (item.id === id ? savedGuide : item)),
      }));
      return {
        success: true,
        message: `Panduan "${savedGuide.title}" berhasil diperbarui!`,
        guide: savedGuide,
      };
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal memperbarui panduan di database";
      console.error("[GuideStore] Error updateGuide:", errorDetail);
      emitToast(`Gagal memperbarui panduan: ${errorDetail}`, "error");
      throw err;
    }
  },

  deleteGuide: async (id) => {
    const previousGuides = get().guides;
    const targetGuide = previousGuides.find((g) => g.id === id);

    try {
      await guideApi.deleteGuide(id);
      set((state) => ({
        guides: state.guides.filter((item) => item.id !== id),
      }));
      return {
        success: true,
        message: `Panduan "${targetGuide?.title || id}" berhasil dihapus.`,
      };
    } catch (err: unknown) {
      const errorDetail = err instanceof Error ? err.message : "Gagal menghapus panduan dari database";
      console.error("[GuideStore] Error deleteGuide:", errorDetail);
      emitToast(`Gagal menghapus panduan: ${errorDetail}`, "error");
      throw err;
    }
  },

  duplicateGuide: async (id) => {
    const target = get().guides.find((p) => p.id === id);
    if (!target) return null;

    try {
      const result = await get().addGuide({
        type: "guide",
        title: `${target.title} (Salinan)`,
        bannerUrl: target.bannerUrl,
        shortDescription: target.shortDescription,
        contentHtml: target.contentHtml,
        isHidden: target.isHidden,
      });

      return result.guide || null;
    } catch (err: unknown) {
      console.error("[GuideStore] Error duplicateGuide:", err);
      return null;
    }
  },
}));
