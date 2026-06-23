import {
  Heading,
  Text,
  Column,
  Row,
  Meta,
  Schema,
  Avatar,
  SmartLink,
  Button,
  Icon,
  RevealFx,
  Tag,
} from "@once-ui-system/core";
import { getContent, baseURL } from "@/resources";
import styles from "./page.module.scss";

const STACK = [
  { name: "Nuxt.js",      icon: "nuxt",       color: "#00DC82" },
  { name: "Vue.js",       icon: "vue",        color: "#42B883" },
  { name: "TypeScript",   icon: "typescript", color: "#3178C6" },
  { name: "JavaScript",   icon: "javascript", color: "#F7DF1E" },
  { name: "Vite",         icon: "bolt",       color: "#646CFF" },
  { name: "SCSS / Sass",  icon: "sass",       color: "#CC6699" },
  { name: "Tailwind CSS", icon: "tailwind",   color: "#06B6D4" },
  { name: "Once UI",      icon: "sparkle",    color: "#10B981" },
  { name: "SQLite",       icon: "sqlite",     color: "#003B57" },
  { name: "git",          icon: "git",        color: "#4169E1" },
  { name: "Nitro",        icon: "rocket",     color: "#FB923C" },
  { name: "GSAP",         icon: "gsap",       color: "#88CE02" },
  { name: "Figma",        icon: "figma",      color: "#F24E1E" },
  { name: "Algolia",      icon: "algolia",    color: "#003DFF" },
];

const INTERESTS = [
  { emoji: "🎨", key: "drawing" },
  { emoji: "✍️", key: "writing" },
  { emoji: "📸", key: "photography" },
  { emoji: "🎌", key: "anime" },
  { emoji: "🎵", key: "music" },
];

const i18n = {
  id: {
    badge:      "Mahasiswa Ilmu & Rekayasa Perangkat Lunak",
    intro:      "Hai, Halo~",
    introGreet: "Apakah kamu di sini untuk berteman dengan davingm..?",
    introText:  "Sepertinya dia sedang pergi keluar sekarang... jadi izinkan saya memperkenalkan diri secara singkat :",
    facts: [
      "Penikmat (ISTP-T)",
      "Mahasiswa realistis daripada mengejar segalanya",
      "Jurusan : Ilmu dan Rekayasa Perangkat Lunak",
      "Fokus pada : TypeScript, Vue.js, Pinia dan Nuxt.js",
      "Senang mengutak-atik gadget kecil~",
    ],
    bio:        "",
    stack:      "Teknologi",
    hungry:     "Oh, ngomong-ngomong, aku lapar~! Jika kamu ingin mendukungku, lihat proyek berbayarku~",
    interests:  "Di Luar Coding",
    interestMap: {
      drawing:     "Menggambar & Ilustrasi",
      writing:     "Menulis",
      photography: "Fotografi",
      anime:       "Anime & Manga",
      music:       "Musik",
    },
    contact:     "Kontak & Kolaborasi",
    contactText: "Terbuka untuk diskusi, kolaborasi open source, atau sekadar ngobrol soal teknologi.",
    schedule:    "Jadwalkan Pertemuan",
    social:      "Temukan Saya",
    currently:   "Status",
    currentlyAt: "Sedang fokus menyelesaikan studi sambil mengerjakan beberapa proyek pribadi",
    location:    "Bandung, Indonesia",
    available:   "Terbuka untuk kolaborasi tertentu",
  },
  en: {
    badge:      "Software Science & Engineering Student",
    intro:      "Hey, hello~",
    introGreet: "Are you here to meet davingm...?",
    introText:  "Looks like he's out right now... so let me introduce myself briefly:",
    facts: [
      "Tech enthusiast and problem solver",
      "A student who prefers building over talking",
      "Major: Software Science & Engineering",
      "Focused on: TypeScript, Vue.js, and Nuxt.js",
      "Loves tinkering with small gadgets~",
      "Main tech: Ts + Vue.js + Pinia | Nuxt.js",
    ],
    bio:        "",
    stack:      "Tech Stack",
    hungry:     "Oh, by the way, I'm hungry~! If you'd like to support me, check out my paid projects~",
    interests:  "Outside of Code",
    interestMap: {
      drawing:     "Drawing & Illustration",
      writing:     "Writing",
      photography: "Photography",
      anime:       "Anime & Manga",
      music:       "Music",
    },
    contact:     "Contact & Collaboration",
    contactText: "Open to discussions, open source collaboration, or just a chat about tech.",
    schedule:    "Schedule a Meeting",
    social:      "Find Me",
    currently:   "Status",
    currentlyAt: "Focused on finishing studies while working on personal projects",
    location:    "Bandung, Indonesia",
    available:   "Open to certain collaborations",
  },
  zh: {
    badge:      "软件科学与工程专业学生",
    intro:      "嗨，你好~",
    introGreet: "你是来找 davingm 的吗...？",
    introText:  "他好像出去了... 那就让我简单介绍一下吧：",
    facts: [
      "技术爱好者与问题解决者",
      "更喜欢动手构建而不是空谈的学生",
      "专业：软件科学与工程",
      "专注于：TypeScript、Vue.js 和 Nuxt.js",
      "喜欢折腾小玩意~",
      "主要技术：Ts + Vue.js + Pinia | Nuxt.js",
    ],
    bio:        "",
    stack:      "技术栈",
    hungry:     "顺便说一句，我饿了~！如果你想支持我，来看看我的付费项目吧~",
    interests:  "编程之外",
    interestMap: {
      drawing:     "绘画与插画",
      writing:     "写作",
      photography: "摄影",
      anime:       "动漫与漫画",
      music:       "音乐",
    },
    contact:     "联系与合作",
    contactText: "欢迎讨论、开源合作，或只是聊聊技术与设计。",
    schedule:    "预约会议",
    social:      "找到我",
    currently:   "状态",
    currentlyAt: "专注完成学业，同时开发一些个人项目",
    location:    "印度尼西亚 万隆",
    available:   "开放特定合作",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { about } = getContent(lang);
  const metadata = Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    path: `/${lang}${about.path}`,
    image: about.image,
  });

  return {
    ...metadata,
    alternates: {
      canonical: `${baseURL}/${lang}/tentang`,
      languages: {
        en:          `${baseURL}/en/tentang`,
        id:          `${baseURL}/id/tentang`,
        zh:          `${baseURL}/zh/tentang`,
        "x-default": `${baseURL}/tentang`,
      },
    },
  };
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { about, person, social } = getContent(lang);
  const t = i18n[lang as keyof typeof i18n] ?? i18n.en;

  return (
    <Column maxWidth="m" fillWidth paddingY="xl" paddingX="m" gap="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/${lang}${about.path}`}
        title={about.title}
        description={about.description}
        author={{
          name: person.name,
          url: `${baseURL}/${lang}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* ── Hero ── */}
      <RevealFx translateY="8" speed="slow">
        <Row gap="20" vertical="center" className={styles.hero} fillWidth>
          {about.avatar.display && (
            <Avatar src={about.avatar.src} size="xl" />
          )}
          <Column gap="8" className={styles.heroText}>
            <Text variant="label-strong-s" onBackground="brand-medium">
              {t.badge}
            </Text>
            <Heading variant="display-strong-m">
              {person.name}
            </Heading>
            <Row gap="16" wrap>
              <Row gap="8" vertical="center">
                <Icon name="location" size="xs" onBackground="neutral-weak" />
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {t.location}
                </Text>
              </Row>
              <Row gap="8" vertical="center">
                <Icon name="check" size="xs" onBackground="accent-weak" />
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {t.available}
                </Text>
              </Row>
            </Row>
          </Column>
        </Row>
      </RevealFx>

      {/* ── Status ── */}
      <RevealFx translateY="8" delay={0.05} speed="slow">
        <Row
          gap="12"
          padding="16"
          radius="m"
          border="neutral-alpha-medium"
          background="neutral-alpha-weak"
          vertical="center"
          fillWidth
        >
          <Icon name="bolt" size="s" onBackground="brand-strong" />
          <Column gap="2">
            <Text variant="label-strong-xs" onBackground="neutral-weak">
              {t.currently}
            </Text>
            <Text variant="body-default-m">
              {t.currentlyAt}
            </Text>
          </Column>
        </Row>
      </RevealFx>

      {/* ── About ── */}
      <RevealFx translateY="8" delay={0.1} speed="slow">
        <Column gap="16" fillWidth>
          <Heading as="h2" variant="heading-strong-l">
            {t.intro}
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-strong">
            {t.introGreet}
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak">
            {t.introText}
          </Text>
          <Column gap="8" paddingLeft="4">
            {t.facts.map((fact) => (
              <Row key={fact} gap="12" vertical="start">
                <Text variant="body-default-m" onBackground="brand-weak">–</Text>
                <Text variant="body-default-m" onBackground="neutral-medium">
                  {fact}
                </Text>
              </Row>
            ))}
          </Column>
          <Text variant="body-default-m" onBackground="neutral-weak">
            {t.hungry}
          </Text>
        </Column>
      </RevealFx>

      {/* ── Tech Stack ── */}
      <RevealFx translateY="8" delay={0.15} speed="slow">
        <Column gap="16" fillWidth>
          <Heading as="h2" variant="heading-strong-l">
              {t.stack}
            </Heading>
          <div className={styles.stackGrid}>
            {STACK.map((tech) => (
              <Row
                key={tech.name}
                gap="8"
                paddingX="12"
                paddingY="8"
                radius="m"
                border="neutral-alpha-medium"
                background="neutral-alpha-weak"
                vertical="center"
              >
                <Icon name={tech.icon as never} size="s" onBackground="neutral-strong" />
                <Text variant="label-strong-s">
                  {tech.name}
                </Text>
              </Row>
            ))}
          </div>
        </Column>
      </RevealFx>

      {/* ── Interests ── */}
      <RevealFx translateY="8" delay={0.2} speed="slow">
        <Column gap="16" fillWidth>
          <Heading as="h2" variant="heading-strong-l">
            {t.interests}
          </Heading>
          <div className={styles.interestGrid}>
            {INTERESTS.map((item) => (
              <Row
                key={item.key}
                gap="8"
                paddingX="12"
                paddingY="8"
                radius="m"
                border="neutral-alpha-medium"
                background="neutral-alpha-weak"
                vertical="center"
              >
                <Text variant="body-default-m">{item.emoji}</Text>
                <Text variant="label-strong-s">
                  {t.interestMap[item.key as keyof typeof t.interestMap]}
                </Text>
              </Row>
            ))}
          </div>
        </Column>
      </RevealFx>

      {/* ── Social ── */}
      <RevealFx translateY="8" delay={0.25} speed="slow">
        <Column gap="16" fillWidth>
          <Heading as="h2" variant="heading-strong-l">
            {t.social}
          </Heading>
          <Row gap="12" wrap>
            {social.filter((s) => s.essential).map((s) => (
              <Button
                key={s.name}
                href={s.link}
                variant="secondary"
                size="s"
                prefixIcon={s.icon as never}
              >
                {s.name}
              </Button>
            ))}
          </Row>
        </Column>
      </RevealFx>

      {/* ── Contact ── */}
      {about.calendar.display && (
        <RevealFx translateY="8" delay={0.3} speed="slow">
          <Column
            gap="16"
            padding="24"
            radius="l"
            border="brand-alpha-medium"
            background="brand-alpha-weak"
            fillWidth
            className={styles.contactBox}
          >
            <Column gap="8">
              <Heading as="h2" variant="heading-strong-l">
                {t.contact}
              </Heading>
              <Text variant="body-default-m" onBackground="neutral-medium">
                {t.contactText}
              </Text>
            </Column>
            <Row gap="12" wrap className={styles.contactActions}>
              <Button
                href={about.calendar.link}
                variant="primary"
                size="m"
                prefixIcon="calendar"
              >
                {t.schedule}
              </Button>
              <Button
                href={`mailto:${person.email}`}
                variant="secondary"
                size="m"
                prefixIcon="email"
              >
                {person.email}
              </Button>
            </Row>
          </Column>
        </RevealFx>
      )}
    </Column>
  );
}
