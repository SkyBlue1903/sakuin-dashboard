"use client";

import React from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Store,
  ShoppingCart,
  Coffee,
  Utensils,
  Car,
  Fuel,
  GraduationCap,
  Code2,
  Sparkles,
  Music,
  Film,
  Cloud,
  Zap,
  Receipt,
  HeartPulse,
  Pill,
  Gamepad2,
  Plane,
  Briefcase,
  ShieldCheck,
  Smartphone,
  Globe,
  Building2,
  Palette,
  Camera,
  BookOpen,
  Gift,
  HelpCircle,
  Tag,
  CreditCard,
  Layers,
} from "lucide-react";
import { cn } from "@/utils";

export const LUCIDE_ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingBag,
  Store,
  ShoppingCart,
  Coffee,
  Utensils,
  Car,
  Fuel,
  GraduationCap,
  Code2,
  Sparkles,
  Music,
  Film,
  Cloud,
  Zap,
  Receipt,
  HeartPulse,
  Pill,
  Gamepad2,
  Plane,
  Briefcase,
  ShieldCheck,
  Smartphone,
  Globe,
  Building2,
  Palette,
  Camera,
  BookOpen,
  Gift,
  HelpCircle,
  Tag,
  CreditCard,
  Layers,
};

export const PRESET_CATEGORY_IMAGES = [
  { name: "Belanja", src: "/images/category/belanja.svg" },
  { name: "Makanan", src: "/images/category/makanan.svg" },
  { name: "Transportasi", src: "/images/category/transportasi.svg" },
  { name: "Gadget & IT", src: "/images/category/gadget.svg" },
  { name: "Hiburan", src: "/images/category/hiburan.svg" },
  { name: "Tagihan", src: "/images/category/tagihan.svg" },
];

export interface CategoryIconProps {
  iconType?: "lucide" | "image";
  iconName?: string;
  iconSrc?: string;
  color?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconType = "lucide",
  iconName = "Tag",
  iconSrc,
  color = "blue",
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg text-xs",
    md: "w-10 h-10 rounded-xl text-sm",
    lg: "w-12 h-12 rounded-2xl text-base",
  }[size];

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  // If image icon from /images/category
  if (iconType === "image" && iconSrc) {
    return (
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center overflow-hidden transition-transform",
          sizeClasses,
          className
        )}
      >
        <Image
          src={iconSrc}
          alt={iconName || "Category icon"}
          fill
          className="object-contain"
          sizes="48px"
        />
      </div>
    );
  }

  // Lucide Icon
  const IconComponent = (iconName && LUCIDE_ICONS_MAP[iconName]) || Tag;

  const colorStyles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 border-sky-100 dark:border-sky-900/30",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border-purple-100 dark:border-purple-900/30",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 border-violet-100 dark:border-violet-900/30",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
    cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/30",
    red: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border-red-100 dark:border-red-900/30",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30",
    gray: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  };

  const styleClass = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={cn(
        "shrink-0 flex items-center justify-center border shadow-2xs transition-transform",
        sizeClasses,
        styleClass,
        className
      )}
    >
      <IconComponent className={iconSizes} />
    </div>
  );
};

export default CategoryIcon;
