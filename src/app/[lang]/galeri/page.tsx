import { Flex, Meta, Schema } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { getContent, baseURL } from "@/resources";

const ALL_LOCALES = ["en", "id", "zh"] as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { gallery } = getContent(lang);
  const metadata = Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: `${baseURL}/api/og/generate?title=${encodeURIComponent(gallery.title)}`,
    path: `/${lang}${gallery.path}`,
    robots: 'noimageindex',
  });

  return {
    ...metadata,
    description: gallery.description,
    alternates: {
      canonical: `${baseURL}/${lang}${gallery.path}`,
      languages: Object.fromEntries(
        ALL_LOCALES.map((locale) => [
          locale,
          `${baseURL}/${locale}${gallery.path}`,
        ])
      ),
    },
  };
}

export default async function Gallery({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { gallery, person, home } = getContent(lang);

  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={`/${lang}${gallery.path}`}
        image={`${baseURL}/api/og/generate?title=${encodeURIComponent(gallery.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/${lang}${home.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {/* Images passed from server — alt text & src visible to crawlers */}
      <GalleryView images={gallery.images} />
    </Flex>
  );
}
