"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SakanaWidget.module.scss";

const CDN = "https://cdn.jsdelivr.net/npm/sakana-widget@3.0.0/lib/index.umd.min.js";

type SakanaWidgetCharacter = {
  image: string;
  initialState: object;
};

type SakanaWidgetCtor = {
  new (opts?: { character?: string; size?: number; controls?: boolean }): {
    mount: (el: HTMLElement) => void;
  };
  getCharacter: (name: string) => SakanaWidgetCharacter | null;
  registerCharacter: (name: string, char: SakanaWidgetCharacter) => void;
};

export function SakanaWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const [visible, setVisible] = useState(false);

  // Sentinel berada di dalam footer (normal flow).
  // IntersectionObserver mengawasi sentinel — saat footer masuk viewport → tampilkan widget.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mountedRef.current) return;

    const existing = document.querySelector(`script[src="${CDN}"]`);
    if (existing) {
      tryMount();
      return;
    }

    const script = document.createElement("script");
    script.src = CDN;
    script.async = true;
    script.onload = tryMount;
    script.onerror = () => console.warn("[SakanaWidget] Gagal load CDN");
    document.head.appendChild(script);

    function tryMount() {
      if (mountedRef.current || !containerRef.current) return;

      const SW = (window as Window & { SakanaWidget?: SakanaWidgetCtor }).SakanaWidget;
      if (!SW) return;

      const base = SW.getCharacter("chisato");
      if (!base) return;

      const imageUrl = `${window.location.origin}/kin.png`;

      SW.registerCharacter("kin", {
        image: imageUrl,
        initialState: base.initialState,
      });

      new SW({
        character: "kin",
        size: 260,
        controls: false,
      }).mount(containerRef.current);

      // Override ukuran image kin (portrait 1:1.5) setelah mount
      setTimeout(() => {
        if (!containerRef.current) return;

        const W = 208;
        const H = 312;
        const extra = H - W;

        const app = containerRef.current.querySelector(".sakana-widget-app") as HTMLElement | null;
        if (app) {
          app.style.setProperty("overflow", "visible", "important");
          app.style.setProperty("height", `${H}px`, "important");
          app.style.setProperty("margin-top", `-${extra}px`, "important");
        }

        const wrapper = containerRef.current.querySelector(".sakana-widget-wrapper") as HTMLElement | null;
        if (wrapper) {
          wrapper.style.setProperty("overflow", "visible", "important");
        }

        const main = containerRef.current.querySelector(".sakana-widget-main") as HTMLElement | null;
        if (main) {
          main.style.setProperty("overflow", "visible", "important");
          main.style.setProperty("height", `${H}px`, "important");
          main.style.setProperty("width", `${W}px`, "important");
        }

        const img = containerRef.current.querySelector(".sakana-widget-img") as HTMLElement | null;
        if (img) {
          img.style.setProperty("width", `${W}px`, "important");
          img.style.setProperty("height", `${H}px`, "important");
          img.style.setProperty("background-size", "contain", "important");
          img.style.setProperty("background-position", "center", "important");
          img.style.setProperty("background-repeat", "no-repeat", "important");
          img.style.setProperty("transform-origin", `50% ${H}px`, "important");
        }
      }, 50);

      mountedRef.current = true;
    }
  }, []);

  return (
    <>
      {/* Sentinel: elemen kecil dalam footer, diawasi IntersectionObserver */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      {/* Widget: position fixed di viewport bottom, hanya tampil saat footer visible */}
      <div className={`${styles.widget} ${visible ? styles.visible : ""}`}>
        <div ref={containerRef} />
      </div>
    </>
  );
}
