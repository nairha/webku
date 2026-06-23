"use client";

import { useRef, type FC, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealTextProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  trigger?: boolean;
}

export const RevealText: FC<RevealTextProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  trigger = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const elements = containerRef.current.children;

      gsap.fromTo(
        elements,
        {
          y: "110%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          duration: duration,
          delay: delay,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: trigger
            ? {
                trigger: containerRef.current,
                start: "top 90%",
                toggleActions: "play none none none",
              }
            : undefined,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
};
