import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { Talks } from "@/components/speaking/Talks";
import { getContent, baseURL } from "@/resources";
import { getTalks } from "@/utils/utils";

const ALL_LOCALES = ["en", "id", "zh"] as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { speaking } = getContent(lang);
  const metadata = Meta.generate({
    title: speaking.title,
    description: speaking.description,
    baseURL: baseURL,
    image: `${baseURL}/api/og/generate?title=${encodeURIComponent(speaking.title)}`,
    path: `/${lang}${speaking.path}`,
  });

  return {
    ...metadata,
    description: speaking.description,
    alternates: {
      canonical: `${baseURL}/${lang}${speaking.path}`,
      languages: Object.fromEntries(
        ALL_LOCALES.map((locale) => [
          locale,
          `${baseURL}/${locale}${speaking.path}`,
        ])
      ),
    },
  };
}

export default async function Speaking({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { speaking, person, home } = getContent(lang);
  const talks = getTalks(lang);

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={speaking.title}
        description={speaking.description}
        path={`/${lang}${speaking.path}`}
        image={`${baseURL}/api/og/generate?title=${encodeURIComponent(speaking.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/${lang}${home.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {speaking.title}
      </Heading>
      <Column fillWidth flex={1} gap="40">
        <Talks talks={talks} />
      </Column>
    </Column>
  );
}
