"use client";

import React, { createContext } from "react";
import { create } from "zustand";
import { categoryApi } from "@/services/categoryApi";
import type { CategoryItem, MerchantItem, MatchResult } from "@/models/category";

export type { CategoryItem, MerchantItem, MatchResult };

export const DEFAULT_SUB_MERCHANTS: Record<string, string[]> = {
  // Makanan & Minuman
  "mcdonald's": ["MCD", "Mekdi", "Mcdonald", "McDonalds", "McDonald's", "PT Rekso Nasional Food"],
  "hokben": ["HHB", "HokBen", "Hoka-Hoka Bento", "Hk Hk Bnt", "Hoka Hoka Bento", "PT Eka Bogainti"],
  "kfc indonesia": ["KFC", "KENTUCKY FRIED CHICKEN", "FAST FOOD INDONESIA", "PT Fast Food Indonesia"],
  "gofood": ["GOFOOD", "GO-FOOD", "GO FOOD", "GOPAY FOOD"],
  "grabfood": ["GRABFOOD", "GRAB-FOOD", "GRAB FOOD", "OVO FOOD"],
  "kopi kenangan": ["KENANGAN", "KOPI KENANGAN", "KENANGAN COFFEE", "PT Bumi Berkah Boga"],
  "starbucks": ["SBX", "SBUX", "STARBUCKS", "STARBUCKS COFFEE", "PT Sari Coffee Indonesia"],
  "fore coffee": ["FORE", "FORE COFFEE", "PT Fore Kopi Indonesia"],
  "chatime": ["CHATIME", "CHATIME INDONESIA", "PT Foods Active"],
  "mixue": ["MIXUE", "MIXUE ICE CREAM", "MIXUE INDONESIA"],
  "janji jiwa": ["JIWA", "JANJI JIWA", "KOPI JANJI JIWA"],

  // Belanja & Retail
  "alfamart": ["ALFA", "ALFAMART", "ALFAMIDI", "ALFA MIDI", "SAT ALFAMART", "PT Sumber Alfaria Trijaya"],
  "indomaret": ["IDM", "INDOMARET", "INDOMARCO", "INDOMARET POINT", "PT Indomarco Prismatama"],
  "tokopedia": ["TOPED", "TOKOPEDIA", "TKPD", "PT Tokopedia"],
  "shopee": ["SHOPEE", "SHOPEEPAY", "SPAY", "PT Shopee International"],
  "superindo": ["SUPERINDO", "SUPER INDO", "LION SUPER INDO"],
  "uniqlo": ["UNIQLO", "FAST RETAILING"],
  "zara": ["ZARA", "INDITEX"],
  "ace hardware": ["ACE", "ACE HARDWARE", "PT Aspirasi Hidup Indonesia"],
  "hypermart": ["HYPERMART", "MPPA"],
  "blibli": ["BLIBLI", "GLOBAL DIGITAL NIAGA"],

  // Transportasi
  "pertamina": ["SPBU", "PERTAMINA", "MYPERTAMINA", "SPBU PERTAMINA", "PT Pertamina Retail"],
  "shell": ["SHELL", "SPBU SHELL", "SHELL SELECT", "PT Shell Indonesia"],
  "gojek": ["GOJEK", "GO-JEK", "GOPAY", "PT GoTo Gojek Tokopedia"],
  "grab": ["GRAB", "GRABCAR", "GRABBIKE", "GRAB INDONESIA"],
  "bluebird": ["BLUEBIRD", "BLUE BIRD", "TAKSI BLUE BIRD"],
  "garuda indonesia": ["GARUDA", "GIA", "GARUDA INDONESIA"],
  "tiket.com": ["TIKET", "TIKET.COM", "GLOBAL TIKET NETWORK"],

  // Tech & IT
  "github copilot": ["GITHUB", "GITHUB INC", "COPILOT", "GITHUB COPILOT"],
  "vercel pro team": ["VERCEL", "VERCEL INC"],
  "cursor ai": ["CURSOR", "CURSOR AI", "ANYSWERE"],
  "aws cloud": ["AWS", "AMAZON WEB SERVICES", "AWS CLOUD"],
  "cloudflare": ["CLOUDFLARE", "NET DIVER"],
  "digitalocean": ["DIGITALOCEAN", "DO CLOUD"],

  // AI & Productivity
  "chatgpt plus subscription": ["OPENAI", "CHATGPT", "OPENAI CHATGPT", "CHATGPT PLUS"],
  "claude pro": ["CLAUDE", "ANTHROPIC", "CLAUDE AI", "CLAUDE PRO"],
  "notion ai": ["NOTION", "NOTION LABS"],
  "canva pro": ["CANVA", "CANVA PTY LTD"],
  "figma professional": ["FIGMA", "FIGMA DESIGN"],
  "midjourney": ["MIDJOURNEY", "MIDJOURNEY INC", "MIDJOURNEY SUBSCRIPTION", "MJ"],

  // Hiburan
  "spotify premium": ["SPOTIFY", "SPOTIFY AB", "SPOTIFY P12", "SPOTIFY PREMIUM"],
  "netflix": ["NETFLIX", "NETFLIX.COM", "NETFLIX SERVICES", "NETFLIX INTERNET"],
  "youtube premium": ["GOOGLE YOUTUBE", "YOUTUBE", "YT PREMIUM", "GOOGLE *YOUTUBE"],
  "disney+ hotstar": ["DISNEY", "HOTSTAR", "DISNEY+"],
  "steam games": ["STEAMGAMES", "STEAM", "VALVE", "STEAM PURCHASE"],
  "playstation network": ["PSN", "PLAYSTATION", "SONY INTERACTIVE"],

  // Tagihan
  "pln pascabayar": ["PLN", "TOKEN PLN", "LISTRIK PLN", "PLN PERSERO"],
  "telkomsel halo": ["TELKOMSEL", "KARTU HALO", "MYTELKOMSEL", "TELKOMSEL HALO"],
  "bpjs kesehatan": ["BPJS", "BPJS KESEHATAN", "IURAN BPJS"],

  // Kesehatan
  "halodoc": ["HALODOC", "PT Media Dokter Investama", "HALO DOC"],
  "apotek kimia farma": ["KIMIA FARMA", "KF APOTEK"],
  "k24 klik": ["K24", "APOTEK K-24"],
  "guardian": ["GUARDIAN", "HERO GROUP"],
};

export const DEFAULT_MERCHANT_LOGOS: Record<string, string> = {
  // Belanja & Retail
  "alfamart": "https://upload.wikimedia.org/wikipedia/commons/8/86/Alfamart_logo.svg",
  "indomaret": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Indomaret.png",
  "tokopedia": "https://assets.tokopedia.net/assets-tokopedia-lite/v2/zeus/kratos/610e518b.png",
  "shopee": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg",
  "superindo": "https://upload.wikimedia.org/wikipedia/id/thumb/7/7b/Super_Indo_Logo.svg/1200px-Super_Indo_Logo.svg.png",
  "uniqlo": "https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg",
  "zara": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg",
  "ace hardware": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Ace_Hardware_logo.svg",
  "hypermart": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Blibli_logo.svg/1200px-Blibli_logo.svg.png",
  "blibli": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Blibli_logo.svg/1200px-Blibli_logo.svg.png",

  // Makanan & Minuman
  "gofood": "https://upload.wikimedia.org/wikipedia/commons/8/82/Gojek_logo_2019.svg",
  "grabfood": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Grab_logo_2019.svg",
  "kopi kenangan": "https://kopikenangan.com/wp-content/uploads/2021/04/Logo-Kopi-Kenangan.png",
  "starbucks": "https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg",
  "starbucks coffee": "https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg",
  "fore coffee": "https://fore.coffee/wp-content/uploads/2021/07/fore-logo-green.png",
  "chatime": "https://upload.wikimedia.org/wikipedia/en/b/b4/Chatime_logo.svg",
  "mcdonald's": "https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg",
  "kfc indonesia": "https://upload.wikimedia.org/wikipedia/en/b/bf/KFC_logo.svg",
  "mixue": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Mixue_Bingcheng_logo.svg/1200px-Mixue_Bingcheng_logo.svg.png",

  // Transportasi
  "pertamina": "https://upload.wikimedia.org/wikipedia/commons/2/26/Pertamina_Logo.svg",
  "shell": "https://upload.wikimedia.org/wikipedia/en/e/e8/Shell_logo.svg",
  "gojek": "https://upload.wikimedia.org/wikipedia/commons/8/82/Gojek_logo_2019.svg",
  "grab": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Grab_logo_2019.svg",
  "bluebird": "https://upload.wikimedia.org/wikipedia/commons/8/88/Blue_Bird_Group.svg",
  "garuda indonesia": "https://upload.wikimedia.org/wikipedia/en/6/6d/Garuda_Indonesia_Logo.svg",
  "tiket.com": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Logo_tiket.com.svg/1200px-Logo_tiket.com.svg.png",

  // Tech & IT
  "github copilot": "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
  "vercel pro team": "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
  "cursor ai": "https://www.cursor.com/assets/images/logo.svg",
  "aws cloud": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  "cloudflare": "https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.png",
  "digitalocean": "https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg",

  // AI & Productivity
  "chatgpt plus subscription": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  "claude pro": "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg",
  "notion ai": "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  "canva pro": "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
  "figma professional": "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  "midjourney": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",

  // Hiburan
  "spotify premium": "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  "netflix": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "youtube premium": "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
  "disney+ hotstar": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg",
  "steam games": "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
  "playstation network": "https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg",

  // Pendidikan
  "udemy": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg",
  "coursera": "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg",
  "ruangguru": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Logo_Ruangguru.svg/1200px-Logo_Ruangguru.svg.png",
  "gramedia": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Gramedia_logo.svg/1200px-Gramedia_logo.svg.png",

  // Tagihan
  "pln pascabayar": "https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_PLN.svg",
  "telkomsel halo": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Telkomsel_2021_icon.svg",
  "bpjs kesehatan": "https://upload.wikimedia.org/wikipedia/commons/b/b4/BPJS_Kesehatan_logo.svg",

  // Kesehatan
  "halodoc": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Halodoc_Logo.svg/1200px-Halodoc_Logo.svg.png",
  "apotek kimia farma": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Kimia_Farma_logo_2022.svg/1200px-Kimia_Farma_logo_2022.svg.png",
  "guardian": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Guardian_Pharmacy_Logo.svg/1200px-Guardian_Pharmacy_Logo.svg.png",
};

export const createMerchant = (
  name: string,
  logoUrl?: string,
  logoDarkUrl?: string,
  subMerchants?: string[]
): MerchantItem => ({
  id: `m_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
  name,
  logoUrl: logoUrl || DEFAULT_MERCHANT_LOGOS[name.toLowerCase()] || undefined,
  logoDarkUrl: logoDarkUrl || undefined,
  subMerchants: subMerchants || DEFAULT_SUB_MERCHANTS[name.toLowerCase()] || [],
});

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: "belanja",
    name: "Belanja & Retail",
    apiCategoryName: "RETAIL_GROCERY",
    description: "Minimarket, supermarket, e-commerce, & department store",
    iconType: "image",
    iconSrc: "/images/category/belanja.svg",
    color: "blue",
    merchants: [
      createMerchant("Alfamart"),
      createMerchant("Indomaret"),
      createMerchant("Tokopedia"),
      createMerchant("Shopee"),
      createMerchant("Superindo"),
      createMerchant("Uniqlo"),
      createMerchant("Zara"),
      createMerchant("Ace Hardware"),
      createMerchant("Hypermart"),
      createMerchant("Blibli"),
    ],
  },
  {
    id: "makanan",
    name: "Makanan & Minuman",
    apiCategoryName: "FOOD_AND_BEVERAGE",
    description: "Restoran, kafe, coffee shop, & pesan antar makanan",
    iconType: "image",
    iconSrc: "/images/category/makanan.svg",
    color: "emerald",
    merchants: [
      createMerchant("McDonald's"),
      createMerchant("HokBen"),
      createMerchant("KFC Indonesia"),
      createMerchant("GoFood"),
      createMerchant("GrabFood"),
      createMerchant("Kopi Kenangan"),
      createMerchant("Starbucks"),
      createMerchant("Fore Coffee"),
      createMerchant("Chatime"),
      createMerchant("Mixue"),
      createMerchant("Janji Jiwa"),
    ],
  },
  {
    id: "transportasi",
    name: "Transportasi",
    apiCategoryName: "TRANSPORTATION",
    description: "BBM, ojek online, taksi, maskapai, & tiket perjalanan",
    iconType: "image",
    iconSrc: "/images/category/transportasi.svg",
    color: "amber",
    merchants: [
      createMerchant("Pertamina"),
      createMerchant("Shell"),
      createMerchant("Gojek"),
      createMerchant("Grab"),
      createMerchant("Bluebird"),
      createMerchant("Garuda Indonesia"),
      createMerchant("Tiket.com"),
    ],
  },
  {
    id: "hiburan",
    name: "Hiburan & Rekreasi",
    apiCategoryName: "ENTERTAINMENT",
    description: "Streaming musik, film, gaming platform, & hiburan digital",
    iconType: "image",
    iconSrc: "/images/category/hiburan.svg",
    color: "purple",
    merchants: [
      createMerchant("Spotify Premium"),
      createMerchant("Netflix"),
      createMerchant("YouTube Premium"),
      createMerchant("Disney+ Hotstar"),
      createMerchant("Steam Games"),
      createMerchant("PlayStation Network"),
    ],
  },
  {
    id: "tech",
    name: "Tech & IT",
    apiCategoryName: "SOFTWARE_INFRASTRUCTURE",
    description: "Cloud hosting, DNS, repository code, & developer tools",
    iconType: "image",
    iconSrc: "/images/category/tech.svg",
    color: "cyan",
    merchants: [
      createMerchant("GitHub Copilot"),
      createMerchant("Vercel Pro Team"),
      createMerchant("Cursor AI"),
      createMerchant("AWS Cloud"),
      createMerchant("Cloudflare"),
      createMerchant("DigitalOcean"),
    ],
  },
  {
    id: "ai",
    name: "AI & Produktivitas",
    apiCategoryName: "SUBSCRIPTIONS",
    description: "Model AI, workspace notes, desain grafis, & tools produktif",
    iconType: "image",
    iconSrc: "/images/category/ai.svg",
    color: "indigo",
    merchants: [
      createMerchant("ChatGPT Plus Subscription"),
      createMerchant("Claude Pro"),
      createMerchant("Notion AI"),
      createMerchant("Canva Pro"),
      createMerchant("Figma Professional"),
      createMerchant("Midjourney"),
    ],
  },
  {
    id: "pendidikan",
    name: "Pendidikan & Kursus",
    apiCategoryName: "EDUCATION",
    description: "Platform e-learning, kursus online, buku, & materi edukasi",
    iconType: "image",
    iconSrc: "/images/category/pendidikan.svg",
    color: "orange",
    merchants: [
      createMerchant("Udemy"),
      createMerchant("Coursera"),
      createMerchant("Ruangguru"),
      createMerchant("Gramedia"),
    ],
  },
  {
    id: "tagihan",
    name: "Tagihan & Utilitas",
    apiCategoryName: "BILLS_UTILITIES",
    description: "Listrik PLN, paket data seluler, BPJS, & utilitas rumah",
    iconType: "image",
    iconSrc: "/images/category/tagihan.svg",
    color: "rose",
    merchants: [
      createMerchant("PLN Pascabayar"),
      createMerchant("Telkomsel Halo"),
      createMerchant("BPJS Kesehatan"),
    ],
  },
  {
    id: "kesehatan",
    name: "Kesehatan & Medis",
    apiCategoryName: "HEALTHCARE",
    description: "Apotek, konsultasi medis daring, & layanan farmasi",
    iconType: "image",
    iconSrc: "/images/category/kesehatan.svg",
    color: "teal",
    merchants: [
      createMerchant("Halodoc"),
      createMerchant("Apotek Kimia Farma"),
      createMerchant("K24 Klik"),
      createMerchant("Guardian"),
    ],
  },
];

const STORAGE_KEY = "sakuin_merchant_categories_v2";

// Helper to normalize merchants (supporting both API Supabase and local cache/defaults)
export function normalizeCategoryList(rawCats: unknown[]): CategoryItem[] {
  if (!Array.isArray(rawCats)) return DEFAULT_CATEGORIES;

  return (rawCats as any[]).map((cat, catIdx) => {
    const rawMerchants = Array.isArray(cat.merchants) ? cat.merchants : [];
    const normalizedMerchants: MerchantItem[] = rawMerchants.map((m: any, mIdx: number) => {
      if (typeof m === "string") {
        const defaultSubs = DEFAULT_SUB_MERCHANTS[m.toLowerCase()] || [];
        return {
          id: String(mIdx + 1),
          name: m,
          logoUrl: DEFAULT_MERCHANT_LOGOS[m.toLowerCase()] || undefined,
          subMerchants: defaultSubs,
        };
      }
      const mObj = (m || {}) as Partial<MerchantItem>;
      const defaultSubs = DEFAULT_SUB_MERCHANTS[(mObj.name || "").toLowerCase()] || [];
      const existingSubs = Array.isArray(mObj.subMerchants) ? mObj.subMerchants : [];
      return {
        id: String(mObj.id || `m_${catIdx}_${mIdx}_${Date.now()}`),
        name: mObj.name || "Merchant",
        logoUrl: mObj.logoUrl || DEFAULT_MERCHANT_LOGOS[(mObj.name || "").toLowerCase()] || undefined,
        logoDarkUrl: mObj.logoDarkUrl || undefined,
        subMerchants: (existingSubs.length > 0 ? existingSubs : defaultSubs)
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
  categories: DEFAULT_CATEGORIES,
  isLoading: false,
  activeCategoryId: DEFAULT_CATEGORIES[0]?.id || "makanan",
  mobileView: "categories",

  initCategories: () => {
    if (typeof window === "undefined") return;

    // Load from cache first for instant render
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        const normalized = normalizeCategoryList(parsed);
        if (normalized.length > 0) {
          const currentActive = get().activeCategoryId;
          const activeId = normalized.some((c) => c.id === currentActive)
            ? currentActive
            : normalized[0].id;
          set({ categories: normalized, activeCategoryId: activeId });
        }
      }
    } catch (err) {
      console.warn("Failed to load categories from localStorage cache", err);
    }

    set({ isLoading: true });

    // Fetch from Supabase REST API
    categoryApi
      .getCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const normalized = normalizeCategoryList(data);
          const currentActive = get().activeCategoryId;
          const activeId = normalized.some((c) => c.id === currentActive)
            ? currentActive
            : normalized[0].id;
          set({ categories: normalized, activeCategoryId: activeId, isLoading: false });
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          } catch (_) {}
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

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
    }

    categoryApi.createCategory(newCategory).catch((err) => {
      console.warn("[CategoryStore] Gagal createCategory ke API:", err);
    });

    return finalId;
  },

  updateCategory: (id, updates) => {
    const updated = get().categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    set({ categories: updated });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
    }

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

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
      } catch (_) {}
    }

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
      logoUrl: logoUrl || DEFAULT_MERCHANT_LOGOS[name.toLowerCase()] || undefined,
      logoDarkUrl: logoDarkUrl || undefined,
      subMerchants: subMerchants || DEFAULT_SUB_MERCHANTS[name.toLowerCase()] || [],
    };

    const updated = categories.map((c) =>
      c.id === categoryId ? { ...c, merchants: [newMerchant, ...c.merchants] } : c
    );

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
    }
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

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
    }
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
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
        } catch (_) {}
      }
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

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
    }
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

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
    }
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

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
    }
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
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          } catch (_) {}
        } else {
          set({
            categories: DEFAULT_CATEGORIES,
            activeCategoryId: DEFAULT_CATEGORIES[0]?.id || "",
            isLoading: false,
          });
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
          } catch (_) {}
        }
      })
      .catch((err) => {
        console.error("Gagal menyinkronkan kategori dari database:", err);
        set({
          categories: DEFAULT_CATEGORIES,
          activeCategoryId: DEFAULT_CATEGORIES[0]?.id || "",
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
