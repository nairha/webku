"use client";

import { useState, useCallback, useEffect } from "react";
import { Column, Grid, Heading, Row, Media, Text, Icon, IconButton } from "@once-ui-system/core";
import { formatDate } from "@/utils/formatDate";

type TalkMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  venue: string;
  location: string;
  image?: string;
  organizations?: string[];
  eventDate: string;
  eventTime?: string;
  link?: string;
};

type Talk = {
  metadata: TalkMetadata;
  slug: string;
  content: string;
};

type TalksProps = {
  talks: Talk[];
};

export function Talks({ talks }: TalksProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const openVideo = useCallback((link: string) => {
    const embedUrl = link.endsWith("/") ? `${link}embed` : `${link}/embed`;
    setActiveVideo(embedUrl);
  }, []);

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeVideo();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeVideo]);

  return (
    <>
      <Grid
        columns="2"
        s={{ columns: 1 }}
        fillWidth
        gap="48"
        paddingBottom="64"
      >
        {talks.map((talk) => (
          <Column
            key={talk.slug}
            onClick={() => talk.metadata.link && openVideo(talk.metadata.link)}
            fillWidth
            gap="20"
            style={{ cursor: "pointer" }}
          >
            {talk.metadata.image && (
              <div 
                style={{ 
                  position: "relative", 
                  width: "100%", 
                  borderRadius: "24px", 
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <Media
                  src={talk.metadata.image}
                  alt={talk.metadata.title}
                  aspectRatio="16 / 9"
                  priority
                  style={{
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
                <div 
                  style={{ 
                    position: "absolute", 
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)", 
                    backgroundColor: "rgba(0, 0, 0, 0.4)", 
                    padding: "20px", 
                    borderRadius: "50%", 
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.6)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.4)"}
                >
                  <Icon name="play" size="m" onBackground="neutral-strong" />
                </div>
              </div>
            )}
            
            <Column fillWidth gap="12">
              <Row gap="12" vertical="center" wrap>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {talk.metadata.eventDate && formatDate(talk.metadata.eventDate)}
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak">•</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {talk.metadata.location}
                </Text>
              </Row>

              <Heading as="h3" variant="heading-strong-xl" onBackground="neutral-strong" style={{ lineHeight: "1.2" }}>
                {talk.metadata.title}
              </Heading>

              <Text
                variant="body-default-m"
                onBackground="neutral-medium"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: "1.6"
                }}
              >
                {talk.metadata.summary}
              </Text>

              {talk.metadata.organizations && talk.metadata.organizations.length > 0 && (
                <Row gap="12" wrap marginTop="4">
                  {talk.metadata.organizations.slice(0, 3).map((org: string) => (
                    <Text key={org} variant="label-strong-s" onBackground="brand-medium" style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
                      {org}
                    </Text>
                  ))}
                </Row>
              )}
            </Column>
          </Column>
        ))}
      </Grid>

      {/* Video Overlay Modal */}
      {activeVideo && (
        <div
          role="button"
          tabIndex={0}
          onClick={closeVideo}
          onKeyDown={(e) => e.key === "Enter" && closeVideo()}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Enter" && e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "400px",
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 1001 }}>
              <IconButton
                icon="close"
                variant="secondary"
                size="l"
                onClick={closeVideo}
                style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "50%" }}
              />
            </div>
            
            <iframe
              title="Instagram Video Player"
              src={activeVideo}
              width="100%"
              height="100%"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
