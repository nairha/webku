import { Meta, Schema } from "@once-ui-system/core";
import { getContent, baseURL } from "@/resources";
import { getPosts } from "@/utils/utils";
import { BlogLeftSidebar } from "@/components/blog/BlogLeftSidebar";
import { BlogRightSidebar } from "@/components/blog/BlogRightSidebar";
import { BlogPostList } from "@/components/blog/BlogPostList";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { blog } = getContent(lang);
  const metadata = Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `${baseURL}/api/og/generate?title=${encodeURIComponent(blog.title)}`,
    path: `/${lang}${blog.path}`,
    type: "website",
  });

  return {
    ...metadata,
    description: blog.description,
    alternates: {
      canonical: `${baseURL}/${lang}${blog.path}`,
      languages: {
        en: `${baseURL}/en/blog`,
        id: `${baseURL}/id/blog`,
        zh: `${baseURL}/zh/blog`,
        "x-default": `${baseURL}/blog`,
      },
    },
  };
}

export default async function Blog({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { blog, person, home } = getContent(lang);

  // Fetch posts on the server and pass to client components
  const allPosts = getPosts(lang, ["src", "content", "blog"]);

  // Collect all unique tags for the left sidebar
  const tagSet = new Set<string>();
  for (const post of allPosts) {
    const tags  = (post.metadata.tag  || "").split(",").map((s) => s.trim()).filter(Boolean);
    const techs = (post.metadata.tech || "").split(",").map((s) => s.trim()).filter(Boolean);
    for (const t of [...tags, ...techs]) tagSet.add(t);
  }
  const allTags = Array.from(tagSet);

  // Helper to estimate word count on the server to avoid serializing whole content
  const estimateWordCount = (content: string): number => {
    if (!content) return 0;
    const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
    const latinWords = content
      .replace(/[\u4e00-\u9fff]/g, "")
      .split(/\s+/)
      .filter(Boolean).length;
    return chineseChars + latinWords;
  };

  // Serialize posts for client component (only needed fields)
  const posts = allPosts.map((p) => ({
    slug: p.slug,
    metadata: {
      title:       p.metadata.title,
      summary:     p.metadata.summary,
      image:       p.metadata.image,
      publishedAt: p.metadata.publishedAt,
      tag:         p.metadata.tag,
      tech:        p.metadata.tech,
    },
    wordCount: estimateWordCount(p.content),
  }));

  return (
    <>
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={`/${lang}${blog.path}`}
        image={`${baseURL}/api/og/generate?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/${lang}${home.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <div className="blog-layout">
        {/* Left Sidebar — client (tags expand/collapse) */}
        <div className="blog-layout-left">
          <BlogLeftSidebar lang={lang} allTags={allTags} />
        </div>

        {/* Center: Post List — client (pagination + tabs) */}
        <div className="blog-layout-center">
          <BlogPostList lang={lang} posts={posts} />
        </div>

        {/* Right Sidebar — server */}
        <div className="blog-layout-right">
          <BlogRightSidebar lang={lang} />
        </div>
      </div>
    </>
  );
}
