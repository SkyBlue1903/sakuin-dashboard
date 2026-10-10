"use client";

import React from "react";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden overscroll-none">
      {/* Sidebar Drawer and Dimmed Overlay Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area - Expansive full width view */}
      <div className="relative h-full w-full flex flex-col overflow-hidden">
        {/* iOS SwiftUI Glass Header */}
        <div className="absolute top-0 inset-x-0 z-30">
          <AppHeader />
        </div>

        {/* Page Content - Full height, zero top padding under header */}
        <main className="flex-1 w-full h-full min-h-0 overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-10 pt-0 pb-0">
          <div className="w-full h-full min-h-0 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
