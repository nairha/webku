"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const BAR_HEIGHT = 3;
const Z_INDEX = 9999;

/**
 * Top loading bar (Nuxt/YouTube style) – thin bar at the very top
 * that animates on route change. Does not affect layout (position: fixed).
 */
export function TopLoadingBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Skip first mount (no "navigation", just initial load)
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    // Cancel any in-flight animation
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    if (timerRef.current != null) clearTimeout(timerRef.current);

    setVisible(true);
    setProgress(0);

    const start = performance.now();
    const duration = 600; // total ms

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= duration) {
        setProgress(100);
        timerRef.current = setTimeout(() => {
          setVisible(false);
          setProgress(0);
          timerRef.current = null;
        }, 120);
        return;
      }
      // Easing: fast start, slow near end (like Nuxt/YouTube)
      const t = elapsed / duration;
      const easeOut = 1 - Math.pow(1 - t, 2);
      const p = Math.min(95, easeOut * 100);
      setProgress(p);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (timerRef.current != null) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: BAR_HEIGHT,
        zIndex: Z_INDEX,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: "var(--scheme-brand-600, #2563eb)",
          transition: progress < 100 ? "width 80ms linear" : "width 120ms ease-out",
          boxShadow: "0 0 10px var(--scheme-brand-600, #2563eb), 0 0 5px var(--scheme-brand-600, #2563eb)",
        }}
      />
    </div>
  );
}
