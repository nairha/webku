"use client";

import React, { useRef, type FC, type ReactElement, cloneElement } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface MagneticProps {
  children: ReactElement;
  amount?: number;
}

export const Magnetic: FC<MagneticProps> = ({ children, amount = 0.5 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const xTo = gsap.quickTo(ref.current, "x", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
      const yTo = gsap.quickTo(ref.current, "y", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });

      const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        xTo(x * amount);
        yTo(y * amount);
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      const el = ref.current;
      el?.addEventListener("mousemove", handleMouseMove);
      el?.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        el?.removeEventListener("mousemove", handleMouseMove);
        el?.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: ref }
  );

  return React.cloneElement(children as React.ReactElement<any> & { ref: React.Ref<any> }, { ref });
};
