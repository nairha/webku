"use client";

import Image from "next/image";
import Link from "next/link";

interface BlogPostCardProps {
  post: {
    slug: string;
    metadata: {
      title: string;
      summary?: string;
      image?: string;
      publishedAt: string;
      tag?: string;
      tech?: string;
    };
    wordCount?: number;
  };
  locale?: string;
}

function formatPostDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function BlogPostCard({ post, locale = "id" }: BlogPostCardProps) {
  const tags = [
    ...(post.metadata.tag
      ? post.metadata.tag.split(",").map((t) => t.trim()).filter(Boolean)
      : []),
    ...(post.metadata.tech
      ? post.metadata.tech.split(",").map((t) => t.trim()).filter(Boolean)
      : []),
  ];

  const wordCount = post.wordCount || 0;
  const dateStr = formatPostDate(post.metadata.publishedAt);
  const hasImage = Boolean(post.metadata.image);

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="blog-post-card"
    >
      <div className="blog-post-card-body">
        {/* Left accent bar */}
        <span className="blog-post-card-accent" />

        <div className="blog-post-card-content">
          {/* Title */}
          <h2 className="blog-post-card-title">{post.metadata.title}</h2>

          {/* Meta row */}
          <div className="blog-post-card-meta">
            <span className="blog-post-card-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {dateStr}
            </span>
            {tags.length > 0 && (
              <span className="blog-post-card-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                {tags[0]}
              </span>
            )}
            {wordCount > 0 && (
              <span className="blog-post-card-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 7 4 4 20 4 20 7" />
                  <line x1="9" y1="20" x2="15" y2="20" />
                  <line x1="12" y1="4" x2="12" y2="20" />
                </svg>
                {wordCount} 字
              </span>
            )}
          </div>

          {/* Summary */}
          {post.metadata.summary && (
            <p className="blog-post-card-summary">{post.metadata.summary}</p>
          )}

          {/* Tags row */}
          {tags.length > 0 && (
            <div className="blog-post-card-tags">
              {tags.map((tag) => (
                <span key={tag} className="blog-post-card-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail */}
        {hasImage && (
          <div className="blog-post-card-thumb">
            <Image
              src={post.metadata.image!}
              alt={post.metadata.title}
              width={160}
              height={120}
              className="blog-post-card-thumb-img"
            />
          </div>
        )}
      </div>
    </Link>
  );
}
