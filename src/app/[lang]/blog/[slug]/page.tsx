import { notFound, redirect } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import {
  Meta,
  Schema,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Row,
  Text,
  SmartLink,
  Avatar,
  Media,
  Line,
} from "@once-ui-system/core";
import { getContent, baseURL } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getPosts } from "@/utils/utils";
import type { Metadata } from "next";
import React from "react";
import { Posts } from "@/components/blog/Posts";
import { ShareSection } from "@/components/blog/ShareSection";

import { Twikoo } from "@/components/blog/Twikoo";

export async function generateStaticParams(): Promise<{ slug: string; lang: string }[]> {
  const locales = ["en", "id", "zh"];
  const params: { slug: string; lang: string }[] = [];
  
  for (const locale of locales) {
    const posts = getPosts(locale, ["src", "content", "blog"]);
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
  const routeParams = await params;
  const { lang, slug } = routeParams;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug || "";

  const { blog } = getContent(lang);
  const posts = getPosts(lang, ["src", "content", "blog"]);
  let post = posts.find((p) => p.slug === slugPath);

  if (!post) {
    const locales = ["en", "id", "zh"];
    for (const locale of locales) {
      if (locale === lang) continue;
      const otherPosts = getPosts(locale, ["src", "content", "blog"]);
      const otherPost = otherPosts.find((p) => p.slug === slugPath);
      if (otherPost) {
        post = otherPost;
        break;
      }
    }
  }

  if (!post) return {};

  return {
    title: String(post.metadata.title),
    description: String(post.metadata.summary),
    alternates: {
      canonical: `${baseURL}/${lang}/blog/${post.slug}`,
      languages: {
        'en': `${baseURL}/en/blog/${post.slug}`,
        'id': `${baseURL}/id/blog/${post.slug}`,
        'zh': `${baseURL}/zh/blog/${post.slug}`,
        'x-default': `${baseURL}/id/blog/${post.slug}`,
      },
    },
  };
}

export default async function Blog({ params }: { params: Promise<{ slug: string | string[]; lang: string }> }) {
  const routeParams = await params;
  const { lang, slug } = routeParams;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug || "";

  const { blog, home, person } = getContent(lang);
  const allPosts = getPosts(lang, ["src", "content", "blog"]);
  
  const post = allPosts.find((p) => p.slug === slugPath);

  if (!post) {
    const locales = ["en", "id", "zh"];
    for (const locale of locales) {
      if (locale === lang) continue;
      const otherPosts = getPosts(locale, ["src", "content", "blog"]);
      const otherPost = otherPosts.find((p) => p.slug === slugPath);
      if (otherPost) {
        redirect(`/${locale}/blog/${slugPath}`);
      }
    }
    notFound();
  }
  
  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
          <Schema
            as="article"
            baseURL={baseURL}
            path={`/${lang}${blog.path}/${post.slug}`}
            title={String(post.metadata.title)}
            description={String(post.metadata.summary)}
            datePublished={String(post.metadata.publishedAt)}
            dateModified={String(post.metadata.publishedAt)}
          />
          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href={`/${lang}/blog`}>
              <Text variant="label-strong-m">Blog</Text>
            </SmartLink>
            <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
            </Text>
            <Heading variant="display-strong-m">{post.metadata.title}</Heading>
            {post.metadata.subtitle && (
              <Text 
                variant="body-default-l" 
                onBackground="neutral-weak" 
                align="center"
                style={{ fontStyle: 'italic' }}
              >
                {post.metadata.subtitle}
              </Text>
            )}
          </Column>
          <Row marginBottom="32" horizontal="center">
            <Row gap="16" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="label-default-m" onBackground="brand-weak">
                {person.name}
              </Text>
            </Row>
          </Row>
          {post.metadata.image && (
            <Media
              src={post.metadata.image}
              alt={post.metadata.title}
              aspectRatio="16/9"
              priority
              sizes="(min-width: 768px) 100vw, 768px"
              border="neutral-alpha-weak"
              radius="l"
              marginTop="12"
              marginBottom="8"
            />
          )}
          <Column as="article" maxWidth="s">
            <CustomMDX source={post.content} />
          </Column>
          
          <ShareSection 
            title={post.metadata.title} 
            url={`${baseURL}/${lang}${blog.path}/${post.slug}`} 
          />

          <Twikoo lang={lang} />

          <Column fillWidth gap="40" horizontal="center" marginTop="40">
            <Line maxWidth="40" />
            <Text as="h2" id="recent-posts" variant="heading-strong-xl" marginBottom="24">
              {lang === 'zh' ? '近期文章' : 'Recent posts'}
            </Text>
            <Posts exclude={[post.slug]} range={[1, 2]} columns="2" thumbnail direction="column" locale={lang} />
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
