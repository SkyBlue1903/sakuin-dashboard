// Domain
export * from "./domain/navigation";

// Hooks
export * from "./hooks/useLockBodyScroll";
export * from "./hooks/useResponsiveInfiniteScroll";

// Presentation - Stores
export * from "./presentation/stores/useSidebarStore";
export * from "./presentation/stores/useThemeStore";
export * from "./presentation/stores/ToastContext";

// Presentation - UI Components
export * from "./presentation/components/ui/Modal";
export { default as LazyItem } from "./presentation/components/ui/LazyItem";
export { default as ThemeTogglerTwo } from "./presentation/components/ui/ThemeTogglerTwo";
export { default as ThemeSwitcher } from "./presentation/components/ui/ThemeSwitcher";
export { default as GridShape } from "./presentation/components/ui/GridShape";
export * from "./presentation/components/ui/Badge";

// Presentation - Layout Components
export { default as AppHeader } from "./presentation/components/layout/AppHeader";
export { default as AppSidebar } from "./presentation/components/layout/AppSidebar";
export { default as Backdrop } from "./presentation/components/layout/Backdrop";
export { default as SidebarWidget } from "./presentation/components/layout/SidebarWidget";
export { default as DashboardLayout } from "./presentation/components/layout/DashboardLayout";

// Utils & Lib
export * from "./utils";
export * from "./utils/imageOptimizer";
export * from "./lib/supabase";
