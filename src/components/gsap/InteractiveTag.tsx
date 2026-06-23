"use client";

import React, { useRef, FC, ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Tag } from "@once-ui-system/core";

interface InteractiveTagProps {
  children: ReactNode;
  prefixIcon?: string;
  size?: "s" | "m" | "l";
}

export const InteractiveTag: FC<InteractiveTagProps> = ({ children, prefixIcon, size = "m" }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const handleMouseEnter = () => {
        gsap.to(el, {
          scale: 1.05,
          y: -2,
          duration: 0.3,
          ease: "back.out(2)",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(el, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} style={{ display: "inline-block" }}>
      <Tag size={size} prefixIcon={prefixIcon}>
        {children}
      </Tag>
    </div>
  );
};
