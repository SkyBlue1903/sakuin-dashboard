import { create } from "zustand";

const ROUTE_TITLE_MAP: Record<string, string> = {
  "/card": "SakuCard",
  "/guide": "Panduan",
  "/guides": "Panduan",
  "/panduan": "Panduan",
  "/info": "Informasi",
  "/promo": "Promo",
  "/profile": "Detail Profil",
  "/admin/merchant": "Kategori Merchant",
  "/admin/guide": "Panduan",
  "/admin/guides": "Panduan",
  "/admin/panduan": "Panduan",
  "/admin/info": "Informasi",
  "/admin/promo": "Promo",
  "/login": "Login",
  "/": "SakuCard",
};

interface SidebarState {
  isOpen: boolean;
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  activeTitle: string;
  openSubmenu: string | null;

  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  setActiveTitle: (title: string) => void;
  toggleSubmenu: (item: string) => void;
  syncRoute: (pathname: string) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isOpen: false,
  isExpanded: false,
  isMobileOpen: false,
  isHovered: false,
  activeItem: null,
  activeTitle: "SakuCard",
  openSubmenu: null,

  toggleSidebar: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      isExpanded: !state.isOpen,
      isMobileOpen: !state.isOpen,
    })),

  openSidebar: () =>
    set({
      isOpen: true,
      isExpanded: true,
      isMobileOpen: true,
    }),

  closeSidebar: () =>
    set({
      isOpen: false,
      isExpanded: false,
      isMobileOpen: false,
    }),

  toggleMobileSidebar: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      isExpanded: !state.isOpen,
      isMobileOpen: !state.isOpen,
    })),

  setIsHovered: (isHovered: boolean) => set({ isHovered }),

  setActiveItem: (activeItem: string | null) => set({ activeItem }),

  setActiveTitle: (activeTitle: string) => set({ activeTitle }),

  toggleSubmenu: (item: string) =>
    set((state) => ({
      openSubmenu: state.openSubmenu === item ? null : item,
    })),

  syncRoute: (pathname: string) => {
    set((state) => {
      let nextTitle = state.activeTitle;
      if (ROUTE_TITLE_MAP[pathname]) {
        if (pathname === "/profile" && state.activeTitle === "Customer List") {
          nextTitle = state.activeTitle;
        } else {
          nextTitle = ROUTE_TITLE_MAP[pathname];
        }
      }
      return {
        isOpen: false,
        isExpanded: false,
        isMobileOpen: false,
        activeTitle: nextTitle,
      };
    });
  },
}));

// Backward compatibility hook matching previous useSidebar interface
export const useSidebar = () => {
  return useSidebarStore();
};
