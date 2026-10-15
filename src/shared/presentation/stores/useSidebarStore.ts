import { create } from "zustand";

const ROUTE_TITLE_MAP: Record<string, string> = {
  "/card": "SakuCard",
  "/info": "Informasi",
  "/panduan": "Panduan",
  "/guides": "Panduan",
  "/promo": "Promo",
  "/admin/info": "Informasi",
  "/admin/panduan": "Panduan",
  "/admin/guides": "Panduan",
  "/admin/promo": "Promo",
  "/profile": "Detail Profil",
  "/customers": "Customer List",
  "/customer-list": "Customer List",
  "/calendar": "Calendar",
  "/form-elements": "Form Elements",
  "/basic-tables": "Basic Tables",
  "/blank": "Blank Page",
  "/error-404": "404 Error",
  "/login": "Login",
  "/admin/merchant": "Kategori Merchant",
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
