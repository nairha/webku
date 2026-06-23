import { getPosts } from "@/utils/utils";
import { Grid } from "@once-ui-system/core";
import Post from "./Post";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  exclude?: string[];
  locale?: string;
}

export function Posts({
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
  locale = "id",
}: PostsProps) {
  let allBlogs = getPosts(locale, ["src", "content", "blog"]);

  // Exclude by slug (exact match)
  if (exclude.length) {
    allBlogs = allBlogs.filter((post) => !exclude.includes(post.slug));
  }

  const sortedBlogs = allBlogs.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedBlogs = range
    ? sortedBlogs.slice(range[0] - 1, range.length === 2 ? range[1] : sortedBlogs.length)
    : sortedBlogs;

  return (
    <>
      {displayedBlogs.length > 0 && (
        <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
          {displayedBlogs.map((post) => (
            <Post
              key={post.slug}
              post={{
                slug: post.slug,
                metadata: {
                  title: post.metadata.title,
                  image: post.metadata.image,
                  publishedAt: post.metadata.publishedAt,
                  tag: post.metadata.tag,
                  tech: post.metadata.tech,
                },
              }}
              thumbnail={thumbnail}
              direction={direction}
              locale={locale}
            />
          ))}
        </Grid>
      )}
    </>
  );
}
