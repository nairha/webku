import { Line, Row, Text } from "@once-ui-system/core";
import Link from "next/link";
import type { Blog, Gallery, Home, Newsletter, Person, Work, Sponsor, Speaking, Friends, Experiments, About } from "@/types";

export const getEnContent = (person: Person, lang: string) => {
  const newsletter: Newsletter = {
    display: true,
    title: <span key="newsletter-title">Subscribe to {person.firstName}'s Newsletter</span>,
    description: <span key="newsletter-desc">My weekly newsletter about creativity and engineering</span>,
  };


  const blog: Blog = {
    path: "/blog",
    label: "Blog",
    title: "DavinGM Tech Blog - Insights on Design and Engineering",
    description: "Stay updated with the latest insights on frontend engineering, web development, and UI/UX design from Davin Gahisan Mustafid's official blog.",
  };

  const work: Work = {
    path: "/proyek",
    label: "Projects",
    title: `Projects – ${person.name}`,
    description: `Projects worked on by ${person.name}`,
  };

  const gallery: Gallery = {
    path: "/galeri",
    label: "Gallery",
    title: `Photo Gallery – ${person.name}`,
    description: `A photo collection by ${person.name}`,
    images: [
      {
        src: "/images/gallery/bandung1.jpg",
        alt: "Beautiful landscape of Bandung, West Java, Indonesia",
        orientation: "horizontal",
      },
      {
        src: "/images/gallery/banjar.jpg",
        alt: "Beautiful landscape of Banjar, West Java, Indonesia",
        orientation: "horizontal",
      },
      {
        src: "/images/gallery/danantara.jpg",
        alt: "Danantara event in Jakarta, Indonesia",
        orientation: "vertical",
      },
      {
        src: "/images/gallery/podcast.jpg",
        alt: "Podcast recording session at Digital Amore",
        orientation: "horizontal",
      },
    ],
  };

  const sponsor: Sponsor = {
    path: "/sponsor",
    label: "Sponsor",
    title: "Support My Work",
    description: "Help me to continue creating and contributing to the open source world.",
    hero: {
      headline: <span key="sponsor-headline">Help Me Bring the <br /> <Text as="span" onBackground="brand-strong">Next Big Idea</Text> to Life</span>,
      subline: <span key="sponsor-subline">Every contribution you make helps me dedicate more time to creating and sharing knowledge.</span>,
      supportMe: "Support Me",
    },
    tiers: [
      {
        name: "GitHub Sponsors",
        description: "Support the ongoing development of my open source projects directly.",
        tag: "Open Source",
        buttonText: "Send Support",
      },
      {
        name: "Buy Me a Coffee",
        description: "Buy me a coffee to accompany my coding nights.",
        tag: "Personal",
        buttonText: "Send Support",
      },
      {
        name: "Saweria",
        description: "Casual donation via Indonesian local platform.",
        tag: "Local Support",
        buttonText: "Send Support",
      },
    ],
    platforms: [
      {
        name: "GitHub Sponsors",
        icon: "github",
        link: "https://github.com/sponsors/davingm",
        label: "Sponsor here",
      },
      {
        name: "Ko-fi",
        icon: "kofi",
        link: "https://ko-fi.com/davingm",
        label: "Support on Ko-fi",
      },
      {
        name: "Buy Me a Coffee",
        icon: "buymeacoffee",
        link: "https://buymeacoffee.com/davingm",
        label: "Buy me a coffee",
      },
    ],
    quote: "Creativity is not about what we have, but how we impact others.",
  };

  const speaking: Speaking = {
    path: "/berbicara",
    label: "Speaking",
    title: "Public Speaking & Talks",
    description: `Public speaking and experience sharing sessions by ${person.name}`,
  };

  const teman: Friends = {
    path: "/teman",
    label: "Friends",
    title: "Circle of Connections",
    description: "Building an ecosystem through interaction. A list of exceptional entities that form my digital orbit.",
    hero: {
      headline: <span key="friends-headline">Circle of <Text as="span" onBackground="brand-strong">Connections</Text></span>,
      subline: <span key="friends-subline">Building an ecosystem through interaction. A list of exceptional entities that form my digital orbit.</span>,
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
    quote: "In this world, nothing is more meaningful than friendship.",
    friends: {
      online: [
        { name: "Nairha", motto: "I came, I saw, I conquered", avatar: "https://avatars.githubusercontent.com/u/204519754?s=130&v=4", website: "https://nairha.nlfts.dev", stack: ["Angular"] },
        { name: "	Nafeez", motto: "I use this GitHub to record my development journey and projects. フロントエンド開発とUI/UXデザインに特に興味があります。 Always learning, always growing. @NLFTs @Vercel", avatar: "https://avatars.githubusercontent.com/u/182593937?v=4", website: "https://tokita.nlfts.dev", stack: ["Next"] },
        { name: "	Silo Kusuma", motto: "hello :)", avatar: "https://avatars.githubusercontent.com/u/159918505?v=4", website: "https://www.silokusuma.top/", stack: ["Next"] },
        { name: "Dauns", motto: "Elaina 🤤", avatar: "https://avatars.githubusercontent.com/u/147286216?v=4", website: "https://www.daunscode.com/", stack: ["Next"] },
      ],
      aktif: [
        { name: "Vahllzzzz", motto: "Life Is But A Dream.", avatar: "https://avatars.githubusercontent.com/u/202130049?s=130&v=4", website: "https://vahllzzzz.nlfts.dev", stack: ["Nuxt"] },
        { name: "Bara", motto: "My daily life it's usually.", avatar: "https://avatars.githubusercontent.com/u/228843429?s=130&v=4", website: "https://barabr0.nlfts.dev/", stack: ["Nuxt"] },
        { name: "KakaViangi", motto: "Just an ordinary person who loves nature @NFLTs.", avatar: "https://avatars.githubusercontent.com/u/228332586?s=130&v=4", website: "https://destkaa.nlfts.dev/", stack: ["Nuxt"] },
        { name: "Radiedtya", motto: "Just a Rocky", avatar: "https://avatars.githubusercontent.com/u/226198461?v=4", website: "https://xoryn.nlfts.dev", stack: ["React"] },
        { name: "Sidikqst", motto: "infokan link github", avatar: "https://avatars.githubusercontent.com/u/230048582?v=4", website: "https://sidiktsq.nlfts.dev", stack: ["Nuxt"] },
        { name: "Rehan", motto: "too many bottles of this wine we can't pronounce", avatar: "https://avatars.githubusercontent.com/u/218329504?v=4", website: "https://e.nlfts.dev", stack: ["Next"] },
      ],
      pena: [],
    },
  };

  const experimen: Experiments = {
    path: "/experimen",
    label: "Experimen",
    title: `Experimen – ${person.name}`,
    description: `GitHub repository list with automated framework analysis by ${person.name}`,
    hero: {
      headline: <span key="experimen-headline">Experiments <Text as="span" onBackground="brand-strong">&</Text> Projects</span>,
      subline: <span key="experimen-subline">Exploring technology through my GitHub repositories. This system automatically analyzes frameworks, languages, and recent activity in real-time.</span>,
    },
    github: {
      display: true,
      username: "davingm",
      revalidate: 604800,
    },
  };

  const home: Home = {
    path: "/",
    image: "/images/og/author.webp",
    label: "Home",
    title: `${person.name} | Frontend Engineer & Web Developer`,
    description: `${person.name}'s portfolio website, a ${person.role} specializing in Next.js and Nuxt.js, focusing on intuitive user experiences.`,
    headline: <span key="home-headline">Never say never.</span>,
    featured: {
      display: true,
      title: (
        <Row gap="12" vertical="center" key="home-featured-title">
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
      <span key="home-subline">
        Hi, I'm Davin GM, a frontend engineer at <Text as="span" size="xl" weight="strong">NLFTs</Text>. I design <br /> user and developer experiences into intuitive and efficient interfaces.
      </span>
    ),
    badges: [],
    paragraphs: [
      <span key="p1">
        Dreaming up cool ideas and making them come true is where my passion lies. I am enthusiastic about building tools that help myself and others to be more productive and enjoy the process of crafting. You can find my <Link href={`/en/proyek`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>full projects list here</Link>.
      </span>,
      <span key="p2">
        I write <Link href={`/en/blog`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>blog posts</Link> about open source, coding, etc. From time to time, I make some generative-art, interactivity experiments on <Link href={`/en/experimen`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>experiments page</Link>.
      </span>,
      <span key="p3">
        Outside of programming, I enjoy photography and traveling. I post <Link href={`/en/galeri`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>photos on this page</Link>. I also love anime and music.
      </span>
    ],
    tagline: (
      <span key="home-tagline">Hey! I'm {person.firstName}, a fanatical <Text as="span" onBackground="neutral-strong">frontend engineer</Text> and <Text as="span" onBackground="neutral-strong">design engineer</Text>.</span>
    ),
    labels: {
      social: "Find me on",
      mail: "Or mail me at",
      projects: "Featured Projects",
      support: "If you enjoy my work and find them useful, consider sponsor me and the ecosystem to help Open Source sustainable. Thank you!",
      sponsorEcosystem: "Sponsor the Ecosystem",
      supportAuthor: `Support ${person.firstName}`,
    },
  };

  const about: About = {
    path: "/tentang",
    label: "About",
    title: `About ${person.name}`,
    description: `Learn more about ${person.name}, a Frontend Engineer specializing in Next.js and Nuxt.js.`,
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
