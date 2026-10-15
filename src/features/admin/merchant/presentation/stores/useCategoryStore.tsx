"use client";

import React, { createContext } from "react";
import { create } from "zustand";
import { categoryApi } from "@/features/admin/merchant/data/categoryApi";
import { emitToast } from "@/shared/presentation/stores/ToastContext";
import type { CategoryItem, MerchantItem, MatchResult } from "@/features/admin/merchant/domain/category";

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
  id: "1",
  name,
  logoUrl: logoUrl || undefined,
  logoDarkUrl: logoDarkUrl || undefined,
  subMerchants: subMerchants || [],
});

// Helper to normalize merchants (supporting both API Supabase and local cache/defaults)
export function normalizeCategoryList(rawCats: unknown[]): CategoryItem[] {
  if (!Array.isArray(rawCats)) return [];

  return (rawCats as Record<string, unknown>[]).map((cat, catIdx) => {
    const rawMerchants = Array.isArray(cat.merchants) ? (cat.merchants as unknown[]) : [];
    const normalizedMerchants: MerchantItem[] = rawMerchants.map((m: unknown, mIdx: number) => {
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
        id: String(mObj.id || `${catIdx * 100 + mIdx + 1}`),
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
      name: String(cat.name || `Kategori ${catIdx + 1}`),
      apiCategoryName: typeof cat.apiCategoryName === "string" ? cat.apiCategoryName : undefined,
      description: typeof cat.description === "string" ? cat.description : undefined,
      iconType: (cat.iconType as "lucide" | "image") || "image",
      iconName: typeof cat.iconName === "string" ? cat.iconName : undefined,
      iconSrc: typeof cat.iconSrc === "string" ? cat.iconSrc : undefined,
      color: typeof cat.color === "string" ? cat.color : "blue",
      merchants: normalizedMerchants,
    } as CategoryItem;
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
      const errDetail = err instanceof Error ? err.message : "Gagal menyimpan kategori ke database";
      console.error("[CategoryStore] Gagal createCategory ke API:", errDetail);
      // Rollback
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== finalId),
      }));
      emitToast(`Gagal menyimpan kategori "${item.name}": ${errDetail}`, "error");
    });

    return finalId;
  },

  updateCategory: (id, updates) => {
    const previousCategories = get().categories;
    const updated = previousCategories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    set({ categories: updated });

    categoryApi.updateCategory(id, updates).catch((err) => {
      const errDetail = err instanceof Error ? err.message : "Gagal memperbarui kategori di database";
      console.error("[CategoryStore] Gagal updateCategory ke API:", errDetail);
      // Rollback
      set({ categories: previousCategories });
      emitToast(`Gagal memperbarui kategori: ${errDetail}`, "error");
    });
  },

  deleteCategory: (id) => {
    const previousCategories = get().categories;
    const previousActive = get().activeCategoryId;
    const remaining = previousCategories.filter((c) => c.id !== id);
    const nextActive = previousActive === id
      ? (remaining.length > 0 ? remaining[0].id : "")
      : previousActive;

    set({
      categories: remaining,
      activeCategoryId: nextActive,
      mobileView: remaining.length === 0 ? "categories" : get().mobileView,
    });

    categoryApi.deleteCategory(id).catch((err) => {
      const errDetail = err instanceof Error ? err.message : "Gagal menghapus kategori dari database";
      console.error("[CategoryStore] Gagal deleteCategory ke API:", errDetail);
      // Rollback
      set({ categories: previousCategories, activeCategoryId: previousActive });
      emitToast(`Gagal menghapus kategori: ${errDetail}`, "error");
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

    // Hitung ID numerik incremental berikutnya secara optimis dari seluruh kategori
    let nextNumericId = 1;
    for (const cat of categories) {
      for (const m of cat.merchants) {
        const num = Number(m.id);
        if (!isNaN(num) && num >= nextNumericId) {
          nextNumericId = num + 1;
        }
      }
    }

    const customId = !isString && merchantInput.id && !isNaN(Number(merchantInput.id))
      ? String(merchantInput.id)
      : undefined;
    const finalId = customId || String(nextNumericId);

    const newMerchant: MerchantItem = {
      id: finalId,
      name,
      logoUrl: logoUrl || undefined,
      logoDarkUrl: logoDarkUrl || undefined,
      subMerchants: subMerchants || [],
    };

    const updated = categories.map((c) =>
      c.id === categoryId ? { ...c, merchants: [newMerchant, ...c.merchants] } : c
    );

    set({ categories: updated });

    categoryApi
      .createMerchant(categoryId, newMerchant)
      .then((savedMerchant) => {
        if (savedMerchant && savedMerchant.id) {
          // Sinkronisasikan ID jika berbeda dari ID optimis
          set((state) => ({
            categories: state.categories.map((c) =>
              c.id === categoryId
                ? {
                    ...c,
                    merchants: c.merchants.map((m) =>
                      m.id === finalId ? { ...m, ...savedMerchant, id: String(savedMerchant.id) } : m
                    ),
                  }
                : c
            ),
          }));
        }
      })
      .catch((err) => {
        const errDetail = err instanceof Error ? err.message : "Gagal menyimpan merchant ke Supabase";
        console.error("[CategoryStore] Gagal createMerchant ke Supabase:", errDetail);
        // Rollback state jika gagal menyimpan ke server
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  merchants: c.merchants.filter((m) => m.id !== finalId),
                }
              : c
          ),
        }));
        emitToast(`Gagal menyimpan merchant "${name}": ${errDetail}`, "error");
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

    const previousCategories = categories;
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
        const errDetail = err instanceof Error ? err.message : "Gagal memperbarui merchant di database";
        console.error("[CategoryStore] Gagal updateMerchant ke API:", errDetail);
        set({ categories: previousCategories });
        emitToast(`Gagal memperbarui merchant "${trimmedName}": ${errDetail}`, "error");
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

    const previousCategories = get().categories;
    const newCategories = previousCategories.map((cat) => {
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
        const errDetail = err instanceof Error ? err.message : "Gagal menyimpan alias ke database";
        console.error("[CategoryStore] Gagal addSubMerchant ke API:", errDetail);
        set({ categories: previousCategories });
        emitToast(`Gagal menambahkan alias "${trimmed}": ${errDetail}`, "error");
      });

      return { success: true, message: `Sub-merchant "${trimmed}" berhasil ditambahkan.` };
    }

    return { success: false, message: `Sub-merchant "${trimmed}" sudah terdaftar.` };
  },

  removeSubMerchant: (categoryId, merchantId, subMerchantName) => {
    let nextSubs: string[] = [];
    const previousCategories = get().categories;
    const updated = previousCategories.map((cat) => {
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
      const errDetail = err instanceof Error ? err.message : "Gagal menghapus alias dari database";
      console.error("[CategoryStore] Gagal removeSubMerchant ke API:", errDetail);
      set({ categories: previousCategories });
      emitToast(`Gagal menghapus alias "${subMerchantName}": ${errDetail}`, "error");
    });
  },

  removeMerchant: (categoryId, merchantIdOrName) => {
    let targetMerchantId = merchantIdOrName;
    const previousCategories = get().categories;
    const cat = previousCategories.find((c) => c.id === categoryId);
    if (cat) {
      const found = cat.merchants.find(
        (m) =>
          m.id === merchantIdOrName ||
          m.name.toLowerCase() === merchantIdOrName.toLowerCase()
      );
      if (found) targetMerchantId = found.id;
    }

    const updated = previousCategories.map((c) =>
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
      const errDetail = err instanceof Error ? err.message : "Gagal menghapus merchant dari database";
      console.error("[CategoryStore] Gagal deleteMerchant ke API:", errDetail);
      set({ categories: previousCategories });
      emitToast(`Gagal menghapus merchant dari database: ${errDetail}`, "error");
    });
  },

  moveMerchant: (merchantIdOrName, fromCategoryId, toCategoryId) => {
    if (fromCategoryId === toCategoryId) return;

    let targetItem: MerchantItem | undefined;
    const previousCategories = get().categories;
    const sourceCat = previousCategories.find((c) => c.id === fromCategoryId);
    if (sourceCat) {
      targetItem = sourceCat.merchants.find(
        (m) =>
          m.id === merchantIdOrName ||
          m.name.toLowerCase() === merchantIdOrName.toLowerCase()
      );
    }

    if (!targetItem) return;

    const updated = previousCategories.map((c) => {
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
      const errDetail = err instanceof Error ? err.message : "Gagal memindahkan merchant di database";
      console.error("[CategoryStore] Gagal moveMerchant ke API:", errDetail);
      set({ categories: previousCategories });
      emitToast(`Gagal memindahkan merchant: ${errDetail}`, "error");
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

export const CategoryContext = createContext<unknown>(undefined);
export default useCategoryStore;
