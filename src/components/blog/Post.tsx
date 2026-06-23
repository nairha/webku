"use client";

import { Card, Column, Media, Row, Avatar, Text, Badge } from "@once-ui-system/core";
import { formatDate } from "@/utils/formatDate";
import { person } from "@/resources";

interface PostProps {
  post: {
    slug: string;
    metadata: {
      title: string;
      image?: string;
      publishedAt: string;
      tag?: string;
      tech?: string;
    };
  };
  thumbnail: boolean;
  direction?: "row" | "column";
  locale?: string;
}

export default function Post({ post, thumbnail, direction, locale = "id" }: PostProps) {
  return (
    <Card
      fillWidth
      key={post.slug}
      href={`/${locale}/blog/${post.slug}`}
      transition="micro-medium"
      direction={direction}
      border="transparent"
      background="transparent"
      padding="4"
      radius="l-4"
      gap={direction === "column" ? undefined : "24"}
      s={{ direction: "column" }}
    >
      {post.metadata.image && thumbnail && (
        <Media
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          border="neutral-alpha-weak"
          cursor="interactive"
          radius="l"
          src={post.metadata.image}
          alt={`Thumbnail of ${post.metadata.title}`}
          aspectRatio="16 / 9"
        />
      )}
      <Row fillWidth>
        <Column maxWidth={28} paddingY="24" paddingX="l" gap="20" vertical="center">
          <Row gap="24" vertical="center">
            <Row vertical="center" gap="16">
              <Avatar src={person.avatar} size="s" />
              <Text variant="label-default-s">{person.name}</Text>
            </Row>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {formatDate(post.metadata.publishedAt, false)}
            </Text>
          </Row>
          <Text variant="heading-strong-l" wrap="balance">
            {post.metadata.title}
          </Text>
          <Row gap="8" wrap>
            {post.metadata.tech ? post.metadata.tech.split(',').map((t: string) => (
              <Badge key={t.trim()} background="neutral-alpha-weak" onBackground="neutral-weak" paddingX="8" paddingY="2" style={{ border: '1px solid var(--neutral-alpha-medium)', borderRadius: '4px' }}>
                {t.trim()}
              </Badge>
            )) : post.metadata.tag && (
              <Text variant="label-strong-s" onBackground="neutral-weak">
                {post.metadata.tag}
              </Text>
            )}
          </Row>
        </Column>
      </Row>
    </Card>
  );
}
