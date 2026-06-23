import { Line, Row, Text } from "@once-ui-system/core";
import Link from "next/link";
import type { Blog, Gallery, Home, Newsletter, Person, Work, Sponsor, Speaking, Friends, Experiments, About } from "@/types";

export const getZhContent = (person: Person, lang: string) => {
  const newsletter: Newsletter = {
    display: true,
    title: <>订阅 {person.firstName} 的简报</>,
    description: <>我关于创意和工程的每周简报</>,
  };

  const blog: Blog = {
    path: "/blog",
    label: "博客",
    title: "DavinGM 技术博客 - 探索设计与工程领域",
    description: "在 Davin Gahisan Mustafid 的官方博客中获取关于前端工程、Web 开发和 UI/UX 设计的最新见解。",
  };

  const work: Work = {
    path: "/proyek",
    label: "项目",
    title: `项目 – ${person.name}`,
    description: `${person.name} 开发的项目`,
  };

  const gallery: Gallery = {
    path: "/galeri",
    label: "相册",
    title: `相片集 – ${person.name}`,
    description: `${person.name} 的相片合集`,
    images: [
      {
        src: "/images/gallery/bandung1.jpg",
        alt: "印度尼西亚西爪哇万隆的美丽风景",
        orientation: "horizontal",
      },
      {
        src: "/images/gallery/banjar.jpg",
        alt: "印度尼西亚西爪哇班查尔的美丽风景",
        orientation: "horizontal",
      },
      {
        src: "/images/gallery/danantara.jpg",
        alt: "印度尼西亚雅加达 Danantara 活动现场",
        orientation: "vertical",
      },
      {
        src: "/images/gallery/podcast.jpg",
        alt: "在 Digital Amore 录制播客的现场",
        orientation: "horizontal",
      },
    ],
  };

  const sponsor: Sponsor = {
    path: "/sponsor",
    label: "赞助",
    title: "支持我的工作",
    description: "帮助我继续创作并为开源世界做出贡献。",
    hero: {
      headline: <>帮助我赋予 <br /> <Text as="span" onBackground="brand-strong">下一个大创意</Text> 生命周期</>,
      subline: <>您的每一份贡献都将帮助我投入更多时间在创作和分享知识上。</>,
      supportMe: "支持我",
    },
    tiers: [
      {
        name: "GitHub Sponsors",
        description: "直接支持我开源项目的持续开发。",
        tag: "开源项目",
        buttonText: "发送支持",
      },
      {
        name: "Saweria",
        description: "通过印度尼西亚本地平台进行随心捐赠（需翻墙）。",
        tag: "本地支持",
        buttonText: "发送支持",
      },
    ],
    platforms: [
      {
        name: "GitHub Sponsors",
        icon: "github",
        link: "https://github.com/sponsors/davingm",
        label: "赞助我",
      },
      // Ko-fi & Buy Me a Coffee diblokir di China — dihapus dari tampilan ZH
    ],
    quote: "创意不在于我们拥有什么，而在于我们如何影响他人。",
  };

  const speaking: Speaking = {
    path: "/berbicara",
    label: "演讲",
    title: "公开演讲与分享",
    description: `${person.name} 的公开演讲和经验分享会`,
  };

  const teman: Friends = {
    path: "/teman",
    label: "朋友",
    title: "社交圈",
    description: "我数字轨道上的一些优秀的伙伴。",
    hero: {
      headline: <>社交 <Text as="span" onBackground="brand-strong">圈子</Text></>,
      subline: <>通过互动建立生态系统。这是构成我数字轨道的杰出实体列表。</>,
    },
    sections: {
      online: {
        title: "数字节点",
        subtitle: "在线连接",
      },
      aktif: {
        title: "核心圈子",
        subtitle: "活跃实体",
      },
      pena: {
        title: "笔友",
        subtitle: "文字往来",
      },
    },
    quote: "在这个世界上，没有什么比友谊更有意义了。",
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
    label: "实验",
    title: `实验 – ${person.name}`,
    description: `${person.name} 的 GitHub 仓库列表，包含自动框架分析。`,
    hero: {
      headline: <>实验 <Text as="span" onBackground="brand-strong">&</Text> 项目</>,
      subline: <>通过我的 GitHub 仓库探索技术。该系统实时自动分析框架、语言和最新动态。</>,
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
    label: "主页",
    title: `${person.name} | 前端工程师 & Web 开发者`,
    description: `${person.name} 的作品集，一位专注于 Next.js 和 Nuxt.js 的${person.role}，致力于打造直观的用户体验。`,
    headline: <>永不言弃。</>,
    featured: {
      display: true,
      title: (
        <Row gap="12" vertical="center">
          <strong className="ml-4">Davin GM</strong>{" "}
          <Line background="brand-alpha-strong" vert height="20" />
          <Text marginRight="4" onBackground="brand-medium">
            前端工程师
          </Text>
        </Row>
      ),
      href: "/proyek",
    },
    subline: (
      <>
        你好，我是 Davin GM，一名在 <Text as="span" size="xl" weight="strong">NLFTs</Text> 工作的前端工程师，我致力于将用户 and 开发者 experiences design 为直观且高效的界面。
      </>
    ),
    badges: [],
    paragraphs: [
      <>
        构思酷炫的想法并将其变为现实是我的热情所在。我热衷于构建能够帮助自己和他人提高生产力的工具，并享受创作的过程。您可以在这里找到我的 <Link href={`/zh/proyek`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>完整项目列表</Link>。
      </>,
      <>
        我撰写关于开源、编码等方面的 <Link href={`/zh/blog`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>博客文章</Link>。有时，我会在 <Link href={`/zh/experimen`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>实验页面</Link> 进行交互式实验。
      </>,
      <>
        在编程之余，我喜欢摄影和旅行。我会在 <Link href={`/zh/galeri`} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>这个页面上发布照片</Link>。我也喜欢动漫 and 音乐。
      </>
    ],
    tagline: (
      <>你好！我是 {person.firstName}，一位热衷于 <Text as="span" onBackground="neutral-strong">前端工程</Text> 和 <Text as="span" onBackground="neutral-strong">设计工程</Text> 。</>
    ),
    labels: {
      social: "社交平台",
      mail: "或者发送邮件給我",
      projects: "精选项目",
      support: "如果您喜欢我的作品，请考虑赞助我，以支持开源事业的可持续发展。谢谢！",
      sponsorEcosystem: "赞助生态系统",
      supportAuthor: `支持 ${person.firstName}`,
    },
  };

  const about: About = {
    path: "/tentang",
    label: "关于",
    title: `关于 ${person.name}`,
    description: `了解更多关于 ${person.name} 的信息，一位专注于 Next.js 和 Nuxt.js 的前端工程师。`,
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
