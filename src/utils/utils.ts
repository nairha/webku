import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type Team = {
  name: string;
  role: string;
  avatar: string;
  github: string;
};

type Metadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  tech?: string;
  team: Team[];
  link?: string;
  github?: string;
  demo?: string;
};

type TalkMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  venue: string;
  location: string;
  image?: string;
  organizations?: string[];
  eventDate: string;
  eventTime?: string;
  link?: string;
};

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    console.error(`[MDX DEBUG] Directory NOT FOUND: ${dir}`);
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((file) => {
      const filePath = path.join(dir, file);
      const isFile = fs.statSync(filePath).isFile();
      const isMDX = path.extname(file) === ".mdx";
      return isFile && isMDX;
    });
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    subtitle: data.subtitle || "",
    publishedAt: data.publishedAt || "",
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || "",
    tech: data.tech || "",
    team: data.team || [],
    link: data.link || "",
    github: data.github || "",
    demo: data.demo || "",
  };

  return { metadata, content };
}

function readTalkMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: TalkMetadata = {
    title: data.title || "",
    publishedAt: data.publishedAt || "",
    summary: data.summary || "",
    venue: data.venue || "",
    location: data.location || "",
    image: data.image || "",
    organizations: data.organizations || [],
    eventDate: data.eventDate || data.publishedAt || "",
    eventTime: data.eventTime || "",
    link: data.link || "",
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  if (process.env.NODE_ENV === "development") {
    console.log(`[MDX DEBUG] Found ${mdxFiles.length} MDX files in ${dir}`);
    console.log("[MDX DEBUG] Files:", mdxFiles);
  }
  return mdxFiles
    .map((file) => {
      const res = readMDXFile(path.join(dir, file));
      if (!res) return null;
      const slug = path.basename(file, path.extname(file));
      if (process.env.NODE_ENV === "development") {
        console.log(`[MDX DEBUG] Loaded file: ${file} -> slug: "${slug}" -> title: "${res.metadata.title}"`);
      }
      return {
        metadata: res.metadata,
        slug,
        content: res.content,
      };
    })
    .filter((post): post is { metadata: Metadata; slug: string; content: string } => post !== null);
}

function getTalkMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles
    .map((file) => {
      const res = readTalkMDXFile(path.join(dir, file));
      if (!res) return null;
      const slug = path.basename(file, path.extname(file));
      return {
        metadata: res.metadata,
        slug,
        content: res.content,
      };
    })
    .filter((talk): talk is { metadata: TalkMetadata; slug: string; content: string } => talk !== null)
    .sort((a, b) => {
      return new Date(b.metadata.eventDate).getTime() - new Date(a.metadata.eventDate).getTime();
    });
}

function resolveDir(...segments: string[]) {
  return path.join(process.cwd(), ...segments);
}

export function getPosts(lang = "id", customPath = ["src", "content", "blog"]) {
  const postsDir = resolveDir(...customPath, lang);
  return getMDXData(postsDir);
}

export function getTalks(lang = "id", customPath = ["src", "content", "berbicara"]) {
  const talksDir = resolveDir(...customPath, lang);
  return getTalkMDXData(talksDir);
}
