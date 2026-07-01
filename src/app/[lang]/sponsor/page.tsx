import {
    Button,
    Column,
    Heading,
    Icon,
    Text,
    Meta,
    Schema,
    Row,
    RevealFx,
    Line,
    Flex,
    Avatar,
} from "@once-ui-system/core";
import { getContent, baseURL, sponsorsData } from "@/resources";
import React from "react";

const ALL_LOCALES = ["en", "id", "zh"] as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const { sponsor } = getContent(lang);
    const metadata = Meta.generate({
        title: sponsor.title,
        description: sponsor.description,
        baseURL: baseURL,
        image: `${baseURL}/images/og/author.webp`,
        path: `/${lang}${sponsor.path}`,
        robots: 'noimageindex',
    });

    return {
        ...metadata,
        description: sponsor.description,
        alternates: {
            canonical: `${baseURL}/${lang}${sponsor.path}`,
            languages: Object.fromEntries(
                ALL_LOCALES.map((locale) => [
                    locale,
                    `${baseURL}/${locale}${sponsor.path}`,
                ])
            ),
        },
    };
}

export default async function Sponsor({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const { sponsor, person, home } = getContent(lang);

    // Icon & link mapping berdasarkan nama tier
    const tierMeta: Record<string, { icon: string; link: string; accent: string }> = {
        "GitHub Sponsors": { icon: "github",  link: "https://github.com/sponsors/DavinGM",         accent: "brand"   },
        "Buy Me a Coffee": { icon: "coffee",  link: "https://www.buymeacoffee.com/DavinGM",         accent: "accent"  },
        "Ko-fi":           { icon: "kofi",    link: "https://ko-fi.com/davingm",                    accent: "accent"  },
        "Saweria":         { icon: "heart",   link: "https://saweria.co/davingm",                   accent: "neutral" },
    };

    const tiers = sponsor.tiers.map((tier, index) => ({
        ...tier,
        ...(tierMeta[tier.name] ?? { icon: "heart", link: "#", accent: "neutral" }),
        accent: tierMeta[tier.name]?.accent ?? (index === 0 ? "brand" : index === 1 ? "accent" : "neutral"),
    }));

    return (
        <Column maxWidth="l" horizontal="center" fillWidth paddingY="l">
            <Schema
                as="webPage"
                baseURL={baseURL}
                title={sponsor.title}
                description={sponsor.description}
                path={`/${lang}${sponsor.path}`}
                image={`${baseURL}/images/og/author.webp`}
                author={{
                    name: person.name,
                    url: `${baseURL}/${lang}${home.path}`,
                    image: `${baseURL}${person.avatar}`,
                }}
            />

            {/* Hero Section */}
            <Column fillWidth horizontal="center" align="center" paddingTop="12" paddingBottom="32" gap="24">
                <RevealFx translateY="12" speed="slow" horizontal="center">
                    <Row vertical="center" gap="8">
                        <Icon name="sparkle" onBackground="brand-weak" size="xs" />
                        <Text variant="label-strong-l" onBackground="brand-weak" style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            {sponsor.hero.supportMe}
                        </Text>
                        <Icon name="sparkle" onBackground="brand-weak" size="xs" />
                    </Row>
                </RevealFx>

                <RevealFx translateY="16" delay={0.2} speed="slow" horizontal="center" fillWidth>
                    <Heading variant="display-strong-xl" align="center" style={{ lineHeight: '1.1' }}>
                        {sponsor.hero.headline}
                    </Heading>
                </RevealFx>

                <RevealFx translateY="20" delay={0.4} speed="slow" horizontal="center" fillWidth>
                    <Text variant="heading-default-l" onBackground="neutral-weak" align="center" style={{ maxWidth: '650px' }}>
                        {sponsor.hero.subline}
                    </Text>
                </RevealFx>
            </Column>

            <Row fillWidth paddingY="40" horizontal="center">
                <Line maxWidth={48} background="neutral-alpha-medium" />
            </Row>

            {/* Tiers Grid */}
            <Flex fillWidth gap="24" s={{ direction: 'column' }} wrap>
                {tiers.map((tier, index) => (
                    <RevealFx key={tier.name} translateY="24" delay={0.6 + index * 0.15} fillWidth style={{ flex: 1 }}>
                        <Column
                            fillWidth
                            padding="32"
                            radius="xl"
                            border="neutral-alpha-weak"
                            background="neutral-alpha-weak"
                            gap="32"
                            position="relative"
                            style={{
                                overflow: 'hidden',
                                height: '100%',
                            }}
                        >
                            <Row horizontal="between" vertical="center" fillWidth>
                                <Icon size="l" name={tier.icon as any} onBackground={`${tier.accent}-weak` as any} />
                                <Text variant="label-default-s" onBackground="neutral-weak" style={{ border: '1px solid var(--neutral-alpha-medium)', padding: '4px 12px', borderRadius: '100px' }}>
                                    {tier.tag}
                                </Text>
                            </Row>

                            <Column gap="12" fillWidth>
                                <Heading variant="heading-strong-l">
                                    {tier.name}
                                </Heading>
                                <Text variant="body-default-m" onBackground="neutral-weak" style={{ minHeight: '60px' }}>
                                    {tier.description}
                                </Text>
                            </Column>

                            <Button
                                href={tier.link}
                                fillWidth
                                variant="secondary"
                                size="m"
                                weight="default"
                                suffixIcon="arrowUpRight"
                            >
                                {tier.buttonText}
                            </Button>

                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '-24px',
                                    right: '-24px',
                                    opacity: 0.04,
                                    zIndex: 0,
                                    pointerEvents: 'none'
                                }}
                            >
                                <Icon size="xl" name={tier.icon as any} />
                            </div>
                        </Column>
                    </RevealFx>
                ))}
            </Flex>

            {/* Footer Quote */}
            <Column fillWidth horizontal="center" align="center" marginTop="80" gap="32">
                <Line maxWidth={16} height="2" background="brand-strong" />
                <RevealFx speed="slow" delay={1.2} horizontal="center">
                    <Text variant="body-default-l" onBackground="neutral-weak" align="center" style={{ maxWidth: '450px', fontStyle: 'italic', lineHeight: '1.6' }}>
                        "{sponsor.quote}"
                    </Text>
                </RevealFx>

                <RevealFx translateY="12" delay={1.4} horizontal="center">
                    <Row gap="16" vertical="center" paddingY="8" paddingX="20" radius="full" border="neutral-alpha-weak" marginBottom="40">
                        <Icon name="bolt" size="xs" onBackground="brand-strong" />
                        <Text variant="label-strong-m" style={{ letterSpacing: '0.1em' }}>Powered by Passion & Community</Text>
                    </Row>
                </RevealFx>

                {/* Individual Sponsors Section */}
                <RevealFx translateY="24" delay={1.6} fillWidth>
                    <Column fillWidth horizontal="center" gap="40" marginTop="12">
                        <Text variant="label-strong-s" onBackground="neutral-weak" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {lang === 'zh' ? '近期赞助者' : 'Recent Benefactors'}
                        </Text>
                        <Flex wrap fillWidth gap="16" horizontal="center">
                            {sponsorsData.map((sponsorItem) => (
                                <Row
                                    key={sponsorItem.name}
                                    padding="12"
                                    gap="12"
                                    radius="m"
                                    vertical="center"
                                    border="neutral-alpha-weak"
                                    background="neutral-alpha-weak"
                                    style={{ minWidth: '220px', transition: 'all 0.3s ease' }}
                                >
                                    <Avatar
                                        size="s"
                                        src={sponsorItem.avatar || `https://github.com/identicons/${sponsorItem.name.replace(/\s+/g, '').toLowerCase()}.png`}
                                    />
                                    <Column gap="2">
                                        <Text variant="label-strong-s">{sponsorItem.name}</Text>
                                        {sponsorItem.role && (
                                            <Text variant="body-default-xs" onBackground="neutral-weak">{sponsorItem.role}</Text>
                                        )}
                                    </Column>
                                </Row>
                            ))}
                        </Flex>
                    </Column>
                </RevealFx>
            </Column>
        </Column>
    );
}
