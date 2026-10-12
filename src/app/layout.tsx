import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import QueryProvider from "@/providers/QueryProvider";
import StoreInitializer from "@/providers/StoreInitializer";
import { ToastProvider } from "@/stores/ToastContext";


const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sakuin Dashboard",
  description: "Sakuin Admin Dashboard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-full" suppressHydrationWarning>
      <body className={`${outfit.className} min-h-full flex flex-col antialiased dark:bg-gray-950 dark:text-gray-100`}>
        <Script
          id="theme-initializer"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var mode = localStorage.getItem('theme-mode') || localStorage.getItem('theme') || 'system';
                var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-color-scheme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-color-scheme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />

        <QueryProvider>
          <ToastProvider>
            <StoreInitializer>
              {children}
            </StoreInitializer>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

