import { getPosts } from "@/utils/utils";
import { baseURL, getContent, person } from "@/resources";
import { NextRequest, NextResponse } from "next/server";
import { getPublicFileSize } from "@/utils/file";

const LANG_CONFIG: Record<string, { xmlLang: string, label: string }> = {
  id: { xmlLang: "id-ID", label: "Indonesian" },
  en: { xmlLang: "en-US", label: "English" },
  zh: { xmlLang: "zh-CN", label: "Chinese" },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  
  if (!LANG_CONFIG[lang]) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const { xmlLang, label } = LANG_CONFIG[lang];
  const { blog } = getContent(lang);
  const posts = getPosts(lang);
  
  const sortedPosts = posts.sort((a, b) => {
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
    <title>${blog.title} (${label})</title>
    <link>${baseURL}/${lang}/blog</link>
    <description>${blog.description}</description>
    <language>${xmlLang}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseURL}/${lang}/rss.xml" rel="self" type="application/rss+xml" />
    <managingEditor>${person.email} (${person.name})</managingEditor>
    <webMaster>${person.email} (${person.name})</webMaster>
    <image>
      <url>${baseURL}${person.avatar || "/images/author.jpg"}</url>
      <title>${blog.title}</title>
      <link>${baseURL}/${lang}/blog</link>
    </image>
    ${sortedPosts.map((post) => {
      const imageType = post.metadata.image?.endsWith(".png") ? "image/png" : "image/jpeg";
      const fullImageUrl = post.metadata.image ? (post.metadata.image.startsWith('http') ? post.metadata.image : `${baseURL}${post.metadata.image}`) : null;
      const fileSize = post.metadata.image ? getPublicFileSize(post.metadata.image) : 0;
      
      // Split tags into multiple category elements
      const categories = post.metadata.tag 
        ? post.metadata.tag.split(/[,,;]+/).map(t => t.trim()).filter(t => t.length > 0)
        : [];

      return `
    <item>
      <title>${post.metadata.title}</title>
      <link>${baseURL}/${lang}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseURL}/${lang}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.metadata.summary}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <dc:creator>${person.name}</dc:creator>
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
