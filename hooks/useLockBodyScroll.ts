"use client";

import { useEffect } from "react";

// Module-level lock state to support nested or sequential modals cleanly
let lockCount = 0;
let savedScrollY = 0;

let originalBodyOverflow = "";
let originalBodyPosition = "";
let originalBodyTop = "";
let originalBodyLeft = "";
let originalBodyRight = "";
let originalBodyWidth = "";
let originalBodyHeight = "";
let originalBodyOverscroll = "";
let originalBodyTouchAction = "";

let originalHtmlOverflow = "";
let originalHtmlOverscroll = "";
let originalHtmlHeight = "";

// Touch tracking variables
let touchStartY = 0;
let touchStartX = 0;
let activeScrollableEl: HTMLElement | null = null;

const getScrollableParent = (el: HTMLElement | null): HTMLElement | null => {
  let curr = el;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    const style = window.getComputedStyle(curr);
    const overflowY = style.overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      curr.scrollHeight > curr.clientHeight + 1
    ) {
      return curr;
    }
    curr = curr.parentElement;
  }
  return null;
};

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length !== 1) return;
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
  activeScrollableEl = getScrollableParent(e.target as HTMLElement | null);

  // iOS Safari boundary bounce disarm:
  // If touch starts exactly at top or bottom boundary, nudge by 1px so iOS attaches bounce to inner element, not window
  if (activeScrollableEl) {
    const top = activeScrollableEl.scrollTop;
    const max = activeScrollableEl.scrollHeight - activeScrollableEl.clientHeight;
    if (top <= 0) {
      activeScrollableEl.scrollTop = 1;
    } else if (top >= max) {
      activeScrollableEl.scrollTop = Math.max(0, max - 1);
    }
  }
};

const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length !== 1) return;

  const currentY = e.touches[0].clientY;
  const currentX = e.touches[0].clientX;
  const deltaY = currentY - touchStartY;
  const deltaX = currentX - touchStartX;

  // If touch is not inside any scrollable container (e.g. backdrop, modal header, footer, background):
  if (!activeScrollableEl) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  // If scrolling more horizontally than vertically, don't interfere
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return;
  }

  const scrollTop = activeScrollableEl.scrollTop;
  const maxScroll = activeScrollableEl.scrollHeight - activeScrollableEl.clientHeight;

  // Swiping down (deltaY > 0) while already at top boundary (scrollTop <= 0)
  if (deltaY > 0 && scrollTop <= 0) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  // Swiping up (deltaY < 0) while already at bottom boundary (scrollTop >= maxScroll - 1)
  if (deltaY < 0 && scrollTop >= maxScroll - 1) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }
};

const handleTouchEnd = () => {
  activeScrollableEl = null;
};

const handleWheel = (e: WheelEvent) => {
  const scrollableEl = getScrollableParent(e.target as HTMLElement | null);

  if (!scrollableEl) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  const scrollTop = scrollableEl.scrollTop;
  const maxScroll = scrollableEl.scrollHeight - scrollableEl.clientHeight;

  // Scrolling up at top boundary
  if (e.deltaY < 0 && scrollTop <= 0) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  // Scrolling down at bottom boundary
  if (e.deltaY > 0 && scrollTop >= maxScroll - 1) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }
};

/**
 * Custom hook to lock body scrolling when a modal or popup is open.
 * Bulletproof mobile & desktop protection:
 * 1. Physical body/html lock with position: fixed and scroll position restore.
 * 2. Active touchmove boundary interceptor preventing scroll chaining even when spamming gestures rapidly.
 * 3. Wheel interceptor preventing momentum chaining at top/bottom limits.
 */
export const useLockBodyScroll = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

    if (lockCount === 0) {
      savedScrollY = window.scrollY || window.pageYOffset || 0;

      originalBodyOverflow = document.body.style.overflow;
      originalBodyPosition = document.body.style.position;
      originalBodyTop = document.body.style.top;
      originalBodyLeft = document.body.style.left;
      originalBodyRight = document.body.style.right;
      originalBodyWidth = document.body.style.width;
      originalBodyHeight = document.body.style.height;
      originalBodyOverscroll = document.body.style.overscrollBehavior;
      originalBodyTouchAction = document.body.style.touchAction;

      originalHtmlOverflow = document.documentElement.style.overflow;
      originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
      originalHtmlHeight = document.documentElement.style.height;

      // Lock HTML
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overscrollBehavior = "none";
      document.documentElement.style.height = "100%";

      // Lock Body
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = "0px";
      document.body.style.right = "0px";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.touchAction = "none";

      // Attach non-passive boundary interceptors
      document.addEventListener("touchstart", handleTouchStart, { passive: true });
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd, { passive: true });
      document.addEventListener("wheel", handleWheel, { passive: false });
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;

        // Remove boundary interceptors
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("wheel", handleWheel);

        // Restore HTML
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
        document.documentElement.style.height = originalHtmlHeight;

        // Restore Body
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.position = originalBodyPosition;
        document.body.style.top = originalBodyTop;
        document.body.style.left = originalBodyLeft;
        document.body.style.right = originalBodyRight;
        document.body.style.width = originalBodyWidth;
        document.body.style.height = originalBodyHeight;
        document.body.style.overscrollBehavior = originalBodyOverscroll;
        document.body.style.touchAction = originalBodyTouchAction;

        // Restore exact scroll position
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [isLocked]);
};

export default useLockBodyScroll;
