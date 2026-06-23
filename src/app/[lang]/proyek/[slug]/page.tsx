import { notFound } from "next/navigation";
import { getPosts } from "@/utils/utils";
import {
  Meta,
  Schema,
  Column,
  Heading,
  Row,
  Text,
  SmartLink,
  AvatarGroup,
  Media,
  Line,
  Icon,
  HeadingNav,
} from "@once-ui-system/core";
import { getContent, baseURL } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import type { Metadata } from "next";
import { Projects } from "@/components/work/Projects";
import React from "react";


export async function generateStaticParams() {
  const locales = ["en", "id", "zh"];
  const params: { slug: string; lang: string }[] = [];
  
  for (const locale of locales) {
    const posts = getPosts(locale, ["src", "content", "proyek"]);
    for (const post of posts) {
      params.push({ slug: post.slug, lang: locale });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[]; lang: string }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug || "";
  
  const { work } = getContent(lang);
  const posts = getPosts(lang, ["src", "content", "proyek"]);
  const post = posts.find((p) => p.slug === slugPath);

  if (!post) return {};

  const metadata = Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image 
      ? (post.metadata.image.startsWith('http') ? post.metadata.image : `${baseURL}${post.metadata.image}`)
      : `${baseURL}/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`,
    path: `/${lang}${work.path}/${post.slug}`,
    type: 'article',
  });

  return {
    ...metadata,
    description: post.metadata.summary,
    alternates: {
      canonical: `${baseURL}/${lang}/proyek/${post.slug}`,
      languages: {
        'en': `${baseURL}/en/proyek/${post.slug}`,
        'id': `${baseURL}/id/proyek/${post.slug}`,
        'zh': `${baseURL}/zh/proyek/${post.slug}`,
        'x-default': `${baseURL}/id/proyek/${post.slug}`,
      },
    },
  };
}

export default async function Project({ params }: { params: Promise<{ slug: string | string[]; lang: string }> }) {
  const { slug, lang } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug || "";

  const { work, person, home } = getContent(lang);
  const allPosts = getPosts(lang, ["src", "content", "proyek"]);
  const post = allPosts.find((p) => p.slug === slugPath);

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((member: { name: string; role: string; avatar: string; github?: string }) => ({
      src: member.avatar,
    })) || [];

  return (
    <Row fillWidth>
      <Column maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`/${lang}${work.path}/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary}
            datePublished={post.metadata.publishedAt}
            dateModified={post.metadata.publishedAt}
            image={
              post.metadata.image 
                ? (post.metadata.image.startsWith('http') ? post.metadata.image : `${baseURL}${post.metadata.image}`)
                : (post.metadata.images?.[0] 
                    ? (post.metadata.images[0].startsWith('http') ? post.metadata.images[0] : `${baseURL}${post.metadata.images[0]}`)
                    : `${baseURL}/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`)
            }
            author={{
              name: person.name,
              url: `${baseURL}/${lang}${home.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          
          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href={`/${lang}/proyek`}>
              <Text variant="label-strong-m">{work.label}</Text>
            </SmartLink>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
            </Text>
            <Heading variant="display-strong-m" align="center">{post.metadata.title}</Heading>
          </Column>

          <Column horizontal="center" gap="16" fillWidth marginBottom="24">
            {avatars.length > 0 && <AvatarGroup reverse avatars={avatars} size="l" />}
            <Text variant="body-default-m" onBackground="neutral-strong" align="center">
              {post.metadata.team?.map((member: any, idx: number) => (
                <span key={member.name}>
                  {idx > 0 && ", "}
                  {member.github ? (
                    <SmartLink href={member.github} target="_blank">
                      {member.name}
                    </SmartLink>
                  ) : (
                    member.name
                  )}
                </span>
              ))}
            </Text>
          </Column>

          {post.metadata.images.length > 0 && (
            <Column fillWidth gap="m">
              <Media 
                priority 
                aspectRatio="16 / 9" 
                radius="m" 
                alt={post.metadata.title} 
                src={post.metadata.images[0]} 
              />
              <Row gap="12" horizontal="center">
                {post.metadata.github && (
                  <SmartLink href={post.metadata.github} target="_blank">
                    <Row 
                      paddingX="12" 
                      paddingY="8" 
                      radius="m" 
                      background="neutral-alpha-weak" 
                      vertical="center" 
                      gap="8"
                      style={{ border: '1px solid var(--neutral-alpha-medium)' }}
                    >
                      <Icon name="github" size="xs" />
                      <Text variant="label-strong-s">GitHub</Text>
                    </Row>
                  </SmartLink>
                )}
                {post.metadata.demo && (
                  <SmartLink href={post.metadata.demo} target="_blank">
                    <Row 
                      paddingX="12" 
                      paddingY="8" 
                      radius="m" 
                      background="brand-alpha-weak" 
                      vertical="center" 
                      gap="8"
                      style={{ border: '1px solid var(--brand-alpha-medium)' }}
                    >
                      <Icon name="link" size="xs" />
                      <Text variant="label-strong-s">Live Demo</Text>
                    </Row>
                  </SmartLink>
                )}
              </Row>
            </Column>
          )}

          <Column as="article" maxWidth="s" fillWidth marginTop="32">
            <CustomMDX source={post.content} />
          </Column>

          <Column fillWidth gap="40" horizontal="center" marginTop="40">
            <Line maxWidth="40" />
            <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
              {lang === 'zh' ? '其他项目' : 'Proyek lainnya'}
            </Heading>
            <Projects exclude={[post.slug]} range={[1, 2]} locale={lang} />
          </Column>

          <ScrollToHash />
        </Column>
      </Row>
      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
