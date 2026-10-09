"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  // const mainContentMargin = isMobileOpen
  //   ? "ml-0"
  //   : isExpanded || isHovered
  //   ? "xl:ml-[290px]"
  //   : "xl:ml-[90px]";
  const mainContentMargin = "";

  return (
    <div className="relative h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden overscroll-none">
      {/* Sidebar and Backdrop */}
      {/* <AppSidebar /> */}
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`relative h-full w-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* iOS SwiftUI Glass Header - Positioned at top, content passes underneath */}
        <div className="absolute top-0 inset-x-0 z-40">
          <AppHeader />
        </div>

        {/* Page Content - Full height, zero top padding under header */}
        <main className="flex-1 w-full h-full min-h-0 overflow-hidden px-4 sm:px-6 lg:px-8 pt-0 pb-0">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1440px] h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
