"use client";

import React from "react";
import AppHeader from "@/views/layout/AppHeader";
import AppSidebar from "@/views/layout/AppSidebar";
import Backdrop from "@/views/layout/Backdrop";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-950 font-sans">
      {/* Sidebar Drawer and Dimmed Overlay Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area - Expansive full width view */}
      <div className="relative w-full flex-1 flex flex-col">
        {/* Sticky Header - Sticks to top on scroll, moves naturally on pull-to-refresh like YouTube */}
        <div className="sticky top-0 inset-x-0 z-30 w-full">
          <AppHeader />
        </div>

        {/* Page Content - Native document scroll on all devices */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 pt-0 pb-0">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
