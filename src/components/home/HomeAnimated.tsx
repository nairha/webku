"use client";

import {
  Heading,
  Text,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  Line,
  Icon,
  Grid,
} from "@once-ui-system/core";
import { getContent, baseURL } from "@/resources";
import Link from "next/link";
import styles from "@/app/[lang]/page.module.scss";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HomeAnimatedProps {
  lang: string;
  person: any;
  social: any;
  work: any;
  gallery: any;
  sponsor: any;
  featuredProjects: any[];
}

export function HomeAnimated({
  lang,
  person,
  social,
  work,
  gallery,
  sponsor,
  featuredProjects,
}: HomeAnimatedProps) {
  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create timeline for entrance animations
    const tl = gsap.timeline();

    // Animate name with fade in and slide up
    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0
    );

    // Animate tagline
    tl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      0.2
    );

    // Animate paragraphs
    const paragraphs = paragraphsRef.current?.querySelectorAll("p");
    if (paragraphs && paragraphs.length > 0) {
      tl.fromTo(
        paragraphs,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
        0.4
      );
    }

    // Animate social section
    tl.fromTo(
      socialRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      0.6
    );

    // Animate project cards
    const projectCards = projectsRef.current?.querySelectorAll("[data-project-card]");
    if (projectCards && projectCards.length > 0) {
      tl.fromTo(
        projectCards,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" },
        0.8
      );
    }

    // Animate support section
    tl.fromTo(
      supportRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      1.2
    );
  }, []);

  const content = getContent(lang);

  return (
    <Column
      maxWidth="m"
      fillWidth
      paddingY="64"
      paddingX="m"
      horizontal="center"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/${lang}${content.home.path === "/" ? "" : content.home.path}`}
        title={content.home.title}
        description={content.home.description}
        image={`${baseURL}/api/og/generate?title=${encodeURIComponent(content.home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Column fillWidth gap="l">
        {/* Name and Tagline - Dynamic */}
        <Column gap="s">
          <div ref={nameRef} style={{ opacity: 0 }}>
            <Heading
              as="h1"
              variant="display-strong-xl"
              style={{ textTransform: "lowercase" }}
            >
              davingm
            </Heading>
          </div>
          <div ref={taglineRef} style={{ opacity: 0 }}>
            <Text variant="heading-default-xl" onBackground="neutral-medium">
              {content.home.tagline}
            </Text>
          </div>
        </Column>

        {/* Roles and Badges Section - Dynamic */}
        <Column gap="4">
          {content.home.badges?.map((section, sIdx) => (
            <Row key={sIdx} gap="8" vertical="center" wrap>
              <Text
                variant="body-default-l"
                onBackground="neutral-weak"
                style={{ minWidth: "140px" }}
              >
                {section.label}
              </Text>
              {section.items.map((item, iIdx) => (
                <Badge
                  key={iIdx}
                  background="neutral-alpha-weak"
                  paddingX="8"
                  paddingY="4"
                  onBackground="neutral-strong"
                  style={{ border: "1px solid var(--neutral-alpha-medium)" }}
                >
                  <Row gap="4" vertical="center">
                    {item.icon && <Icon name={item.icon} size="xs" />}
                    {item.name}
                  </Row>
                </Badge>
              ))}
            </Row>
          ))}
        </Column>

        {/* Content Paragraphs - Dynamic */}
        <Column ref={paragraphsRef} gap="24" style={{ lineHeight: "1.6" }}>
          {content.home.paragraphs?.map((p, idx) => (
            <p key={idx} style={{ opacity: 0 }}>
              <Text variant="body-default-xl" onBackground="neutral-medium">
                {p}
              </Text>
            </p>
          ))}
        </Column>

        {/* Social Section - Dynamic */}
        <div ref={socialRef} style={{ opacity: 0 }}>
          <Column gap="4" marginTop="12">
            <Text variant="body-default-l" onBackground="neutral-weak">
              {content.home.labels.social}
            </Text>
            <Row gap="16" vertical="center" wrap>
              {social
                .filter((s: any) => s.name !== "Email")
                .map((s: any) => (
                  <Link
                    key={s.name}
                    href={s.link}
                    target="_blank"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    <Icon name={s.icon as any} size="xs" />
                    <Text
                      variant="body-default-l"
                      style={{ fontWeight: 'bold', textDecoration: "underline" }}
                    >
                      {s.name}
                    </Text>
                  </Link>
                ))}
            </Row>
            <Text
              variant="body-default-l"
              onBackground="neutral-medium"
              marginTop="4"
            >
              {content.home.labels.mail}{" "}
              <Link
                href={`mailto:${person.email}`}
                style={{ textDecoration: "underline", color: "inherit" }}
              >
                {person.email}
              </Link>
            </Text>
          </Column>
        </div>

        {/* Featured Projects Grid - Dynamic */}
        <Column gap="l" marginTop="24">
          <Heading as="h2" variant="display-strong-xs">
            {content.home.labels.projects}
          </Heading>
          <div ref={projectsRef} className={styles.projectsGrid}>
            {featuredProjects.map((post, idx) => (
              <Column
                key={idx}
                data-project-card
                style={{
                  background: "var(--neutral-alpha-weak)",
                  border: "1px solid var(--neutral-alpha-medium)",
                  borderRadius: "12px",
                  padding: "24px",
                  opacity: 0,
                }}
                gap="m"
              >
                <Link
                  href={`/${lang}/proyek/${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Row gap="8" vertical="center" marginBottom="8">
                    <Icon
                      name={
                        post.metadata.tag === "nuxtjs" ||
                        post.metadata.tag === "nuxt"
                          ? "nuxt"
                          : "rocket"
                      }
                      size="xs"
                    />
                    <Heading
                      as="h3"
                      variant="heading-strong-s"
                      style={{ textDecoration: "underline" }}
                    >
                      {post.metadata.title}
                    </Heading>
                  </Row>
                </Link>
                <Text
                  variant="body-default-m"
                  onBackground="neutral-medium"
                  style={{
                    lineHeight: "1.5",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post.metadata.summary}
                </Text>
                <Row gap="8" wrap style={{ marginTop: "auto" }}>
                  {post.metadata.tech
                    ? post.metadata.tech.split(",").map((t: string) => (
                        <Badge
                          key={t.trim()}
                          background="neutral-alpha-weak"
                          onBackground="neutral-weak"
                          paddingX="8"
                          paddingY="2"
                          style={{
                            border: "1px solid var(--neutral-alpha-medium)",
                            borderRadius: "4px",
                          }}
                        >
                          {t.trim()}
                        </Badge>
                      ))
                    : (
                      <Badge
                        background="neutral-alpha-weak"
                        onBackground="neutral-weak"
                        paddingX="8"
                        paddingY="2"
                        style={{
                          border: "1px solid var(--neutral-alpha-medium)",
                          borderRadius: "4px",
                        }}
                      >
                        {post.metadata.tag || "Project"}
                      </Badge>
                    )}
                </Row>
              </Column>
            ))}
          </div>
        </Column>

        {/* Support Section - Sponsor Platforms */}
        <div ref={supportRef} style={{ opacity: 0 }}>
          <Column gap="12" marginTop="12">
            <Text variant="body-default-m" onBackground="neutral-medium">
              {content.home.labels.support}
            </Text>
            <Row gap="8" wrap>
              {content.sponsor.platforms?.map((platform, pIdx) => (
                <Link
                  key={pIdx}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", textDecoration: "none" }}
                >
                  <Badge
                    background="neutral-alpha-weak"
                    paddingX="16"
                    paddingY="12"
                    onBackground="neutral-strong"
                    style={{
                      border: "1px solid var(--neutral-alpha-medium)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <Row gap="8" vertical="center">
                      <Icon name={platform.icon} size="xs" />
                      <Text variant="body-default-s" style={{ fontWeight: 'bold' }}>
                        {platform.label}
                      </Text>
                    </Row>
                  </Badge>
                </Link>
              ))}
            </Row>
          </Column>
        </div>
      </Column>
    </Column>
  );
}
