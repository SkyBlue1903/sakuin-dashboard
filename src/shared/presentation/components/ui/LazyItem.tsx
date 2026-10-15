"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/shared/utils";

interface LazyItemProps {
  children: React.ReactNode;
  className?: string;
  placeholderHeight?: number; // Tinggi estimasi skeleton placeholder
}

/**
 * Komponen wrapper LazyItem yang hanya me-render isi DOM berat ketika berada di dalam / mendekati viewport.
 * Menghilangkan DOM reflow berlebih dan menghemat pemakaian GPU / RAM browser pada daftar panjang.
 */
export const LazyItem: React.FC<LazyItemProps> = ({
  children,
  className,
  placeholderHeight = 64,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Jika browser tidak mendukung IntersectionObserver (fallback aman)
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }


    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Sekali terlihat, pertahankan dalam DOM
        }
      },
      {
        root: null,
        rootMargin: "300px 0px", // Pre-render 300px sebelum masuk layar agar transisi mulus
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(className)}
      style={!isVisible ? { minHeight: `${placeholderHeight}px` } : undefined}
    >
      {isVisible ? (
        children
      ) : (
        <div
          className="w-full flex items-center justify-between p-3.5 animate-pulse rounded-2xl"
          style={{ height: `${placeholderHeight}px` }}
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gray-100 dark:bg-gray-800" />
            <div className="space-y-2">
              <div className="h-3.5 w-28 bg-gray-100 dark:bg-gray-800 rounded-md" />
              <div className="h-2.5 w-20 bg-gray-50 dark:bg-gray-850 rounded-md" />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded-md ml-auto" />
            <div className="h-2.5 w-12 bg-gray-50 dark:bg-gray-850 rounded-md ml-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyItem;
