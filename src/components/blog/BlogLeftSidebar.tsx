"use client";

import { useState } from "react";
import { person, getContent } from "@/resources";
import Image from "next/image";
import Link from "next/link";

interface BlogLeftSidebarProps {
  lang: string;
  allTags: string[];
}

const i18n = {
  id: {
    announcement: "Pengumuman",
    announcementText: "Selamat datang di blog saya! Temukan artikel seputar teknologi, coding, dan pengembangan diri.",
    about: "Tentang",
    tags: "Label",
    more: "... Lebih banyak",
    collapse: "Sembunyikan",
    tagline: "Menulis tentang teknologi & kehidupan",
  },
  en: {
    announcement: "Announcement",
    announcementText: "Welcome to my blog! Find articles about technology, coding, and personal development.",
    about: "About",
    tags: "Tags",
    more: "... More",
    collapse: "Show less",
    tagline: "Writing about tech & life",
  },
  zh: {
    announcement: "公告",
    announcementText: "欢迎来到我的博客！在这里发现关于技术、编程和个人成长的文章。",
    about: "关于",
    tags: "标签",
    more: "... 更多",
    collapse: "收起",
    tagline: "写关于技术与生活的文章",
  },
};

const TAGS_VISIBLE_DEFAULT = 12;

// Social links shown in sidebar per locale
// ZH: exclude Bluesky (blocked in China)
const SOCIAL_NAMES_DEFAULT = ["GitHub", "Bluesky", "RSS"];
const SOCIAL_NAMES_ZH      = ["GitHub", "RSS"];

export function BlogLeftSidebar({ lang, allTags }: BlogLeftSidebarProps) {
  const t = i18n[lang as keyof typeof i18n] ?? i18n.id;
  const [showAllTags, setShowAllTags] = useState(false);

  const { social } = getContent(lang);
  const allowedNames = lang === "zh" ? SOCIAL_NAMES_ZH : SOCIAL_NAMES_DEFAULT;
  const socialLinks = social.filter((s) => allowedNames.includes(s.name));

  const visibleTags = showAllTags ? allTags : allTags.slice(0, TAGS_VISIBLE_DEFAULT);
  const hasMoreTags = allTags.length > TAGS_VISIBLE_DEFAULT;

  return (
    <aside className="blog-left-sidebar">
      {/* Profile Card */}
      <div className="sidebar-card profile-card">
        <div className="profile-avatar-wrap">
          <Image
            src={person.avatar}
            alt={person.name}
            width={80}
            height={80}
            className="profile-avatar"
          />
        </div>
        <div className="profile-name">{person.name}</div>
        <div className="profile-tagline">{t.tagline}</div>
        <div className="profile-socials">
          {socialLinks.map((s) => (
            <a
              key={s.name}
              href={s.link}
              target={s.name === "RSS" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className="profile-social-icon"
              title={s.name}
            >
              <SocialIcon name={s.name} />
            </a>
          ))}
        </div>
      </div>

      {/* Announcement Card */}
      <div className="sidebar-card">
        <div className="sidebar-card-title">
          <span className="sidebar-card-title-bar" />
          {t.announcement}
        </div>
        <p className="sidebar-announcement-text">{t.announcementText}</p>
        <Link href={`/${lang}/tentang`} className="sidebar-about-btn">
          {t.about}
        </Link>
      </div>

      {/* Tags Card */}
      <div className="sidebar-card">
        <div className="sidebar-card-title">
          <span className="sidebar-card-title-bar" />
          {t.tags}
        </div>
        <div className="sidebar-tags-wrap">
          {visibleTags.map((tag) => (
            <span key={tag} className="sidebar-tag">
              {tag}
            </span>
          ))}
          {hasMoreTags && (
            <button
              type="button"
              className="sidebar-tag sidebar-tag-more"
              onClick={() => setShowAllTags((v) => !v)}
            >
              {showAllTags ? t.collapse : t.more}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function SocialIcon({ name }: { name: string }) {
  if (name === "GitHub") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }
  if (name === "Bluesky") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
      </svg>
    );
  }
  if (name === "RSS") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
      </svg>
    );
  }
  return null;
}
