"use client";

import { useState } from "react";
import Link from "next/link";

interface CalendarPost {
  slug: string;
  publishedAt: string;
  title: string;
}

interface CalendarWidgetProps {
  lang: string;
  posts: CalendarPost[];
}

const monthNames = {
  id: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  zh: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
};

const dayNames = {
  id: ["Sen","Sel","Rab","Kam","Jum","Sab","Min"],
  en: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  zh: ["一","二","三","四","五","六","日"],
};

function getCalendarData(
  year: number,
  month: number,
  posts: CalendarPost[]
) {
  const firstDay    = new Date(year, month, 1).getDay();
  const startOffset = (firstDay + 6) % 7; // Mon = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // All days that have a published post in this month
  const postDays = new Set(
    posts
      .filter((p) => {
        const d = new Date(p.publishedAt);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map((p) => new Date(p.publishedAt).getDate())
  );

  return { startOffset, daysInMonth, postDays };
}

export function CalendarWidget({ lang, posts }: CalendarWidgetProps) {
  const realNow   = new Date();
  const realYear  = realNow.getFullYear();
  const realMonth = realNow.getMonth();
  const today     = realNow.getDate();

  const [calYear,  setCalYear]  = useState(realYear);
  const [calMonth, setCalMonth] = useState(realMonth);

  const handlePrevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else { setCalMonth(m => m - 1); }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else { setCalMonth(m => m + 1); }
  };

  const { startOffset, daysInMonth, postDays } = getCalendarData(calYear, calMonth, posts);
  const isCurrentMonth = calYear === realYear && calMonth === realMonth;

  const monthNamesLang = monthNames[lang as keyof typeof monthNames] ?? monthNames.en;
  const dayNamesArr    = dayNames[lang as keyof typeof dayNames]     ?? dayNames.en;
  const monthLabel     = lang === "zh"
    ? `${calYear}年 ${calMonth + 1}月`
    : `${monthNamesLang[calMonth]} ${calYear}`;

  // Build calendar cells (Mon-start grid)
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Recent posts (top 5, sorted by date desc — already sorted when passed in)
  const recentPosts = posts.slice(0, 5);

  function formatShortDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, "0")}`;
  }

  const prevLabel = lang === "zh" ? "上个月" : lang === "en" ? "Previous month" : "Bulan sebelumnya";
  const nextLabel = lang === "zh" ? "下个月" : lang === "en" ? "Next month"     : "Bulan berikutnya";
  const postTitle = lang === "zh" ? "本日有文章发布" : lang === "en" ? "Article published on this day" : "Ada artikel terbit hari ini";

  return (
    <div className="sidebar-card">
      {/* Header with nav buttons */}
      <div className="sidebar-card-title sidebar-calendar-header">
        <span className="sidebar-card-title-bar" />
        <span className="sidebar-calendar-month-label">{monthLabel}</span>
        <span className="sidebar-calendar-nav">
          <button
            className="sidebar-cal-nav-btn"
            aria-label={prevLabel}
            type="button"
            onClick={handlePrevMonth}
          >
            {"<"}
          </button>
          <button
            className="sidebar-cal-nav-btn"
            aria-label={nextLabel}
            type="button"
            onClick={handleNextMonth}
          >
            {">"}
          </button>
        </span>
      </div>

      <div className="sidebar-calendar">
        {/* Day-of-week headers */}
        <div className="sidebar-cal-days-header">
          {dayNamesArr.map((d) => (
            <span key={d} className="sidebar-cal-day-name">{d}</span>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="sidebar-cal-grid">
          {cells.map((cell, i) => {
            const isToday   = isCurrentMonth && cell === today;
            const isPostDay = cell !== null && postDays.has(cell);
            const cellKey   = cell !== null
              ? `day-${calYear}-${calMonth}-${cell}`
              : `empty-${calYear}-${calMonth}-${i}`;

            return (
              <span
                key={cellKey}
                title={isPostDay ? postTitle : undefined}
                className={[
                  "sidebar-cal-cell",
                  cell === null ? "sidebar-cal-empty"    : "",
                  isToday       ? "sidebar-cal-today"    : "",
                  isPostDay     ? "sidebar-cal-has-post" : "",
                ].filter(Boolean).join(" ")}
              >
                {cell ?? ""}
              </span>
            );
          })}
        </div>
      </div>

      {/* Recent posts below calendar */}
      <div className="sidebar-recent-posts">
        {recentPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/${lang}/blog/${post.slug}`}
            className="sidebar-recent-post-row"
          >
            <span className="sidebar-recent-post-title">{post.title}</span>
            <span className="sidebar-recent-post-date">
              {formatShortDate(post.publishedAt)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
