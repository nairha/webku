"use client";

import { Media, MasonryGrid } from "@once-ui-system/core";
import type { Gallery } from "@/types";

interface GalleryViewProps {
  images: Gallery["images"];
}

export default function GalleryView({ images }: GalleryViewProps) {
  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {images.map((image) => (
        <Media
          enlarge
          priority={images.indexOf(image) < 4}
          sizes="(max-width: 560px) 100vw, 50vw"
          key={image.src}
          radius="m"
          aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
          src={image.src}
          alt={image.alt}
        />
      ))}
    </MasonryGrid>
  );
}
