import { getPosts } from "@/utils/utils";
import { baseURL, getContent, person } from "@/resources";
import { NextRequest, NextResponse } from "next/server";
import { getPublicFileSize } from "@/utils/file";

const LOCALES = ["id", "en", "zh"];

const RSS_LANG_MAP: Record<string, string> = {
  id: "id-ID",
  en: "en-US",
  zh: "zh-CN",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get("lang")?.toLowerCase();

  // Support both 'cn' and 'zh' as parameters
  const targetLang = langParam === "cn" ? "zh" : langParam;

  let postsToFeed = [];
  let feedLang = "id-ID";
  let feedTitle = "";
  let feedDescription = "";

  if (targetLang && LOCALES.includes(targetLang)) {
    const { blog } = getContent(targetLang);
    postsToFeed = getPosts(targetLang).map(p => ({ ...p, lang: targetLang }));
    feedLang = RSS_LANG_MAP[targetLang];
    feedTitle = `${blog.title} (${targetLang.toUpperCase()})`;
    feedDescription = blog.description;
  } else {
    // Master Feed
    const { blog } = getContent("id");
    postsToFeed = LOCALES.flatMap(lang => 
      getPosts(lang).map(post => ({ ...post, lang }))
    );
    feedLang = "id-ID";
    feedTitle = blog.title;
    feedDescription = blog.description;
  }

  const sortedPosts = postsToFeed.sort((a, b) => 
    new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );

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
    <title>${feedTitle}</title>
    <link>${baseURL}/blog</link>
    <description>${feedDescription}</description>
    <language>${feedLang}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseURL}/api/rss${langParam ? `?lang=${langParam}` : ""}" rel="self" type="application/rss+xml" />
    <atom:link href="${baseURL}/api/rss?lang=en" rel="alternate" hreflang="en" type="application/rss+xml" title="English Feed" />
    <atom:link href="${baseURL}/api/rss?lang=id" rel="alternate" hreflang="id" type="application/rss+xml" title="Indonesian Feed" />
    <atom:link href="${baseURL}/api/rss?lang=zh" rel="alternate" hreflang="zh" type="application/rss+xml" title="Chinese Feed" />
    <managingEditor>${person.email} (${person.name})</managingEditor>
    <webMaster>${person.email} (${person.name})</webMaster>
    <image>
      <url>${baseURL}${person.avatar || "/images/author.jpg"}</url>
      <title>${feedTitle}</title>
      <link>${baseURL}/blog</link>
    </image>
    ${sortedPosts.map((post) => {
      const imageType = post.metadata.image?.endsWith(".png") ? "image/png" : "image/jpeg";
      const fullImageUrl = post.metadata.image ? (post.metadata.image.startsWith('http') ? post.metadata.image : `${baseURL}${post.metadata.image}`) : null;
      const fileSize = post.metadata.image ? getPublicFileSize(post.metadata.image) : 0;
      
      const categories = post.metadata.tag 
        ? post.metadata.tag.split(/[,,;]+/).map(t => t.trim()).filter(t => t.length > 0)
        : [];

      // Only add language prefix if it's the master feed (no lang param)
      const displayTitle = !targetLang ? `[${post.lang.toUpperCase()}] ${post.metadata.title}` : post.metadata.title;

      return `
    <item>
      <title>${displayTitle}</title>
      <link>${baseURL}/${post.lang}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseURL}/${post.lang}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.metadata.summary}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <dc:creator>${person.name}</dc:creator>
      <dc:language>${RSS_LANG_MAP[post.lang]}</dc:language>
      ${categories.map(cat => `<category>${cat}</category>`).join('')}
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
