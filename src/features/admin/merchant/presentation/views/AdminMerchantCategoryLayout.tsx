"use client";

import React from "react";
import LeftSidebarContent from "./LeftSidebarContent";
import RightSidebarContent from "./RightSidebarContent";

export const AdminMerchantCategoryLayout: React.FC = () => {
  return (
<div className="w-full md:h-full md:overflow-hidden pt-0 pb-8 md:pb-0">
        {/* Main Responsive Layout:
            - Mobile (< md): stacked single column with natural document scroll
            - Tablet / Desktop (>= md): 2 columns side-by-side with independent split scroll:
              Left: Daftar Kategori (scrolls independently)
              Right: Daftar Merchant (scrolls independently)
        */}
        <div className="flex flex-col  md:flex-row items-stretch w-full md:h-full md:overflow-hidden mx-auto">
          {/* Left Column: Kategori List & Icon Picker */}
          <LeftSidebarContent />

          {/* Right Column: Daftar Merchant per Kategori & Match Simulator */}
          <RightSidebarContent />
        </div>
      </div>
);
};

export default AdminMerchantCategoryLayout;
