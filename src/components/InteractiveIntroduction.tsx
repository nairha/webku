"use client";

import { useRef, type FC } from "react";
import { Text, Column } from "@once-ui-system/core";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface InteractiveIntroductionProps {
  text: string;
}

export const InteractiveIntroduction: FC<InteractiveIntroductionProps> = ({
  text,
}) => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const words = container.current?.querySelectorAll(".word");

      if (words) {
        for (const word of Array.from(words)) {
          const wordEl = word as HTMLElement;
          
          wordEl.addEventListener("mouseenter", () => {
            gsap.to(wordEl, {
              y: -5,
              scale: 1.1,
              color: "var(--brand-solid-strong)",
              duration: 0.3,
              ease: "back.out(1.7)",
            });
          });

          wordEl.addEventListener("mouseleave", () => {
            gsap.to(wordEl, {
              y: 0,
              scale: 1,
              color: "inherit",
              duration: 0.3,
              ease: "power2.inOut",
            });
          });
        }
      }
    },
    { scope: container }
  );

  const words = text.split(" ");

  return (
    <Column
      ref={container}
      fillWidth
      horizontal="center"
      align="center"
      paddingY="24"
      style={{ overflow: "visible" }}
    >
      <Text
        variant="heading-default-xl"
        onBackground="neutral-weak"
        wrap="balance"
        align="center"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.4em",
          lineHeight: "1.5",
        }}
      >
        {words.map((word, index) => (
          <span
            key={`word-${index}`}
            className="word"
            style={{
              display: "inline-block",
              cursor: "default",
              transition: "color 0.3s ease",
            }}
          >
            {word}
          </span>
        ))}
      </Text>
    </Column>
  );
};
