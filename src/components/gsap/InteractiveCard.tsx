"use client";

import { useRef, type FC, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Column } from "@once-ui-system/core";

interface InteractiveCardProps {
  children: ReactNode;
}

export const InteractiveCard: FC<InteractiveCardProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const handleMouseMove = (e: MouseEvent) => {
        const bounds = el.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const xPct = (mouseX / bounds.width - 0.5) * 2;
        const yPct = (mouseY / bounds.height - 0.5) * 2;

        gsap.to(el, {
          rotateY: xPct * 5,
          rotateX: -yPct * 5,
          scale: 1.02,
          duration: 0.5,
          ease: "power2.out",
          perspective: 1000,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(el, {
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: ref }
  );

  return (
    <Column
      ref={ref}
      fillWidth
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </Column>
  );
};
