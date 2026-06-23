import {
  Column,
  Heading,
  Meta,
  Schema,
  Text,
  Flex,
  Skeleton,
  RevealFx,
  Line,
  Row,
} from "@once-ui-system/core";
import { baseURL, getContent } from "@/resources";
import { GitHubRepoList } from "@/components/GitHubRepoList";
import { getGithubRepos } from "@/utils/github";
import { Suspense } from "react";

const ALL_LOCALES = ["en", "id", "zh"] as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { experimen } = getContent(lang);
  const metadata = Meta.generate({
    title: experimen.title,
    description: experimen.description,
    baseURL: baseURL,
    path: `/${lang}${experimen.path}`,
    type: "website",
  });

  return {
    ...metadata,
    description: experimen.description,
    alternates: {
      canonical: `${baseURL}/${lang}${experimen.path}`,
      languages: Object.fromEntries(
        ALL_LOCALES.map((locale) => [
          locale,
          `${baseURL}/${locale}${experimen.path}`,
        ])
      ),
    },
  };
}

// Separate component for data fetching to enable Suspense
async function RepoListLoader({ username }: { username: string }) {
  const repos = await getGithubRepos(username);
  return <GitHubRepoList repos={repos} />;
}

// Skeleton component for loading state
const RepoListSkeleton = () => (
  <Column fillWidth gap="24" paddingX="m">
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} shape="line" height="xl" radius="xl" fillWidth />
    ))}
  </Column>
);

export default async function Experimen({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { experimen, person } = getContent(lang);

  return (
    <Column maxWidth="l" horizontal="center" fillWidth paddingY="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/${lang}${experimen.path}`}
        title={experimen.title}
        description={experimen.description}
      />

      {/* Hero Section */}
      <Column fillWidth gap="32" marginBottom="80">
        <Row vertical="center" gap="12">
          <RevealFx speed="slow" translateY="8">
            <Text
              variant="label-strong-m"
              onBackground="brand-weak"
              style={{ textTransform: "uppercase", letterSpacing: "0.3em" }}
            >
              {lang === "zh" ? "实验" : "Experimen"} / {person.firstName}
            </Text>
          </RevealFx>
          <Line background="brand-alpha-strong" style={{ flex: 1 }} height="1" />
        </Row>

        <Column gap="16">
          <RevealFx speed="slow" delay={0.2}>
            <Heading variant="display-strong-l">{experimen.hero.headline}</Heading>
          </RevealFx>
          <RevealFx speed="slow" delay={0.4}>
            <Text
              variant="heading-default-m"
              onBackground="neutral-weak"
              style={{ maxWidth: "600px", lineHeight: "1.6" }}
            >
              {experimen.hero.subline}
            </Text>
          </RevealFx>
        </Column>
      </Column>

      <Suspense fallback={<RepoListSkeleton />}>
        <RepoListLoader username={experimen.github.username} />
      </Suspense>

      {/* Footer Insight */}
      <Column fillWidth horizontal="center" align="center" marginTop="128" gap="40">
        <RevealFx speed="slow" translateY="20">
          <Column horizontal="center" gap="24">
            <Line height="40" background="brand-alpha-strong" vert />
            <Text variant="body-default-s" onBackground="neutral-weak">
              Analisis teknologi otomatis ditenagai oleh GitHub API v3 & Next.js
            </Text>
            <Flex gap="16" wrap horizontal="center">
              {["TypeScript", "React", "Nuxt", "Laravel", "Vue"].map((tech) => (
                <Text key={tech} variant="label-strong-xs" onBackground="neutral-strong">
                  {tech}
                </Text>
              ))}
            </Flex>
          </Column>
        </RevealFx>
      </Column>
    </Column>
  );
}
