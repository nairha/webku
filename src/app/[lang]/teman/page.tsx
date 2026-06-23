import { getContent, baseURL } from "@/resources";
import { FriendsContent } from "@/components/teman/FriendsContent";

const ALL_LOCALES = ["en", "id", "zh"] as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const { teman } = getContent(lang);

    return {
        title: teman.title,
        description: teman.description,
        openGraph: {
            title: teman.title,
            description: teman.description,
            url: `${baseURL}/${lang}${teman.path}`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: teman.title,
            description: teman.description,
        },
        alternates: {
            canonical: `${baseURL}/${lang}${teman.path}`,
            languages: Object.fromEntries(
                ALL_LOCALES.map((locale) => [
                    locale,
                    `${baseURL}/${locale}${teman.path}`,
                ])
            ),
        },
    };
}

export default async function Friends({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const { teman, person } = getContent(lang);

    return (
        <FriendsContent lang={lang} teman={teman} person={person} />
    );
}
