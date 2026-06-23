// Server Component — no "use client", safe to use node:fs via getPosts
import { getPosts } from "@/utils/utils";
import { CalendarWidget } from "./CalendarWidget";

interface BlogRightSidebarProps {
  lang: string;
}

const i18n = {
  id: {
    siteStats:      "Statistik Situs",
    articles:       "Artikel",
    categories:     "Kategori",
    tags:           "Label",
    totalWords:     "Total Kata",
    runningDays:    "Hari Berjalan",
    lastActivity:   "Aktivitas Terakhir",
    categoriesTitle:"Kategori",
  },
  en: {
    siteStats:      "Site Statistics",
    articles:       "Articles",
    categories:     "Categories",
    tags:           "Tags",
    totalWords:     "Total Words",
    runningDays:    "Running Days",
    lastActivity:   "Last Activity",
    categoriesTitle:"Categories",
  },
  zh: {
    siteStats:      "站点统计",
    articles:       "文章",
    categories:     "分类",
    tags:           "标签",
    totalWords:     "总字数",
    runningDays:    "运行天数",
    lastActivity:   "最后活动",
    categoriesTitle:"分类",
  },
};

/** Count words — runs server-side only */
function countWords(content: string): number {
  const stripped = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/[*_~>|]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  const cjk   = (stripped.match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
  const latin = stripped.replace(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g, "").split(/\s+/).filter(Boolean).length;
  return cjk + latin;
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

export function BlogRightSidebar({ lang }: BlogRightSidebarProps) {
  const t = i18n[lang as keyof typeof i18n] ?? i18n.id;

  const allPosts    = getPosts(lang, ["src", "content", "blog"]);
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );

  // ── Stats (computed server-side) ──────────────────────────
  const totalArticles = allPosts.length;
  const totalWords    = allPosts.reduce((s, p) => s + countWords(p.content), 0);

  const tagSet:      Set<string>            = new Set();
  const categoryMap: Record<string, number> = {};

  for (const post of allPosts) {
    const tags  = (post.metadata.tag  || "").split(",").map((s: string) => s.trim()).filter(Boolean);
    const techs = (post.metadata.tech || "").split(",").map((s: string) => s.trim()).filter(Boolean);
    for (const tag of tags) {
      tagSet.add(tag);
      categoryMap[tag] = (categoryMap[tag] || 0) + 1;
    }
    for (const tech of techs) tagSet.add(tech);
  }

  const earliest         = [...allPosts].sort((a, b) => new Date(a.metadata.publishedAt).getTime() - new Date(b.metadata.publishedAt).getTime())[0];
  const runningDays      = earliest ? daysSince(earliest.metadata.publishedAt) : 0;
  const lastActivityDays = sortedPosts[0] ? daysSince(sortedPosts[0].metadata.publishedAt) : 0;

  const daySuffix = lang === "zh" ? "天"   : lang === "en" ? " days"     : " hari";
  const agoSuffix = lang === "zh" ? "天前" : lang === "en" ? " days ago" : " hari lalu";

  const categoryEntries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Serialize only what CalendarWidget (client) needs — no full content
  const calendarPosts = sortedPosts.map((p) => ({
    slug:        p.slug,
    publishedAt: p.metadata.publishedAt,
    title:       p.metadata.title,
  }));

  return (
    <aside className="blog-right-sidebar">
      {/* ── Site Stats (SSR) ── */}
      <div className="sidebar-card">
        <div className="sidebar-card-title">
          <span className="sidebar-card-title-bar" />
          {t.siteStats}
        </div>
        <div className="sidebar-stats-list">
          <StatRow icon="article"  label={t.articles}     value={String(totalArticles)} />
          <StatRow icon="category" label={t.categories}   value={String(Object.keys(categoryMap).length)} />
          <StatRow icon="tag"      label={t.tags}         value={String(tagSet.size)} />
          <StatRow icon="words"    label={t.totalWords}   value={totalWords.toLocaleString()} />
          <StatRow icon="days"     label={t.runningDays}  value={`${runningDays}${daySuffix}`} />
          <StatRow icon="activity" label={t.lastActivity} value={`${lastActivityDays}${agoSuffix}`} />
        </div>
      </div>

      {/* ── Calendar (client island — only state is month navigation) ── */}
      <CalendarWidget lang={lang} posts={calendarPosts} />

      {/* ── Categories (SSR) ── */}
      {categoryEntries.length > 0 && (
        <div className="sidebar-card">
          <div className="sidebar-card-title">
            <span className="sidebar-card-title-bar" />
            {t.categoriesTitle}
          </div>
          <div className="sidebar-categories-list">
            {categoryEntries.map(([cat, count]) => (
              <div key={cat} className="sidebar-category-row">
                <span className="sidebar-category-name">{cat}</span>
                <span className="sidebar-category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

// ── StatRow — pure presentational, inlined in server component ──
function StatRow({ icon, label, value }: {
  icon: "article" | "category" | "tag" | "words" | "days" | "activity";
  label: string;
  value: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    article: (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="13" y2="16" />
      </svg>
    ),
    category: (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    tag: (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    words: (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
    days: (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    activity: (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  };

  return (
    <div className="sidebar-stat-row">
      <span className={`sidebar-stat-icon sidebar-stat-icon--${icon}`}>{icons[icon]}</span>
      <span className="sidebar-stat-label">{label}</span>
      <span className="sidebar-stat-value">{value}</span>
    </div>
  );
}
