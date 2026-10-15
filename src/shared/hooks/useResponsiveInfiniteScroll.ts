"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseInfiniteScrollOptions {
  totalItems: number;
  initialBatchSize?: number;
  loadMoreBatchSize?: number;
  threshold?: number; // IntersectionObserver rootMargin / threshold
  root?: Element | Document | null;
}

/**
 * Hook kustom untuk Infinite Scroll adaptif responsif dengan Lazy Loading item
 * Menyesuaikan ukuran render awal berdasarkan ukuran viewport:
 * - Mobile: batch awal 6-8 item
 * - Tablet: batch awal 10-12 item
 * - Desktop: batch awal 15-20 item
 */
export function useResponsiveInfiniteScroll({
  totalItems,
  initialBatchSize,
  loadMoreBatchSize,
  threshold = 0.1,
  root = null,
}: UseInfiniteScrollOptions) {
  const BASE_BATCH_SIZE = initialBatchSize || 10;

  // Hitung batch awal adaptif berdasarkan tinggi layar viewport di browser
  const getAdaptiveInitialSize = useCallback(() => {
    if (typeof window === "undefined") return BASE_BATCH_SIZE;
    const height = window.innerHeight;
    // Rata-rata tinggi 1 item transaksi ~64px
    const visibleCount = Math.ceil(height / 64) + 4;
    return initialBatchSize || Math.max(visibleCount, 8);
  }, [initialBatchSize, BASE_BATCH_SIZE]);

  // Gunakan BASE_BATCH_SIZE saat SSR agar Server HTML dan Client Initial Render 100% identik
  const [visibleCount, setVisibleCount] = useState<number>(BASE_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Kalibrasi viewport setelah mount di client
  useEffect(() => {
    const adaptive = getAdaptiveInitialSize();
    setVisibleCount(adaptive);
  }, [getAdaptiveInitialSize]);

  // Recalculate jika totalItems berubah (misal saat search/filter)
  const prevTotalRef = useRef(totalItems);
  useEffect(() => {
    if (prevTotalRef.current !== totalItems) {
      prevTotalRef.current = totalItems;
      const adaptive = getAdaptiveInitialSize();
      setVisibleCount(adaptive);
    }
  }, [totalItems, getAdaptiveInitialSize]);



  const hasMore = visibleCount < totalItems;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    // Micro-delay untuk kelancaran rendering thread
    setTimeout(() => {
      setVisibleCount((prev) => {
        const step = loadMoreBatchSize || (typeof window !== "undefined" && window.innerWidth >= 1024 ? 12 : 8);
        return Math.min(prev + step, totalItems);
      });
      setIsLoadingMore(false);
    }, 120);
  }, [hasMore, isLoadingMore, loadMoreBatchSize, totalItems]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMore();
        }
      },
      {
        root: (root as Element | null) ?? null,
        rootMargin: "250px 0px", // Trigger sebelum user mencapai dasar paling bawah
        threshold,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, threshold, root]);

  const resetScroll = useCallback(() => {
    setVisibleCount(getAdaptiveInitialSize());
  }, [getAdaptiveInitialSize]);

  return {
    visibleCount,
    hasMore,
    isLoadingMore,
    loadMore,
    sentinelRef,
    resetScroll,
  };
}
