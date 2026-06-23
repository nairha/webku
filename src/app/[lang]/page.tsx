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
import { getPosts } from "@/utils/utils";
import Link from "next/link";
import styles from "./page.module.scss";
import { HomeAnimated } from "@/components/home/HomeAnimated";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { home } = getContent(lang);
  const metadata = Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: `/${lang}${home.path === "/" ? "" : home.path}`,
    image: home.image,
  });

  return {
    ...metadata,
    alternates: {
      canonical: `${baseURL}/${lang}`,
      languages: {
        'en': `${baseURL}/en`,
        'id': `${baseURL}/id`,
        'zh': `${baseURL}/zh`,
        'x-default': `${baseURL}/id`,
      },
    },
  };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { person, social, work, gallery, sponsor } = getContent(lang);

  // Fetch real projects, limit to 6
  const allProjects = getPosts(lang, ["src", "content", "proyek"]);
  const featuredProjects = allProjects
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, 6)
    .map((p) => ({
      slug: p.slug,
      metadata: {
        title: p.metadata.title,
        summary: p.metadata.summary,
        tag: p.metadata.tag,
        tech: p.metadata.tech,
      },
    }));

  return (
    <HomeAnimated 
      lang={lang}
      person={person}
      social={social}
      work={work}
      gallery={gallery}
      sponsor={sponsor}
      featuredProjects={featuredProjects}
    />
  );
}
