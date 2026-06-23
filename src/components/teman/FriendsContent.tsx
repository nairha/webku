"use client";

import {
    Column,
    Heading,
    Icon,
    Text,
    Row,
    RevealFx,
    Line,
    Flex,
    Avatar,
} from "@once-ui-system/core";
import { Twikoo } from "@/components/blog/Twikoo";
import { FriendRequestModal } from "@/components/teman/FriendRequestModal";
import { useState } from "react";

export const FriendsContent = ({ lang, teman, person }: any) => {
    const [showModal, setShowModal] = useState(false);

    const friendSections = [
        { title: teman.sections.online.title, subtitle: teman.sections.online.subtitle, data: teman.friends.online, icon: "globe" as const, color: "brand" },
        { title: teman.sections.aktif.title, subtitle: teman.sections.aktif.subtitle, data: teman.friends.aktif, icon: "bolt" as const, color: "accent" },
        { title: teman.sections.pena.title, subtitle: teman.sections.pena.subtitle, data: teman.friends.pena, icon: "book" as const, color: "neutral" },
    ];

    return (
        <>
        <Column maxWidth="l" horizontal="center" fillWidth paddingY="xl">
            {/* Hero Section */}
            <Column fillWidth gap="32" marginBottom="80">
                <Row vertical="center" gap="12">
                    <RevealFx speed="slow" translateY="8">
                        <Text variant="label-strong-m" onBackground="brand-weak" style={{ textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                            {lang === 'zh' ? '朋友' : 'Teman'} / {person.firstName}
                        </Text>
                    </RevealFx>
                    <Line background="brand-alpha-strong" style={{ flex: 1 }} height="1" />
                </Row>
                
                <Column gap="16">
                    <RevealFx speed="slow" delay={0.2}>
                        <Heading variant="display-strong-l">
                            {teman.hero.headline}
                        </Heading>
                    </RevealFx>
                    <RevealFx speed="slow" delay={0.4}>
                        <Text variant="heading-default-m" onBackground="neutral-weak" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
                            {teman.hero.subline}
                        </Text>
                    </RevealFx>
                </Column>
            </Column>

            {/* Main Content Area */}
            <Flex fillWidth direction="column" gap="80">
                {friendSections.map((section, sIndex) => (
                    <Column key={section.title} fillWidth gap="32">
                        {/* Section Header */}
                        <RevealFx translateY="12" delay={0.6 + sIndex * 0.1}>
                            <Row vertical="center" gap="24" fillWidth>
                                <Column gap="4">
                                    <Row gap="8" vertical="center" fillWidth>
                                        <Icon name={section.icon} size="xs" onBackground={`${section.color}-strong` as any} />
                                        <Text variant="label-strong-l" style={{ textTransform: 'uppercase' }}>{section.title}</Text>
                                    </Row>
                                    <Text variant="body-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.1em' }}>
                                        0{sIndex + 1} &mdash; {section.subtitle}
                                    </Text>
                                </Column>
                                <Line background="neutral-alpha-medium" height="1" style={{ flex: 1 }} />
                            </Row>
                        </RevealFx>

                        {/* Staggered Row Cards */}
                        <Flex wrap fillWidth gap="16">
                            {section.data.map((friend: any, fIndex: number) => (
                                <RevealFx 
                                    key={friend.name} 
                                    translateY="16" 
                                    delay={0.8 + sIndex * 0.1 + fIndex * 0.05} 
                                    style={{ flex: '1 1 calc(50% - 16px)', minWidth: '320px' }}
                                >
                                    <Row
                                        as={friend.website ? "a" : "div"}
                                        {...(friend.website ? { href: friend.website, target: "_blank", rel: "noopener noreferrer" } : {})}
                                        fillWidth
                                        padding="16"
                                        radius="l"
                                        vertical="center"
                                        border="neutral-alpha-weak"
                                        background="neutral-alpha-weak"
                                        style={{ 
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            textDecoration: 'none',
                                            cursor: friend.website ? 'pointer' : 'default'
                                        }}
                                        className="friend-card"
                                    >
                                        <style dangerouslySetInnerHTML={{ __html: `
                                            .friend-card:hover {
                                                transform: translateY(-4px);
                                                border-color: var(--brand-alpha-strong);
                                                background: var(--neutral-alpha-medium);
                                            }
                                        `}} />
                                        
                                        <Row gap="16" vertical="center" fillWidth>
                                            <div style={{ position: 'relative' }}>
                                                <Avatar
                                                    size="l"
                                                    src={friend.avatar}
                                                    aria-label={`${friend.name} profile picture`}
                                                    style={{ border: '2px solid var(--neutral-alpha-weak)' }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: -2,
                                                    right: -2,
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    background: section.color === 'brand' ? 'var(--brand-strong)' : 'var(--neutral-alpha-strong)',
                                                    border: '2px solid var(--page-background)'
                                                }} />
                                            </div>
                                            
                                            <Column gap="4" style={{ flex: 1 }}>
                                                <Text variant="label-strong-m">{friend.name}</Text>
                                                <Text variant="body-default-xs" onBackground="neutral-weak" style={{ 
                                                    fontStyle: 'italic',
                                                    opacity: 0.8,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    &ldquo;{friend.motto}&rdquo;
                                                </Text>
                                            </Column>
                                            
                                            <Row gap="8">
                                                {(Array.isArray(friend.stack) ? friend.stack : [friend.stack]).map((s: any) => {
                                                    const stackIcons: Record<string, string> = {
                                                        "Nuxt": "nuxt",
                                                        "Angular": "angular",
                                                        "Laravel": "laravel",
                                                        "React": "reactapi",
                                                        "Vue": "vue",
                                                        "Next": "nextjs",
                                                        "Svelte": "svelte"
                                                    };
                                                    return <Icon key={s} name={stackIcons[s] as any} size="xs" onBackground="neutral-weak" style={{ opacity: 0.5 }} />;
                                                })}
                                            </Row>
                                        </Row>
                                    </Row>
                                </RevealFx>
                            ))}
                        </Flex>
                    </Column>
                ))}
            </Flex>

            {/* Friend Request Section */}
            <Column fillWidth marginTop="160" gap="0" style={{ position: 'relative', maxWidth: '100%' }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.03,
                    pointerEvents: 'none',
                    backgroundImage: `
                        linear-gradient(var(--neutral-alpha-weak) 1px, transparent 1px),
                        linear-gradient(90deg, var(--neutral-alpha-weak) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }} />

                <RevealFx speed="slow" translateY="20">
                    <Column gap="0" fillWidth style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
                        <div style={{ 
                            padding: '80px 40px',
                            position: 'relative',
                            borderBottom: '1px solid var(--neutral-alpha-weak)'
                        }}>
                            <div style={{ position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px', background: 'linear-gradient(to bottom, transparent, var(--brand-strong), transparent)' }} />
                            <div style={{ position: 'absolute', right: '0', top: '60px', bottom: '60px', width: '1px', background: 'linear-gradient(to bottom, transparent, var(--accent-strong), transparent)' }} />
                            
                            <Column gap="32" horizontal="center" align="center">
                                <Text 
                                    variant="body-default-xs" 
                                    onBackground="neutral-weak" 
                                    align="center"
                                    style={{ 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.4em',
                                        fontWeight: 500,
                                        position: 'relative'
                                    }}
                                >
                                    <span style={{ 
                                        display: 'inline-block',
                                        padding: '0 20px',
                                        position: 'relative'
                                    }}>
                                        <span style={{ position: 'absolute', left: 0, top: '50%', width: '8px', height: '1px', background: 'var(--brand-strong)' }} />
                                        {lang === 'zh' ? '友情链接' : 'Friend Links'}
                                        <span style={{ position: 'absolute', right: 0, top: '50%', width: '8px', height: '1px', background: 'var(--brand-strong)' }} />
                                    </span>
                                </Text>
                                
                                <Heading 
                                    variant="display-strong-xs" 
                                    align="center"
                                    style={{ 
                                        maxWidth: '700px',
                                        lineHeight: 1.3,
                                        position: 'relative'
                                    }}
                                >
                                    {lang === 'zh' ? '在这个世界上，没有什么比友谊更有意义' : lang === 'en' ? 'In this world, nothing is more meaningful than friendship' : 'Di Dunia ini tidak ada yang lebih Berarti dari pada Pertemanan'}
                                </Heading>
                            </Column>
                        </div>

                        <div className="friend-request-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(12, 1fr)',
                            gap: '1px',
                            background: 'var(--neutral-alpha-weak)',
                            border: '1px solid var(--neutral-alpha-weak)',
                            width: '100%',
                        }}>
                            {/* Requirements */}
                            <div style={{
                                gridColumn: 'span 7',
                                background: 'var(--page-background)',
                                padding: '48px 40px',
                                position: 'relative',
                            }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '60px', background: 'var(--brand-strong)' }} />
                                <Column gap="32">
                                    <Column gap="12">
                                        <Row gap="12" vertical="center">
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--brand-strong)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'var(--brand-strong)', flexShrink: 0
                                            }}>01</div>
                                            <Text variant="heading-strong-s">
                                                {lang === 'zh' ? '基本要求' : lang === 'en' ? 'Basic Requirements' : 'Persyaratan Dasar'}
                                            </Text>
                                        </Row>
                                        <Text variant="body-default-xs" onBackground="neutral-weak" style={{ maxWidth: '500px' }}>
                                            {lang === 'zh' ? '确保您的网站符合以下标准以获得批准' : lang === 'en' ? 'Ensure your website meets these standards for approval' : 'Pastikan website Anda memenuhi standar berikut untuk disetujui'}
                                        </Text>
                                    </Column>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', width: '100%' }}>
                                        {(lang === 'zh' ? [
                                            { title: '网站类型', desc: '个人或严肃项目，非垃圾站点' },
                                            { title: '内容合规', desc: '合法内容，符合印尼法律' },
                                            { title: '域名要求', desc: '自有域名 + HTTPS 加密' },
                                            { title: '活跃时长', desc: '网站已活跃至少 10 个月' },
                                            { title: '内容质量', desc: '3-5 篇原创优质文章' },
                                            { title: '主题明确', desc: '清晰的内容主题 and 方向' },
                                        ] : lang === 'en' ? [
                                            { title: 'Website Type', desc: 'Personal or serious project, not spam' },
                                            { title: 'Content Compliance', desc: 'Legal content, complies with law' },
                                            { title: 'Domain', desc: 'Own domain + HTTPS encryption' },
                                            { title: 'Activity', desc: 'Active for at least 10 months' },
                                            { title: 'Content Quality', desc: '3-5 original quality articles' },
                                            { title: 'Clear Topic', desc: 'Clear content theme and direction' },
                                        ] : [
                                            { title: 'Jenis Website', desc: 'Website kepemilikan pribadi, bukan spam' },
                                            { title: 'Kepatuhan Konten', desc: 'Konten legal sesuai hukum Indonesia' },
                                            { title: 'Domain', desc: 'Domain sendiri bukan perushaan + enkripsi wajib HTTPS' },
                                            { title: 'Aktivitas', desc: 'Website pernah aktif minimal 10 bulan' },
                                            { title: 'Kualitas Konten', desc: '3-5 artikel asli berkualitas tinggi' },
                                            { title: 'Topik Jelas', desc: 'Tema dan arah konten yang jelas' },
                                        ]).map((item, i) => (
                                            <Column key={i} gap="8">
                                                <Text variant="label-strong-xs" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.title}</Text>
                                                <Text variant="body-default-s" onBackground="neutral-medium">{item.desc}</Text>
                                            </Column>
                                        ))}
                                    </div>
                                </Column>
                            </div>

                            {/* Link Requirements */}
                            <div style={{
                                gridColumn: 'span 5',
                                background: 'var(--page-background)',
                                padding: '48px 32px',
                                position: 'relative',
                            }}>
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '3px', background: 'var(--accent-strong)' }} />
                                <Column gap="32">
                                    <Column gap="12">
                                        <Row gap="12" vertical="center">
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-strong)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'var(--accent-strong)'
                                            }}>02</div>
                                            <Text variant="heading-strong-s">{lang === 'zh' ? '链接要求' : lang === 'en' ? 'Link Requirements' : 'Persyaratan Link'}</Text>
                                        </Row>
                                    </Column>
                                    <Column gap="20">
                                        {(lang === 'zh' ? [
                                            { icon: '→', text: '必须提供专门的友链页面' },
                                            { icon: '→', text: '必须先添加本站链接' },
                                            { icon: '→', text: '链接必须公开可访问' },
                                            { icon: '→', text: '不使用 nofollow 属性' },
                                        ] : lang === 'en' ? [
                                            { icon: '→', text: 'Must have dedicated friend link page' },
                                            { icon: '→', text: 'Must add this site\'s link first' },
                                            { icon: '→', text: 'Link must be publicly accessible' },
                                            { icon: '→', text: 'No nofollow attribute' },
                                        ] : [
                                            { icon: '→', text: 'Wajib punya halaman khusus friend link' },
                                            { icon: '→', text: 'Pasang link situs ini terlebih dahulu' },
                                            { icon: '→', text: 'Link harus dapat diakses publik' },
                                            { icon: '→', text: 'Tidak menggunakan atribut nofollow' },
                                        ]).map((item, i) => (
                                            <Row key={i} gap="12" vertical="start">
                                                <Text variant="body-default-m" onBackground="accent-medium" style={{ fontWeight: 700 }}>{item.icon}</Text>
                                                <Text variant="body-default-s" onBackground="neutral-medium" style={{ flex: 1 }}>{item.text}</Text>
                                            </Row>
                                        ))}
                                    </Column>
                                </Column>
                            </div>

                            {/* Review Process */}
                            <div style={{
                                gridColumn: 'span 5',
                                background: 'var(--page-background)',
                                padding: '48px 32px',
                                position: 'relative',
                            }}>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '3px', height: '60px', background: 'var(--neutral-strong)' }} />
                                <Column gap="32">
                                    <Column gap="12">
                                        <Row gap="12" vertical="center">
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--neutral-strong)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'var(--neutral-strong)'
                                            }}>03</div>
                                            <Text variant="heading-strong-s">{lang === 'zh' ? '审核流程' : lang === 'en' ? 'Review Process' : 'Proses Review'}</Text>
                                        </Row>
                                    </Column>
                                    <Column gap="16">
                                        <Text variant="body-default-s" onBackground="neutral-medium">
                                            {lang === 'zh' ? '所有申请经过人工审核，评估基于：' : lang === 'en' ? 'All submissions are manually reviewed based on:' : 'Semua pengajuan direview manual berdasarkan:'}
                                        </Text>
                                        <Column gap="12">
                                            {(lang === 'zh' ? ['内容质量', '更新频率', '设计体验', '主题相关性'] : lang === 'en' ? ['Content quality', 'Update frequency', 'Design experience', 'Topic relevance'] : ['Kualitas konten', 'Frekuensi update', 'Pengalaman desain', 'Relevansi topik']).map((item, i) => (
                                                <Row key={i} gap="8" vertical="center">
                                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--neutral-strong)' }} />
                                                    <Text variant="body-default-s" onBackground="neutral-medium">{item}</Text>
                                                </Row>
                                            ))}
                                        </Column>
                                    </Column>
                                </Column>
                            </div>

                            {/* Maintenance */}
                            <div style={{
                                gridColumn: 'span 7',
                                background: 'var(--page-background)',
                                padding: '48px 40px',
                                position: 'relative',
                            }}>
                                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '60px', height: '3px', background: 'var(--brand-strong)' }} />
                                <Column gap="32">
                                    <Column gap="12">
                                        <Row gap="12" vertical="center">
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--brand-strong)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'var(--brand-strong)'
                                            }}>04</div>
                                            <Text variant="heading-strong-s">{lang === 'zh' ? '维护政策' : lang === 'en' ? 'Maintenance Policy' : 'Kebijakan Pemeliharaan'}</Text>
                                        </Row>
                                    </Column>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                        {(lang === 'zh' ? [
                                            { label: '定期检查', desc: '链接状态定期验证' },
                                            { label: '3 个月规则', desc: '不活跃超过 3 个月将移除' },
                                            { label: '可访问性', desc: '无法访问的网站将移除' },
                                        ] : lang === 'en' ? [
                                            { label: 'Regular Check', desc: 'Link status verified periodically' },
                                            { label: '3 Month Rule', desc: 'Removed if inactive over 3 months' },
                                            { label: 'Accessibility', desc: 'Inaccessible sites will be removed' },
                                        ] : [
                                            { label: 'Cek Berkala', desc: 'Status link diverifikasi secara berkala' },
                                            { label: 'Aturan 3 Bulan', desc: 'Dihapus jika tidak aktif lebih dari 3 bulan' },
                                            { label: 'Aksesibilitas', desc: 'Situs yang tidak dapat diakses akan dihapus' },
                                        ]).map((item, i) => (
                                            <Column key={i} gap="8">
                                                <Text variant="label-strong-xs" onBackground="brand-medium" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</Text>
                                                <Text variant="body-default-s" onBackground="neutral-medium">{item.desc}</Text>
                                            </Column>
                                        ))}
                                    </div>
                                </Column>
                            </div>
                        </div>

                        {/* CTA */}
                        <div style={{ padding: '80px 40px', borderTop: '1px solid var(--neutral-alpha-weak)', position: 'relative', textAlign: 'center' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '2px solid var(--brand-strong)', borderLeft: '2px solid var(--brand-strong)' }} />
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', borderTop: '2px solid var(--accent-strong)', borderRight: '2px solid var(--accent-strong)' }} />
                            <Column gap="24" horizontal="center" align="center">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="cta-button"
                                    style={{
                                        background: 'transparent', border: '2px solid var(--neutral-alpha-medium)', borderRadius: '0', padding: '16px 48px',
                                        fontSize: '14px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    {lang === 'zh' ? '提交申请' : lang === 'en' ? 'Submit Request' : 'Ajukan Pertemanan'}
                                </button>
                                <Text variant="body-default-xs" onBackground="neutral-weak" style={{ opacity: 0.6 }}>
                                    {lang === 'zh' ? '每月限 2 次提交' : lang === 'en' ? 'Max 2 submissions per month' : 'Maksimal 2x pengajuan per bulan'}
                                </Text>
                            </Column>
                        </div>
                    </Column>
                </RevealFx>
            </Column>

            <Column fillWidth horizontal="center" align="center" marginTop="128" gap="40">
                <RevealFx speed="slow" translateY="20">
                    <Column horizontal="center" gap="24">
                        <Line height="40" background="brand-alpha-strong" vert />
                        <Text variant="heading-default-l" align="center" style={{ maxWidth: '500px', fontStyle: 'italic', opacity: 0.9 }}>
                            &ldquo;{teman.quote}&rdquo;
                        </Text>
                    </Column>
                </RevealFx>
            </Column>

            <Twikoo lang={lang} />

            <style dangerouslySetInnerHTML={{ __html: `
                .cta-button:hover {
                    border-color: var(--brand-strong) !important;
                    color: var(--brand-strong) !important;
                    transform: translateY(-2px);
                }
                @media (max-width: 768px) {
                    .friend-request-grid { grid-template-columns: 1fr !important; }
                    .friend-request-grid > div { grid-column: span 1 !important; }
                }
            `}} />
        </Column>

        {showModal && (
            <FriendRequestModal 
                lang={lang} 
                onClose={() => setShowModal(false)} 
            />
        )}
        </>
    );
};
