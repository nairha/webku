import { Line, Row, Text } from "@once-ui-system/core";
import Link from "next/link";
import type { Blog, Gallery, Home, Newsletter, Person, Social, Work, Sponsor, Speaking, Friends, Experiments, About } from "@/types";
import { getZhContent } from "./locales/zh";
import { getEnContent } from "./locales/en";

const person: Person = {
  firstName: "Davin",
  lastName: "Gahisan Mustafid",
  name: "Davin Gahisan Mustafid",
  role: "Frontend Engineer",
  avatar: "/images/author.jpg",
  email: "davin@nlfts.dev",
  location: "Asia/Jakarta",
  languages: ["Indonesia", "English", "Chinese"],
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/davingm",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/davingm",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/davingm_",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
  {
    name: "Bluesky",
    icon: "bluesky",
    link: "https://bsky.app/profile/davingm.com",
    essential: true,
  },
  {
    name: "Mastodon",
    icon: "mastodon",
    link: "https://mastodon.social/@davingm",
    essential: true,
  },
  {
    name: "Discord",
    icon: "discord",
    link: "https://discord.com/users/1420380292274982994",
    essential: true,
  },
  {
    name: "GitLab",
    icon: "gitlab",
    link: "https://gitlab.com/davingm",
    essential: true,
  },
  {
    name: "X.com",
    icon: "x",
    link: "https://x.com/davingm_dev",
    essential: true,
  },
  // cal.com
  {
    name: "Cal.com",
    icon: "cal",
    link: "https://cal.com/davingm",
    essential: true,
  },
  {
    name: "RSS",
    icon: "rss",
    link: "/rss.xml",
    essential: true,
  },
  {
    name: "开往-友链接力",
    icon: "train",
    link: "https://www.travellings.cn/go.html",
    essential: true,
  },
];

/**
 * Social links untuk pengguna China (zh locale).
 * Hanya platform yang dapat diakses tanpa VPN di daratan China.
 * Diblokir: LinkedIn, Instagram, Mastodon, Discord, X.com, Twitter
 * Aksesibel: GitHub, GitLab, Bluesky, Email, Cal.com, RSS, Travellings
 */
const socialZh: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/davingm",
    essential: true,
  },
  {
    name: "GitLab",
    icon: "gitlab",
    link: "https://gitlab.com/davingm",
    essential: true,
  },
  {
    name: "Bluesky",
    icon: "bluesky",
    link: "https://bsky.app/profile/davingm.com",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
  {
    name: "Cal.com",
    icon: "cal",
    link: "https://cal.com/davingm",
    essential: true,
  },
  {
    name: "RSS",
    icon: "rss",
    link: "/rss.xml",
    essential: true,
  },
  {
    name: "开往-友链接力",
    icon: "train",
    link: "https://www.travellings.cn/go.html",
    essential: true,
  },
];

const getIdContent = (person: Person, lang: string) => {
  const newsletter: Newsletter = {
    display: true,
    title: <>Berlangganan Buletin {person.firstName}</>,
    description: <>Buletin mingguan saya tentang kreativitas dan teknik (engineering)</>,
  };

  const blog: Blog = {
    path: "/blog",
    label: "Blog",
    title: "Blog Teknologi DavinGM - Seputar Design & Engineering",
    description: "Dapatkan wawasan terbaru seputar frontend engineering, web development, dan UI/UX design di blog resmi Davin Gahisan Mustafid.",
  };

  const work: Work = {
    path: "/proyek",
    label: "Proyek",
    title: `Proyek – ${person.name}`,
    description: `Proyek yang di kerjakan oleh ${person.name}`,
  };

  const gallery: Gallery = {
    path: "/galeri",
    label: "Galeri",
    title: `Photo gallery – ${person.name}`,
    description: `A photo collection by ${person.name}`,
    images: [
      {
        src: "/images/gallery/bandung1.jpg",
        alt: "Beautiful landscape of Bandung, Indonesia",
        orientation: "horizontal",
      },
      {
        src: "/images/gallery/banjar.jpg",
        alt: "Beautiful landscape of Banjar, Indonesia",
        orientation: "horizontal",
      },
      {
        src: "/images/gallery/danantara.jpg",
        alt: "Beautiful landscape of Jakarta, Indonesia",
        orientation: "vertical",
      },
      {
        src: "/images/gallery/podcast.jpg",
        alt: "Sesi rekaman podcast di Digital Amore",
        orientation: "horizontal",
      },
    ],
  };

  const sponsor: Sponsor = {
    path: "/sponsor",
    label: "Sponsor",
    title: "Dukung Karya Saya",
    description: "Bantu saya untuk terus berkarya dan berkontribusi di dunia open source.",
    hero: {
      headline: <>Bantu Saya Menghidupkan <br /> <Text as="span" onBackground="brand-strong">Ide Besar</Text> Berikutnya</>,
      subline: <>Setiap kontribusi Anda membantu saya meluangkan lebih banyak waktu untuk berkarya dan berbagi ilmu.</>,
      supportMe: "Support Me",
    },
    tiers: [
      {
        name: "GitHub Sponsors",
        description: "Dukung pengembangan berkelanjutan proyek open source saya secara langsung.",
        tag: "Open Source",
        buttonText: "Kirim Dukungan",
      },
      {
        name: "Buy Me a Coffee",
        description: "Belikan saya kopi untuk menemani malam-malam coding saya.",
        tag: "Personal",
        buttonText: "Kirim Dukungan",
      },
      {
        name: "Saweria",
        description: "Donasi santai melalui platform lokal Indonesia.",
        tag: "Local Support",
        buttonText: "Kirim Dukungan",
      },
    ],
    platforms: [
      {
        name: "GitHub Sponsors",
        icon: "github",
        link: "https://github.com/sponsors/davingm",
        label: "Sponsor",
      },
      {
        name: "Ko-fi",
        icon: "kofi",
        link: "https://ko-fi.com/davingm",
        label: "Dukung di Ko-fi",
      },
      {
        name: "Buy Me a Coffee",
        icon: "buymeacoffee",
        link: "https://buymeacoffee.com/davingm",
        label: "Traktir Kopi",
      },
    ],
    quote: "Kreativitas bukan tentang apa yang kita miliki, tapi bagaimana kita memberi dampak kepada orang lain.",
  };

  const speaking: Speaking = {
    path: "/berbicara",
    label: "Berbicara",
    title: "Public Speaking & Talks",
    description: `Sesi public speaking dan berbagi pengalaman oleh ${person.name}`,
  };

  const teman: Friends = {
    path: "/teman",
    label: "Teman",
    title: "Lingkaran Koneksi",
    description: "Membangun ekosistem melalui interaksi. Daftar entitas luar biasa yang membentuk orbit digital saya.",
    hero: {
      headline: <>Lingkaran <Text as="span" onBackground="brand-strong">Koneksi</Text></>,
      subline: <>Membangun ekosistem melalui interaksi. Daftar entitas luar biasa yang membentuk orbit digital saya.</>,
    },
    sections: {
      online: {
        title: "Digital Nodes",
        subtitle: "Online Connections",
      },
      aktif: {
        title: "Core Circle",
        subtitle: "Active Entities",
      },
      pena: {
        title: "Scripted Bonds",
        subtitle: "Pen Pals",
      },
    },
    quote: "Di Dunia ini tidak ada yang lebih Berarti dari pada Pertemana.",
    friends: {
      online: [
        { name: "Nairha", motto: "我來過，我見過，我掌握了", avatar: "https://avatars.githubusercontent.com/u/204519754?s=130&v=4", website: "https://nairha.nlfts.dev", stack: ["Angular"] },
        { name: "	Nafeez", motto: "I use this GitHub to record my development journey and projects. フロントエンド開発とUI/UXデザインに特に興味があります。 Always learning, always growing. @NLFTs @Vercel", avatar: "https://avatars.githubusercontent.com/u/182593937?v=4", website: "https://tokita.nlfts.dev", stack: ["Next"] },
      ],
      aktif: [
        { name: "Vahllzzzz", motto: "Life Is But A Dream.", avatar: "https://avatars.githubusercontent.com/u/202130049?s=130&v=4", website: "https://vahllzzzz.nlfts.dev", stack: ["Nuxt"] },
        { name: "Bara", motto: "My daily life it's usually.", avatar: "https://avatars.githubusercontent.com/u/228843429?s=130&v=4", website: "https://game-devbr0.nlfts.dev/", stack: ["Nuxt"] },
        { name: "KakaViangi", motto: "Hanya orang biasa yang menyukai alam @NFLTs.", avatar: "https://avatars.githubusercontent.com/u/228332586?s=130&v=4", website: "https://destkaa.nlfts.dev/", stack: ["Nuxt"] },
        { name: "Radiedtya", motto: "Just a Rocky", avatar: "https://avatars.githubusercontent.com/u/226198461?v=4", website: "https://xoryn.nlfts.dev", stack: ["React"] },
        { name: "Lintang", motto: "Students of Bandung", avatar: "https://avatars.githubusercontent.com/u/216552062?v=4", website: "https://lintang.nlfts.dev", stack: ["Nuxt"] },
        { name: "Sidikqst", motto: "infokan link github", avatar: "https://avatars.githubusercontent.com/u/230048582?v=4", website: "https://sidiktsq.nlfts.dev", stack: ["Nuxt"] },
      ],
      pena: [],
    },
  };

  const experimen: Experiments = {
    path: "/experimen",
    label: "Experimen",
    title: `Experimen – ${person.name}`,
    description: `Daftar repositori GitHub dengan analisis framework otomatis oleh ${person.name}`,
    hero: {
      headline: <>Eksperimen <Text as="span" onBackground="brand-strong">&</Text> Proyek</>,
      subline: <>Eksplorasi teknologi melalui repositori GitHub saya. Sistem ini secara otomatis menganalisis framework, bahasa, dan aktivitas terbaru secara real-time.</>,
    },
    github: {
      display: true,
      username: "davingm",
      revalidate: 604800,
    },
  };

  const home: Home = {
    path: "/",
    image: "/images/og/ogimage.png",
    label: "Beranda",
    title: `${person.name} | Frontend Engineer & Web Developer`,
    description: `Situs portofolio ${person.name}, seorang ${person.role} spesialis Next.js dan Nuxt.js yang berfokus pada pengalaman pengguna yang intuitif.`,
    headline: <>Jangan katakan tidak pernah.</>,
    featured: {
      display: true,
      title: (
        <Row gap="12" vertical="center">
          <strong className="ml-4">Davin GM</strong>{" "}
          <Line background="brand-alpha-strong" vert height="20" />
          <Text marginRight="4" onBackground="brand-medium">
            Frontend Engineer
          </Text>
        </Row>
      ),
      href: "/proyek",
    },
    subline: (
      <>
        Halo, saya Davin GM, seorang Frontend Engineer di <Text as="span" size="xl" weight="strong">NLFTs</Text> yang berfokus pada perancangan antarmuka yang intuitif dan efisien.
      </>
    ),
    badges: [],
    paragraphs: [
      <>
        Mewujudkan ide-ide keren menjadi kenyataan adalah hasrat saya. Saya senang membangun alat yang membantu produktivitas diri sendiri dan orang lain. Anda bisa melihat <Link href={`/id/proyek`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>daftar proyek saya di sini</Link>.
      </>,
      <>
        Saya menulis tentang open source, coding, dan lainnya di <Link href={`/id/blog`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>artikel blog</Link>. Terkadang saya melakukan eksperimen interaktif di <Link href={`/id/experimen`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>halaman eksperimen</Link>.
      </>,
      <>
        Di luar coding, saya menyukai fotografi dan traveling. Saya memposting foto-foto saya di <Link href={`/id/galeri`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>halaman ini</Link>. Saya juga menyukai anime dan musik.
      </>
    ],
    tagline: (
      <>Halo! Saya {person.firstName}, seorang yang antusias dengan <Text as="span" onBackground="neutral-strong">Frontend Engineering</Text> dan <Text as="span" onBackground="neutral-strong">Design Engineering</Text>.</>
    ),
    labels: {
      social: "Platform Sosial",
      mail: "Atau kirim email langsung",
      projects: "Proyek Pilihan",
      support: "Jika Anda menyukai karya saya, pertimbangkan untuk mensponsori saya untuk mendukung keberlanjutan open source. Terima kasih!",
      sponsorEcosystem: "Ekosistem Sponsor",
      supportAuthor: `Dukung ${person.firstName}`,
    },
  };

  const about: About = {
    path: "/tentang",
    label: "Tentang",
    title: `Tentang ${person.name}`,
    description: `Pelajari lebih lanjut tentang ${person.name}, seorang Frontend Engineer yang berfokus pada Next.js dan Nuxt.js.`,
    tableOfContent: true,
    avatar: {
      display: true,
      src: person.avatar,
    },
    calendar: {
      display: true,
      link: "https://cal.com/davingm",
    },
  };

  return { newsletter, home, blog, work, gallery, sponsor, speaking, teman, experimen, about };
};

const getContent = (lang: string) => {
  if (lang === "en") return { person, social, ...getEnContent(person, lang) };
  if (lang === "zh") return { person, social: socialZh, ...getZhContent(person, lang) };
  return { person, social, ...getIdContent(person, "id") };
};

const newsletter = getIdContent(person, "id").newsletter;
const home = getIdContent(person, "id").home;
const blog = getIdContent(person, "id").blog;
const work = getIdContent(person, "id").work;
const gallery = getIdContent(person, "id").gallery;
const sponsor = getIdContent(person, "id").sponsor;
const speaking = getIdContent(person, "id").speaking;
const teman = getIdContent(person, "id").teman;

const githubConfig = {
  display: true,
  username: "davingm",
  revalidate: 604800,
};

export { person, social, newsletter, home, blog, work, gallery, sponsor, speaking, teman, getContent, githubConfig };
