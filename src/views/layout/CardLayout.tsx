"use client";

import React from "react";
import AppHeader from "@/views/layout/AppHeader";
import AppSidebar from "@/views/layout/AppSidebar";
import Backdrop from "@/views/layout/Backdrop";

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<div className="relative min-h-screen md:h-screen md:overflow-hidden w-full flex flex-col bg-gray-50 dark:bg-gray-950 font-sans">
        {/* Sidebar Drawer and Dimmed Overlay Backdrop */}
        <AppSidebar />
        <Backdrop />

        {/* Main Content Area - Expansive full width view */}
        <div className="relative w-full min-w-0 flex-1 flex flex-col md:h-full md:overflow-hidden">
          {/* Header - Sticky on mobile document scroll, static at top on tablet/desktop */}
          <div className="sticky md:static top-0 inset-x-0 z-30 w-full shrink-0">
            <AppHeader />
          </div>

          {/* Page Content - Native document scroll on mobile, contained split scroll on tablet/desktop */}
          <main className="flex-1 w-full min-w-0 md:overflow-hidden flex flex-col">
            <div className="w-full min-w-0 flex-1 md:overflow-hidden flex flex-col">
              {children}
            </div>
          </main>
        </div>
      </div>
);
}
