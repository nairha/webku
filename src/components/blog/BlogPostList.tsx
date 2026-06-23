"use client";

import { useState } from "react";
import { BlogPostCard } from "./BlogPostCard";

interface Post {
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
}

interface BlogPostListProps {
  lang: string;
  posts: Post[];
}

const POSTS_PER_PAGE = 8;

const i18n = {
  id: {
    all: "Semua",
    notes: "Catatan",
    share: "Berbagi",
    scribble: "Coretan",
    original: "Original",
    prev: "← Sebelumnya",
    next: "Selanjutnya →",
    page: "Halaman",
    of: "dari",
    blogHeading: "Blog",
    searchPlaceholder: "Cari artikel... (Ctrl+K)",
  },
  en: {
    all: "All",
    notes: "Notes",
    share: "Share",
    scribble: "Scribble",
    original: "Original",
    prev: "← Previous",
    next: "Next →",
    page: "Page",
    of: "of",
    blogHeading: "Blog",
    searchPlaceholder: "Search articles... (Ctrl+K)",
  },
  zh: {
    all: "全部",
    notes: "笔记",
    share: "分享",
    scribble: "随笔",
    original: "原创",
    prev: "← 上一页",
    next: "下一页 →",
    page: "第",
    of: "共",
    blogHeading: "博客",
    searchPlaceholder: "搜索文章... (Ctrl+K)",
  },
};

export function BlogPostList({ lang, posts }: BlogPostListProps) {
  const t = i18n[lang as keyof typeof i18n] ?? i18n.id;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  // Sort posts by date descending
  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  // Filter helpers
  const filterByTab = (tab: string, list: Post[]) => {
    if (tab === "all") return list;
    // Broad keyword mapping — covers ID, EN, ZH tag variations
    const keyMap: Record<string, string[]> = {
      notes:    ["catatan", "note", "notes", "journal", "jurnal", "笔记", "随记", "log", "diary"],
      share:    ["berbagi", "share", "sharing", "分享", "rekomendasi", "recommendation"],
      scribble: ["coretan", "scribble", "opini", "opinion", "随笔", "思考", "refleksi", "reflection"],
      original: ["original", "原创", "eksklusif", "exclusive", "tutorial", "guide", "panduan"],
    };
    const keys = keyMap[tab] ?? [];
    return list.filter((p) =>
      keys.some((k) =>
        (p.metadata.tag || "").toLowerCase().split(",").map(s => s.trim()).some(t => t.includes(k)) ||
        (p.metadata.tech || "").toLowerCase().split(",").map(s => s.trim()).some(t => t.includes(k))
      )
    );
  };

  // Tab counts (always from full sorted list)
  const countAll      = sortedPosts.length;
  const countNotes    = filterByTab("notes",    sortedPosts).length;
  const countShare    = filterByTab("share",    sortedPosts).length;
  const countScribble = filterByTab("scribble", sortedPosts).length;
  const countOriginal = filterByTab("original", sortedPosts).length;

  // Always show all tabs regardless of count — future posts will fill them
  const tabs = [
    { key: "all",      label: t.all,      count: countAll },
    { key: "notes",    label: t.notes,    count: countNotes },
    { key: "share",    label: t.share,    count: countShare },
    { key: "scribble", label: t.scribble, count: countScribble },
    { key: "original", label: t.original, count: countOriginal },
  ];

  // Filtered posts for active tab
  const filteredPosts = filterByTab(activeTab, sortedPosts);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIdx   = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts  = filteredPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handlePage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of post list
    const el = document.getElementById("blog-post-list-top");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Build page numbers to show (max 5 visible)
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  // Build SEO-friendly href for pagination (crawlable by Googlebot)
  const getPageHref = (page: number) => `?page=${page}`;

  return (
    <div className="blog-post-list" id="blog-post-list-top">
      {/* H1 — required for SEO: signals page topic to crawlers */}
      <h1 className="blog-list-heading">{t.blogHeading}</h1>

      {/* Tab bar + Search trigger — same row */}
      <div className="blog-tabs-row">
        {/* Tab bar — uses <a> with href for crawlability */}
        <nav aria-label="Blog categories" className="blog-tabs">
          {tabs.map((tab, i) => (
            <a
              key={tab.key}
              href={tab.key === "all" ? "?" : `?tab=${tab.key}`}
              onClick={(e) => {
                e.preventDefault();
                handleTabChange(tab.key);
              }}
              aria-current={activeTab === tab.key ? "page" : undefined}
              className={`blog-tab${activeTab === tab.key ? " blog-tab--active" : ""}`}
            >
              {i === 0 && <span className="blog-tab-home-icon">🏠</span>}
              {tab.label}
              <span className="blog-tab-count">{tab.count}</span>
            </a>
          ))}
        </nav>

        {/* Search trigger — opens Algolia SearchModal via Ctrl+K */}
        <button
          type="button"
          className="blog-search-trigger"
          onClick={() => {
            // Dispatch a synthetic Ctrl+K to open the global SearchModal
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
          }}
          aria-label={t.searchPlaceholder}
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="blog-search-trigger-text">{t.searchPlaceholder}</span>
          <kbd className="blog-search-kbd">Ctrl+K</kbd>
        </button>
      </div>

      {/* Post cards */}
      <div className="blog-post-cards">
        {pagePosts.map((post) => (
          <BlogPostCard
            key={post.slug}
            post={post}
            locale={lang}
          />
        ))}
      </div>

      {/* Pagination — uses <a> with href so Googlebot can follow to page 2, 3, etc. */}
      {totalPages > 1 && (
        <nav aria-label="Blog pagination" className="blog-pagination">
          {/* Prev */}
          {currentPage === 1 ? (
            <span
              className="blog-page-btn blog-page-btn--nav blog-page-btn--disabled"
              aria-disabled="true"
            >
              {t.prev}
            </span>
          ) : (
            <a
              href={getPageHref(currentPage - 1)}
              className="blog-page-btn blog-page-btn--nav"
              onClick={(e) => { e.preventDefault(); handlePage(currentPage - 1); }}
            >
              {t.prev}
            </a>
          )}

          {/* Page numbers */}
          <div className="blog-page-numbers">
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-before-${getPageNumbers()[i + 1] ?? "end"}`} className="blog-page-ellipsis">…</span>
              ) : (
                <a
                  key={p}
                  href={getPageHref(p as number)}
                  aria-current={currentPage === p ? "page" : undefined}
                  className={`blog-page-btn${currentPage === p ? " blog-page-btn--active" : ""}`}
                  onClick={(e) => { e.preventDefault(); handlePage(p as number); }}
                >
                  {p}
                </a>
              )
            )}
          </div>

          {/* Next */}
          {currentPage === totalPages ? (
            <span
              className="blog-page-btn blog-page-btn--nav blog-page-btn--disabled"
              aria-disabled="true"
            >
              {t.next}
            </span>
          ) : (
            <a
              href={getPageHref(currentPage + 1)}
              className="blog-page-btn blog-page-btn--nav"
              onClick={(e) => { e.preventDefault(); handlePage(currentPage + 1); }}
            >
              {t.next}
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
