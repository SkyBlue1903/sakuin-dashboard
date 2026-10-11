"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { categoryApi } from "@/lib/api/categoryApi";

export interface MerchantItem {
  id: string;
  name: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  subMerchants?: string[];
}

export interface CategoryItem {
  id: string;
  name: string; // Nama Kategori di Sakuin.id
  apiCategoryName?: string; // Nama Kategori Respon API
  description?: string;
  iconType: "lucide" | "image";
  iconName?: string;
  iconSrc?: string;
  color: string;
  merchants: MerchantItem[];
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [];

const STORAGE_KEY = "sakuin_merchant_categories_v2";

// Helper to normalize merchants from Supabase/cache
function normalizeCategoryList(rawCats: any[]): CategoryItem[] {
  if (!Array.isArray(rawCats)) return [];

  return rawCats.map((cat, catIdx) => {
    const rawMerchants = Array.isArray(cat.merchants) ? cat.merchants : [];
    const normalizedMerchants: MerchantItem[] = rawMerchants.map((m: any, mIdx: number) => {
      if (typeof m === "string") {
        return {
          id: String(mIdx + 1),
          name: m,
          subMerchants: [],
        };
      }
      const existingSubs = Array.isArray(m.subMerchants) ? m.subMerchants : [];
      return {
        id: String(m.id || mIdx + 1),
        name: m.name || "Merchant",
        logoUrl: m.logoUrl || undefined,
        logoDarkUrl: m.logoDarkUrl || undefined,
        subMerchants: existingSubs
          .map((s: string) => String(s).trim().toUpperCase())
          .filter(Boolean),
      };
    });

    return {
      ...cat,
      id: String(cat.id || catIdx + 1),
      apiCategoryName: cat.apiCategoryName || undefined,
      merchants: normalizedMerchants,
    };
  });
}

export interface MatchResult {
  category: CategoryItem | null;
  exactMatch: string | null;
  merchant: MerchantItem | null;
  matchedBy: "merchant_name" | "sub_merchant" | null;
  matchedSubMerchant?: string;
}

interface CategoryContextType {
  categories: CategoryItem[];
  isLoading: boolean;
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
  activeCategory: CategoryItem | null;
  mobileView: "categories" | "merchants";
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
  totalMerchantsCount: number;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Helper to clean punctuation, dashes, spaces for flexible fuzzy case-insensitive matching
const normalizeForMatch = (text: string): string => {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
};

// Check if query matches a target (case-insensitive, substring, word boundary, or punctuation-stripped)
const isMatch = (query: string, target: string): boolean => {
  const qLower = query.toLowerCase().trim();
  const tLower = target.toLowerCase().trim();
  if (!qLower || !tLower) return false;

  // 1. Direct lowercase equality or inclusion (e.g. "QRIS MCD DRIVE THRU".includes("mcd"))
  if (qLower === tLower || qLower.includes(tLower) || tLower.includes(qLower)) {
    return true;
  }

  // 2. Normalized alphanumeric check (e.g. "Hk Hk Bnt" -> "hkhkbnt", "Hoka-Hoka Bento" -> "hokahokabento", "McDonald's" -> "mcdonalds")
  const qNorm = normalizeForMatch(qLower);
  const tNorm = normalizeForMatch(tLower);
  if (qNorm && tNorm && (qNorm.includes(tNorm) || tNorm.includes(qNorm))) {
    return true;
  }

  return false;
};

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          return normalizeCategoryList(parsed);
        }
      } catch (err) {
        console.error("Failed to load categories from localStorage", err);
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [activeCategoryId, setActiveCategoryId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return String(parsed[0].id);
          }
        }
      } catch {
        // fallback
      }
    }
    return "";
  });
  const [mobileView, setMobileView] = useState<"categories" | "merchants">("categories");

  // Load kategori dari REST API Supabase saat mount
  useEffect(() => {
    let isMounted = true;
    categoryApi
      .getCategories()
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            const normalized = normalizeCategoryList(data);
            setCategories(normalized);
            if (normalized.length > 0) {
              setActiveCategoryId((prev) =>
                prev && normalized.some((c) => c.id === prev) ? prev : normalized[0].id
              );
            }
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("[CategoryContext] Gagal memuat kategori dari API:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage sebagai offline cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (err) {
      console.error("Failed to save categories to localStorage", err);
    }
  }, [categories]);

  // Keep mobile view on categories if no category exists
  useEffect(() => {
    if (categories.length === 0 && mobileView !== "categories") {
      setMobileView("categories");
    }
  }, [categories.length, mobileView]);

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) ||
    (categories.length > 0 ? categories[0] : null);

  const totalMerchantsCount = categories.reduce(
    (acc, curr) => acc + (curr.merchants?.length || 0),
    0
  );

  const syncCategoryMerchantsToApi = (categoryId: string, merchants: MerchantItem[]) => {
    categoryApi.updateCategory(categoryId, { merchants }).catch((err) => {
      console.warn(`[CategoryContext] Gagal sinkronisasi merchant untuk ${categoryId}:`, err);
    });
  };

  const addCategory = (item: Omit<CategoryItem, "id" | "merchants"> & { id?: string }) => {
    // Generate next incremental numeric ID
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
    setCategories((prev) => [...prev, newCategory]);
    setActiveCategoryId(finalId);

    // Sync ke REST API
    categoryApi.createCategory(newCategory).catch((err) => {
      console.warn("[CategoryContext] Gagal sinkronisasi createCategory:", err);
    });

    return finalId;
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    // Sync ke REST API
    categoryApi.updateCategory(id, updates).catch((err) => {
      console.warn("[CategoryContext] Gagal sinkronisasi updateCategory:", err);
    });
  };

  const deleteCategory = (id: string) => {
    const remaining = categories.filter((c) => c.id !== id);
    setCategories(remaining);
    if (remaining.length === 0) {
      setMobileView("categories");
      setActiveCategoryId("");
    } else if (activeCategoryId === id) {
      setActiveCategoryId(remaining[0].id);
    }

    // Sync ke REST API
    categoryApi.deleteCategory(id).catch((err) => {
      console.warn("[CategoryContext] Gagal sinkronisasi deleteCategory:", err);
    });
  };

  const addMerchant = (
    categoryId: string,
    merchantInput:
      | string
      | { id?: string; name: string; logoUrl?: string; logoDarkUrl?: string; subMerchants?: string[] }
  ) => {
    const name = typeof merchantInput === "string" ? merchantInput.trim() : merchantInput.name.trim();
    const rawId = typeof merchantInput === "object" ? merchantInput.id?.trim() : undefined;
    const logoUrl = typeof merchantInput === "object" ? merchantInput.logoUrl?.trim() : undefined;
    const logoDarkUrl = typeof merchantInput === "object" ? merchantInput.logoDarkUrl?.trim() : undefined;
    const subMerchants =
      typeof merchantInput === "object" && merchantInput.subMerchants
        ? merchantInput.subMerchants.map((s) => s.trim().toUpperCase()).filter(Boolean)
        : undefined;

    if (!name) {
      return { success: false, message: "Nama merchant tidak boleh kosong." };
    }

    // Check if already registered in any category
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

    // Generate next incremental numeric ID across all merchants
    const allNumericMerchantIds = categories
      .flatMap((c) => c.merchants.map((m) => Number(m.id)))
      .filter((n) => !isNaN(n));
    const nextNumericMerchantId = allNumericMerchantIds.length > 0
      ? Math.max(...allNumericMerchantIds) + 1
      : 1;
    const finalMerchantId = rawId && !isNaN(Number(rawId))
      ? String(rawId)
      : String(nextNumericMerchantId);

    const newMerchant: MerchantItem = {
      id: finalMerchantId,
      name,
      logoUrl: logoUrl || undefined,
      logoDarkUrl: logoDarkUrl || undefined,
      subMerchants: subMerchants || [],
    };

    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, merchants: [newMerchant, ...c.merchants] } : c
      )
    );

    // Kirim hanya 1 merchant baru ke API (sangat hemat bandwidth)
    categoryApi.createMerchant(categoryId, newMerchant).catch((err) => {
      console.warn("[CategoryContext] Gagal createMerchant ke API:", err);
    });

    return {
      success: true,
      message: `"${name}" berhasil ditambahkan ke kategori "${activeCategory?.name || "terpilih"}".`,
      merchant: newMerchant,
    };
  };

  const updateMerchant = (
    categoryId: string,
    merchantId: string,
    updates: { name: string; logoUrl?: string; logoDarkUrl?: string; subMerchants?: string[] }
  ) => {
    const trimmedName = updates.name.trim();
    if (!trimmedName) {
      return { success: false, message: "Nama merchant tidak boleh kosong." };
    }

    // Check conflict with other merchants
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

    setCategories((prev) =>
      prev.map((cat) => {
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
                  subMerchants: updates.subMerchants
                    ? updates.subMerchants.map((s) => s.trim().toUpperCase()).filter(Boolean)
                    : m.subMerchants,
                }
              : m
          ),
        };
      })
    );

    // Kirim hanya perubahan data merchant ini saja
    categoryApi
      .updateMerchant(merchantId, {
        name: trimmedName,
        logoUrl: updates.logoUrl?.trim() || undefined,
        logoDarkUrl: updates.logoDarkUrl?.trim() || undefined,
        subMerchants: updates.subMerchants
          ? updates.subMerchants.map((s) => s.trim().toUpperCase()).filter(Boolean)
          : undefined,
      })
      .catch((err) => {
        console.warn("[CategoryContext] Gagal updateMerchant ke API:", err);
      });

    return {
      success: true,
      message: `Merchant "${trimmedName}" berhasil diperbarui.`,
    };
  };

  const addSubMerchant = (
    categoryId: string,
    merchantId: string,
    subMerchantName: string
  ) => {
    const trimmed = subMerchantName.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: "Nama sub-merchant tidak boleh kosong." };
    }

    let updated = false;
    let nextSubs: string[] = [];
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          merchants: cat.merchants.map((m) => {
            if (m.id !== merchantId) return m;
            const currentSubs = m.subMerchants || [];
            if (currentSubs.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
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
      })
    );

    if (updated) {
      categoryApi.updateMerchant(merchantId, { subMerchants: nextSubs }).catch((err) => {
        console.warn("[CategoryContext] Gagal addSubMerchant ke API:", err);
      });
    }

    return updated
      ? { success: true, message: `Sub-merchant "${trimmed}" berhasil ditambahkan.` }
      : { success: false, message: `Sub-merchant "${trimmed}" sudah terdaftar.` };
  };

  const removeSubMerchant = (
    categoryId: string,
    merchantId: string,
    subMerchantName: string
  ) => {
    let nextSubs: string[] = [];
    setCategories((prev) =>
      prev.map((cat) => {
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
      })
    );

    categoryApi.updateMerchant(merchantId, { subMerchants: nextSubs }).catch((err) => {
      console.warn("[CategoryContext] Gagal removeSubMerchant ke API:", err);
    });
  };

  const removeMerchant = (categoryId: string, merchantIdOrName: string) => {
    let targetMerchantId = merchantIdOrName;
    const cat = categories.find((c) => c.id === categoryId);
    if (cat) {
      const found = cat.merchants.find(
        (m) =>
          m.id === merchantIdOrName ||
          m.name.toLowerCase() === merchantIdOrName.toLowerCase()
      );
      if (found) targetMerchantId = found.id;
    }

    setCategories((prev) =>
      prev.map((c) =>
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
      )
    );

    categoryApi.deleteMerchant(targetMerchantId).catch((err) => {
      console.warn("[CategoryContext] Gagal deleteMerchant ke API:", err);
    });
  };

  const moveMerchant = (
    merchantIdOrName: string,
    fromCategoryId: string,
    toCategoryId: string
  ) => {
    if (fromCategoryId === toCategoryId) return;

    let targetItem: MerchantItem | undefined;

    setCategories((prev) => {
      const sourceCat = prev.find((c) => c.id === fromCategoryId);
      if (sourceCat) {
        targetItem = sourceCat.merchants.find(
          (m) =>
            m.id === merchantIdOrName ||
            m.name.toLowerCase() === merchantIdOrName.toLowerCase()
        );
      }

      if (!targetItem) return prev;

      return prev.map((c) => {
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
    });

    if (targetItem) {
      categoryApi.updateMerchant(targetItem.id, { categoryId: toCategoryId }).catch((err) => {
        console.warn("[CategoryContext] Gagal moveMerchant ke API:", err);
      });
    }
  };



  // Rule match tester: matches a raw API merchant name to known merchant mappings
  const matchMerchant = (merchantQuery: string): MatchResult => {
    if (!merchantQuery || !merchantQuery.trim()) {
      return { category: null, exactMatch: null, merchant: null, matchedBy: null };
    }
    const cleanQuery = merchantQuery.trim();

    // First pass: Match sub-merchants / aliases (highest specificity, handles abbreviations like MCD, HHB, Hk Hk Bnt)
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
  };

  const resetToDefault = () => {
    setIsLoading(true);
    categoryApi
      .getCategories()
      .then((data) => {
        const normalized = normalizeCategoryList(data);
        setCategories(normalized);
        if (normalized.length > 0) {
          setActiveCategoryId((prev) =>
            prev && normalized.some((c) => c.id === prev) ? prev : normalized[0].id
          );
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch (_) {}
      })
      .catch((err) => {
        console.error("Gagal menyinkronkan kategori dari database:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        isLoading,
        activeCategoryId,
        setActiveCategoryId,
        activeCategory,
        mobileView,
        setMobileView,
        addCategory,
        updateCategory,
        deleteCategory,
        addMerchant,
        updateMerchant,
        addSubMerchant,
        removeSubMerchant,
        removeMerchant,
        moveMerchant,
        matchMerchant,
        resetToDefault,
        totalMerchantsCount,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export default CategoryContext;

