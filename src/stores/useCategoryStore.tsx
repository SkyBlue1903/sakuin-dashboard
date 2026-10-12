"use client";

import React, { createContext } from "react";
import { create } from "zustand";
import { categoryApi } from "@/services/categoryApi";
import type { CategoryItem, MerchantItem, MatchResult } from "@/models/category";

export type { CategoryItem, MerchantItem, MatchResult };

export const DEFAULT_SUB_MERCHANTS: Record<string, string[]> = {};
export const DEFAULT_MERCHANT_LOGOS: Record<string, string> = {};
export const DEFAULT_CATEGORIES: CategoryItem[] = [];

export const createMerchant = (
  name: string,
  logoUrl?: string,
  logoDarkUrl?: string,
  subMerchants?: string[]
): MerchantItem => ({
  id: `m_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now()}`,
  name,
  logoUrl: logoUrl || undefined,
  logoDarkUrl: logoDarkUrl || undefined,
  subMerchants: subMerchants || [],
});

// Helper to normalize merchants (supporting both API Supabase and local cache/defaults)
export function normalizeCategoryList(rawCats: unknown[]): CategoryItem[] {
  if (!Array.isArray(rawCats)) return [];

  return (rawCats as any[]).map((cat, catIdx) => {
    const rawMerchants = Array.isArray(cat.merchants) ? cat.merchants : [];
    const normalizedMerchants: MerchantItem[] = rawMerchants.map((m: any, mIdx: number) => {
      if (typeof m === "string") {
        return {
          id: String(mIdx + 1),
          name: m,
          logoUrl: undefined,
          logoDarkUrl: undefined,
          subMerchants: [],
        };
      }
      const mObj = (m || {}) as Partial<MerchantItem>;
      const existingSubs = Array.isArray(mObj.subMerchants) ? mObj.subMerchants : [];
      return {
        id: String(mObj.id || `m_${catIdx}_${mIdx}_${Date.now()}`),
        name: mObj.name || "Merchant",
        logoUrl: mObj.logoUrl || undefined,
        logoDarkUrl: mObj.logoDarkUrl || undefined,
        subMerchants: existingSubs
          .map((s: string) => String(s).trim().toUpperCase())
          .filter(Boolean),
      };
    });

    return {
      ...cat,
      id: String(cat.id || catIdx + 1),
      apiCategoryName: cat.apiCategoryName || undefined,
      description: cat.description || undefined,
      iconType: cat.iconType || "image",
      iconName: cat.iconName || undefined,
      iconSrc: cat.iconSrc || undefined,
      color: cat.color || "blue",
      merchants: normalizedMerchants,
    };
  });
}

const normalizeForMatch = (text: string): string => {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const isMatch = (query: string, target: string): boolean => {
  if (!query || !target) return false;
  const qLower = query.toLowerCase().trim();
  const tLower = target.toLowerCase().trim();

  // 1. Direct lowercase substring check
  if (qLower.includes(tLower) || tLower.includes(qLower)) {
    return true;
  }

  // 2. Normalized alphanumeric check
  const qNorm = normalizeForMatch(qLower);
  const tNorm = normalizeForMatch(tLower);
  if (qNorm && tNorm && (qNorm.includes(tNorm) || tNorm.includes(qNorm))) {
    return true;
  }

  return false;
};

export interface CategoryStoreState {
  categories: CategoryItem[];
  isLoading: boolean;
  activeCategoryId: string;
  mobileView: "categories" | "merchants";
  initCategories: () => void;
  setActiveCategoryId: (id: string) => void;
  setMobileView: (view: "categories" | "merchants") => void;
  addCategory: (item: Omit<CategoryItem, "id" | "merchants"> & { id?: string }) => string;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  addMerchant: (
    categoryId: string,
    merchantInput:
      | string
      | { id?: string; name: string; logoUrl?: string; logoDarkUrl?: string; subMerchants?: string[] }
  ) => { success: boolean; message: string; merchant?: MerchantItem };
  updateMerchant: (
    categoryId: string,
    merchantId: string,
    updates: { name: string; logoUrl?: string; logoDarkUrl?: string; subMerchants?: string[] }
  ) => { success: boolean; message: string };
  addSubMerchant: (
    categoryId: string,
    merchantId: string,
    subMerchantName: string
  ) => { success: boolean; message: string };
  removeSubMerchant: (
    categoryId: string,
    merchantId: string,
    subMerchantName: string
  ) => void;
  removeMerchant: (categoryId: string, merchantIdOrName: string) => void;
  moveMerchant: (
    merchantIdOrName: string,
    fromCategoryId: string,
    toCategoryId: string
  ) => void;
  matchMerchant: (merchantName: string) => MatchResult;
  resetToDefault: () => void;
}

export const useCategoryStore = create<CategoryStoreState>((set, get) => ({
  categories: [],
  isLoading: false,
  activeCategoryId: "",
  mobileView: "categories",

  initCategories: () => {
    if (typeof window === "undefined") return;

    // Bersihkan semua sisa cache kategori & merchant dari localStorage browser
    try {
      localStorage.removeItem("sakuin_merchant_categories_v3");
      localStorage.removeItem("sakuin_merchant_categories_v2");
      localStorage.removeItem("sakuin_merchant_categories_v1");
      localStorage.removeItem("sakuin_merchant_categories");
    } catch (_) {}

    set({ isLoading: true });

    // 100% murni fetch dari Supabase REST API
    categoryApi
      .getCategories()
      .then((data) => {
        if (Array.isArray(data)) {
          const normalized = normalizeCategoryList(data);
          const currentActive = get().activeCategoryId;
          const activeId = normalized.some((c) => c.id === currentActive)
            ? currentActive
            : (normalized[0]?.id || "");
          set({ categories: normalized, activeCategoryId: activeId, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      })
      .catch((err) => {
        console.warn("[CategoryStore] Gagal memuat kategori dari API Supabase:", err);
        set({ isLoading: false });
      });
  },

  setActiveCategoryId: (id) => set({ activeCategoryId: id }),

  setMobileView: (view) => set({ mobileView: view }),

  addCategory: (item) => {
    const { categories } = get();
    const numericIds = categories
      .map((c) => Number(c.id))
      .filter((n) => !isNaN(n));
    const nextNumericId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    const finalId = item.id && !isNaN(Number(item.id)) ? String(item.id) : String(nextNumericId);

    const newCategory: CategoryItem = {
      ...item,
      id: finalId,
      merchants: [],
    };

    const updated = [...categories, newCategory];
    set({ categories: updated, activeCategoryId: finalId });

    categoryApi.createCategory(newCategory).catch((err) => {
      console.warn("[CategoryStore] Gagal createCategory ke API:", err);
    });

    return finalId;
  },

  updateCategory: (id, updates) => {
    const updated = get().categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    set({ categories: updated });

    categoryApi.updateCategory(id, updates).catch((err) => {
      console.warn("[CategoryStore] Gagal updateCategory ke API:", err);
    });
  },

  deleteCategory: (id) => {
    const { categories, activeCategoryId } = get();
    const remaining = categories.filter((c) => c.id !== id);
    const nextActive = activeCategoryId === id
      ? (remaining.length > 0 ? remaining[0].id : "")
      : activeCategoryId;

    set({
      categories: remaining,
      activeCategoryId: nextActive,
      mobileView: remaining.length === 0 ? "categories" : get().mobileView,
    });

    categoryApi.deleteCategory(id).catch((err) => {
      console.warn("[CategoryStore] Gagal deleteCategory ke API:", err);
    });
  },

  addMerchant: (categoryId, merchantInput) => {
    const isString = typeof merchantInput === "string";
    const name = isString ? merchantInput.trim() : merchantInput.name.trim();
    const logoUrl = !isString ? merchantInput.logoUrl?.trim() : undefined;
    const logoDarkUrl = !isString ? merchantInput.logoDarkUrl?.trim() : undefined;
    const subMerchants = !isString && merchantInput.subMerchants
      ? merchantInput.subMerchants.map((s) => s.trim().toUpperCase()).filter(Boolean)
      : undefined;

    if (!name) {
      return { success: false, message: "Nama merchant tidak boleh kosong." };
    }

    const { categories } = get();
    for (const cat of categories) {
      const found = cat.merchants.find(
        (m) => m.name.toLowerCase() === name.toLowerCase()
      );
      if (found) {
        if (cat.id === categoryId) {
          return {
            success: false,
            message: `"${name}" sudah terdaftar di kategori ini.`,
          };
        } else {
          return {
            success: false,
            message: `"${name}" sudah ada di kategori "${cat.name}". Pindahkan merchant untuk mengganti kategori.`,
          };
        }
      }
    }

    const customId = !isString && merchantInput.id ? merchantInput.id : undefined;
    const newMerchant: MerchantItem = {
      id: customId || `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      logoUrl: logoUrl || undefined,
      logoDarkUrl: logoDarkUrl || undefined,
      subMerchants: subMerchants || [],
    };

    const updated = categories.map((c) =>
      c.id === categoryId ? { ...c, merchants: [newMerchant, ...c.merchants] } : c
    );

    set({ categories: updated });

    categoryApi.createMerchant(categoryId, newMerchant).catch((err) => {
      console.warn("[CategoryStore] Gagal createMerchant ke API:", err);
    });

    const activeCat = updated.find((c) => c.id === categoryId);
    return {
      success: true,
      message: `"${name}" berhasil ditambahkan ke kategori "${activeCat?.name || "terpilih"}".`,
      merchant: newMerchant,
    };
  },

  updateMerchant: (categoryId, merchantId, updates) => {
    const trimmedName = updates.name.trim();
    if (!trimmedName) {
      return { success: false, message: "Nama merchant tidak boleh kosong." };
    }

    const { categories } = get();
    for (const cat of categories) {
      const found = cat.merchants.find(
        (m) => m.id !== merchantId && m.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (found) {
        return {
          success: false,
          message: `Nama merchant "${trimmedName}" sudah digunakan di kategori "${cat.name}".`,
        };
      }
    }

    const nextSubs = updates.subMerchants
      ? updates.subMerchants.map((s) => s.trim().toUpperCase()).filter(Boolean)
      : undefined;

    const updated = categories.map((cat) => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        merchants: cat.merchants.map((m) =>
          m.id === merchantId
            ? {
                ...m,
                name: trimmedName,
                logoUrl: updates.logoUrl?.trim() || undefined,
                logoDarkUrl: updates.logoDarkUrl?.trim() || undefined,
                subMerchants: nextSubs !== undefined ? nextSubs : m.subMerchants,
              }
            : m
        ),
      };
    });

    set({ categories: updated });

    categoryApi
      .updateMerchant(merchantId, {
        name: trimmedName,
        logoUrl: updates.logoUrl?.trim() || undefined,
        logoDarkUrl: updates.logoDarkUrl?.trim() || undefined,
        subMerchants: nextSubs,
      })
      .catch((err) => {
        console.warn("[CategoryStore] Gagal updateMerchant ke API:", err);
      });

    return {
      success: true,
      message: `Merchant "${trimmedName}" berhasil diperbarui.`,
    };
  },

  addSubMerchant: (categoryId, merchantId, subMerchantName) => {
    const trimmed = subMerchantName.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: "Nama sub-merchant tidak boleh kosong." };
    }

    let updated = false;
    let nextSubs: string[] = [];

    const newCategories = get().categories.map((cat) => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        merchants: cat.merchants.map((m) => {
          if (m.id !== merchantId) return m;
          const currentSubs = m.subMerchants || [];
          if (currentSubs.some((s) => s.toUpperCase() === trimmed)) {
            return m;
          }
          updated = true;
          nextSubs = [...currentSubs, trimmed];
          return {
            ...m,
            subMerchants: nextSubs,
          };
        }),
      };
    });

    if (updated) {
      set({ categories: newCategories });

      categoryApi.updateMerchant(merchantId, { subMerchants: nextSubs }).catch((err) => {
        console.warn("[CategoryStore] Gagal addSubMerchant ke API:", err);
      });

      return { success: true, message: `Sub-merchant "${trimmed}" berhasil ditambahkan.` };
    }

    return { success: false, message: `Sub-merchant "${trimmed}" sudah terdaftar.` };
  },

  removeSubMerchant: (categoryId, merchantId, subMerchantName) => {
    let nextSubs: string[] = [];
    const updated = get().categories.map((cat) => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        merchants: cat.merchants.map((m) => {
          if (m.id !== merchantId) return m;
          nextSubs = (m.subMerchants || []).filter(
            (s) => s.toLowerCase() !== subMerchantName.toLowerCase()
          );
          return {
            ...m,
            subMerchants: nextSubs,
          };
        }),
      };
    });

    set({ categories: updated });

    categoryApi.updateMerchant(merchantId, { subMerchants: nextSubs }).catch((err) => {
      console.warn("[CategoryStore] Gagal removeSubMerchant ke API:", err);
    });
  },

  removeMerchant: (categoryId, merchantIdOrName) => {
    let targetMerchantId = merchantIdOrName;
    const cat = get().categories.find((c) => c.id === categoryId);
    if (cat) {
      const found = cat.merchants.find(
        (m) =>
          m.id === merchantIdOrName ||
          m.name.toLowerCase() === merchantIdOrName.toLowerCase()
      );
      if (found) targetMerchantId = found.id;
    }

    const updated = get().categories.map((c) =>
      c.id === categoryId
        ? {
            ...c,
            merchants: c.merchants.filter(
              (m) =>
                m.id !== merchantIdOrName &&
                m.name.toLowerCase() !== merchantIdOrName.toLowerCase()
            ),
          }
        : c
    );

    set({ categories: updated });

    categoryApi.deleteMerchant(targetMerchantId).catch((err) => {
      console.warn("[CategoryStore] Gagal deleteMerchant ke API:", err);
    });
  },

  moveMerchant: (merchantIdOrName, fromCategoryId, toCategoryId) => {
    if (fromCategoryId === toCategoryId) return;

    let targetItem: MerchantItem | undefined;
    const { categories } = get();
    const sourceCat = categories.find((c) => c.id === fromCategoryId);
    if (sourceCat) {
      targetItem = sourceCat.merchants.find(
        (m) =>
          m.id === merchantIdOrName ||
          m.name.toLowerCase() === merchantIdOrName.toLowerCase()
      );
    }

    if (!targetItem) return;

    const updated = categories.map((c) => {
      if (c.id === fromCategoryId) {
        return {
          ...c,
          merchants: c.merchants.filter((m) => m.id !== targetItem!.id),
        };
      }
      if (c.id === toCategoryId) {
        return {
          ...c,
          merchants: [targetItem!, ...c.merchants],
        };
      }
      return c;
    });

    set({ categories: updated });

    categoryApi.updateMerchant(targetItem.id, { categoryId: toCategoryId }).catch((err) => {
      console.warn("[CategoryStore] Gagal moveMerchant ke API:", err);
    });
  },

  matchMerchant: (merchantQuery: string): MatchResult => {
    if (!merchantQuery || !merchantQuery.trim()) {
      return { category: null, exactMatch: null, merchant: null, matchedBy: null };
    }
    const cleanQuery = merchantQuery.trim();
    const { categories } = get();

    // First pass: Match sub-merchants / aliases
    for (const cat of categories) {
      for (const m of cat.merchants) {
        if (m.subMerchants && m.subMerchants.length > 0) {
          for (const sub of m.subMerchants) {
            if (isMatch(cleanQuery, sub)) {
              return {
                category: cat,
                exactMatch: m.name,
                merchant: m,
                matchedBy: "sub_merchant",
                matchedSubMerchant: sub,
              };
            }
          }
        }
      }
    }

    // Second pass: Match primary merchant name
    for (const cat of categories) {
      for (const m of cat.merchants) {
        if (isMatch(cleanQuery, m.name)) {
          return {
            category: cat,
            exactMatch: m.name,
            merchant: m,
            matchedBy: "merchant_name",
          };
        }
      }
    }

    return { category: null, exactMatch: null, merchant: null, matchedBy: null };
  },

  resetToDefault: () => {
    set({ isLoading: true });
    categoryApi
      .getCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const normalized = normalizeCategoryList(data);
          const firstId = normalized[0].id;
          set({ categories: normalized, activeCategoryId: firstId, isLoading: false });
        } else {
          set({
            categories: [],
            activeCategoryId: "",
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        console.error("Gagal menyinkronkan kategori dari database:", err);
        set({
          categories: [],
          activeCategoryId: "",
          isLoading: false,
        });
      });
  },
}));

// Backward compatibility useCategory hook powered directly by Zustand store
export const useCategory = () => {
  const store = useCategoryStore();
  const activeCategory =
    store.categories.find((c) => c.id === store.activeCategoryId) ||
    (store.categories.length > 0 ? store.categories[0] : null);

  const totalMerchantsCount = store.categories.reduce(
    (acc, curr) => acc + (curr.merchants?.length || 0),
    0
  );

  return {
    ...store,
    activeCategory,
    totalMerchantsCount,
  };
};

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const CategoryContext = createContext<any>(undefined);
export default useCategoryStore;
