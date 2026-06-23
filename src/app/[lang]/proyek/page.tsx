import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { getContent, baseURL } from "@/resources";
import { Projects } from "@/components/work/Projects";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { work } = getContent(lang);
  const metadata = Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `${baseURL}/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: `/${lang}${work.path}`,
    type: 'website',
  });

  return {
    ...metadata,
    description: work.description,
    alternates: {
      canonical: `${baseURL}/${lang}/proyek`,
      languages: {
        'en': `${baseURL}/en/proyek`,
        'id': `${baseURL}/id/proyek`,
        'zh': `${baseURL}/zh/proyek`,
        'x-default': `${baseURL}/proyek`,
      },
    },
  };
}

export default async function Work({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { work, person, home } = getContent(lang);
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/${lang}${work.path}`}
        title={work.title}
        description={work.description}
        image={`${baseURL}/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/${lang}${home.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" align="center">
        {work.title}
      </Heading>
      <Projects locale={lang} />
    </Column>
  );
}
