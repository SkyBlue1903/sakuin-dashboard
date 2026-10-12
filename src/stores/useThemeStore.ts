import { create } from "zustand";
import { ThemeMode, ResolvedTheme } from "@/models/navigation";

interface ThemeState {
  theme: ResolvedTheme;
  themeMode: ThemeMode;
  mounted: boolean;
  initTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const applyThemeToDOM = (resolved: ResolvedTheme) => {
  if (typeof document === "undefined") return;
  if (resolved === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-color-scheme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("data-color-scheme", "light");
  }
};

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  themeMode: "system",
  mounted: false,

  initTheme: () => {
    if (typeof window === "undefined") return;
    const savedMode = (localStorage.getItem("theme-mode") ||
      localStorage.getItem("theme")) as ThemeMode | null;
    const initialMode: ThemeMode =
      savedMode === "light" || savedMode === "dark" || savedMode === "system"
        ? savedMode
        : "system";

    const resolved: ResolvedTheme =
      initialMode === "system" ? getSystemTheme() : initialMode;

    applyThemeToDOM(resolved);
    set({ themeMode: initialMode, theme: resolved, mounted: true });

    // Setup system media query listener
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (get().themeMode === "system") {
        const nextResolved: ResolvedTheme = e.matches ? "dark" : "light";
        applyThemeToDOM(nextResolved);
        set({ theme: nextResolved });
      }
    };
    mediaQuery.addEventListener("change", handleChange);
  },

  setThemeMode: (mode: ThemeMode) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme-mode", mode);
      } catch (_) {}
    }

    const resolved: ResolvedTheme =
      mode === "system" ? getSystemTheme() : mode;

    applyThemeToDOM(resolved);
    set({ themeMode: mode, theme: resolved });
  },

  toggleTheme: () => {
    const { themeMode, theme } = get();
    let nextMode: ThemeMode;
    if (themeMode === "system") {
      nextMode = theme === "dark" ? "light" : "dark";
    } else {
      nextMode = themeMode === "light" ? "dark" : "light";
    }
    get().setThemeMode(nextMode);
  },
}));

// Backward compatibility hook matching previous useTheme interface
export const useTheme = () => {
  const { theme, themeMode, setThemeMode, toggleTheme } = useThemeStore();
  return { theme, themeMode, setThemeMode, toggleTheme };
};

export const useOptionalTheme = useTheme;

