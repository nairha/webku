import { getPosts } from "@/utils/utils";
import { baseURL, getContent, person } from "@/resources";
import { NextResponse } from "next/server";
import { getPublicFileSize } from "@/utils/file";

const LOCALES = ["id", "en", "zh"];

// Mapping internal language codes to RSS-standard locale codes
const RSS_LANG_MAP: Record<string, string> = {
  id: "id-ID",
  en: "en-US",
  zh: "zh-CN",
};

export async function GET() {
  const { blog } = getContent("id");
  
  // Collect all posts from all supported languages
  const allPosts = LOCALES.flatMap(lang => {
    return getPosts(lang).map(post => ({ ...post, lang }));
  });

  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const lastBuildDate = sortedPosts.length > 0 
    ? new Date(sortedPosts[0].metadata.publishedAt).toUTCString()
    : new Date().toUTCString();

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${blog.title}</title>
    <link>${baseURL}/blog</link>
    <description>${blog.description}</description>
    <language>id-ID</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseURL}/rss.xml" rel="self" type="application/rss+xml" />
    <atom:link href="${baseURL}/id/rss.xml" rel="alternate" hreflang="id" type="application/rss+xml" title="Indonesian Feed" />
    <atom:link href="${baseURL}/en/rss.xml" rel="alternate" hreflang="en" type="application/rss+xml" title="English Feed" />
    <atom:link href="${baseURL}/zh/rss.xml" rel="alternate" hreflang="zh" type="application/rss+xml" title="Chinese Feed" />
    <managingEditor>${person.email} (${person.name})</managingEditor>
    <webMaster>${person.email} (${person.name})</webMaster>
    <image>
      <url>${baseURL}${person.avatar || "/images/author.jpg"}</url>
      <title>${blog.title}</title>
      <link>${baseURL}/blog</link>
    </image>
    ${sortedPosts.map((post) => {
      const imageType = post.metadata.image?.endsWith(".png") ? "image/png" : "image/jpeg";
      const fullImageUrl = post.metadata.image ? (post.metadata.image.startsWith('http') ? post.metadata.image : `${baseURL}${post.metadata.image}`) : null;
      const fileSize = post.metadata.image ? getPublicFileSize(post.metadata.image) : 0;
      
      // Split tags into multiple category elements (handles comma, semicolon, or space-separated)
      const categories = post.metadata.tag 
        ? post.metadata.tag.split(/[,,;]+/).map(t => t.trim()).filter(t => t.length > 0)
        : [];

      return `
    <item>
      <title>[${post.lang.toUpperCase()}] ${post.metadata.title}</title>
      <link>${baseURL}/${post.lang}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseURL}/${post.lang}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.metadata.summary}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <dc:creator>${person.name}</dc:creator>
      <dc:language>${RSS_LANG_MAP[post.lang] || post.lang}</dc:language>
      ${categories.map(cat => `<category>${cat}</category>`).join('')}
      <category>lang:${post.lang}</category>
      ${fullImageUrl ? `<enclosure url="${fullImageUrl}" length="${fileSize}" type="${imageType}" />` : ""}
      ${fullImageUrl ? `<media:content url="${fullImageUrl}" medium="image" type="${imageType}" />` : ""}
    </item>`;
    }).join("")}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
