"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Flex, Row, ToggleButton, Column, Text, Icon } from "@once-ui-system/core";
import { person, social, getContent, display } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";
import Link from "next/link";

export const Header = () => {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/");
  const locale = segments[1] || "id";

  const getHref = (path: string) => {
    return `/${locale}${path === "/" ? "" : path}`;
  };

  const content = getContent(locale);

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          padding: '24px',
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
        className="main-header"
      >
        <Link href={getHref("/")} aria-label={`${person.name} – Go to homepage`} style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center' }}>
          <img 
            src={person.avatar} 
            alt=""
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '1px solid var(--neutral-alpha-medium)'
            }} 
          />
        </Link>
        <Row gap="24" vertical="center" style={{ pointerEvents: 'auto' }}>
          {/* Desktop Text Navigation */}
          <Row gap="20" vertical="center" className={styles.desktopOnly}>
             <Link href={getHref("/blog")} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/blog') ? 1 : 0.6 }}>
               <Text variant="body-default-l" onBackground="neutral-medium" style={{ cursor: 'pointer' }}>
                 {content.blog?.label || "Blog"}
               </Text>
             </Link>
             <Link href={getHref("/proyek")} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/proyek') ? 1 : 0.6 }}>
               <Text variant="body-default-l" onBackground="neutral-medium" style={{ cursor: 'pointer' }}>
                 {content.work?.label || "Projects"}
               </Text>
             </Link>
             <Link href={getHref("/tentang")} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/tentang') ? 1 : 0.6 }}>
               <Text variant="body-default-l" onBackground="neutral-medium" style={{ cursor: 'pointer' }}>
                 {content.about?.label || "About"}
               </Text>
             </Link>
             <Link href={getHref("/teman")} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/teman') ? 1 : 0.6 }}>
               <Text variant="body-default-l" onBackground="neutral-medium" style={{ cursor: 'pointer' }}>
                 {content.teman?.label || "Teman"}
               </Text>
             </Link>
             <Link href={getHref("/sponsor")} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/sponsor') ? 1 : 0.6 }}>
               <Text variant="body-default-l" onBackground="neutral-medium" style={{ cursor: 'pointer' }}>
                 {content.sponsor?.label || "Sponsors"}
               </Text>
             </Link>
          </Row>

          {/* Desktop Icon Navigation */}
          <Row gap="16" vertical="center" className={styles.desktopOnly}>
             <Link href={getHref("/galeri")} style={{ color: 'inherit', opacity: 0.6, cursor: 'pointer' }}>
               <Icon name="gallery" size="s" />
             </Link>
             <Link href={getHref("/berbicara")} style={{ color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/berbicara') ? 1 : 0.6 }}>
               <Icon name="microphone" size="s" />
             </Link>
             <Link href={getHref("/experimen")} style={{ color: 'inherit', opacity: 0.6, cursor: 'pointer' }}>
               <Icon name="sparkle" size="s" />
             </Link>
             <Link href={social.find(s => s.name === "Bluesky")?.link || "#"} target="_blank" style={{ color: 'inherit', opacity: 0.6, cursor: 'pointer' }}>
               <Icon name="bluesky" size="s" />
             </Link>
             <Link href={social.find(s => s.name === "GitHub")?.link || "#"} target="_blank" style={{ color: 'inherit', opacity: 0.6, cursor: 'pointer' }}>
               <Icon name="github" size="s" />
             </Link>
             <Link href="https://www.travellings.cn/go.html" target="_blank" rel="noopener" title="开往-友链接力" style={{ color: 'inherit', opacity: 0.6, cursor: 'pointer' }}>
               <Icon name="train" size="s" />
             </Link>
          </Row>

          {/* Right Actions (Both Desktop & Mobile) */}
          <Row gap="16" vertical="center">
             <div style={{ pointerEvents: 'auto' }}>
               <ThemeToggle />  
             </div>

             <Row
              background="neutral-alpha-weak"
              border="neutral-alpha-weak"
              radius="m-4"
              padding="2"
              gap="2"
              style={{ pointerEvents: 'auto' }}
            >
              {["id", "en", "zh"].map((l) => (
                <ToggleButton
                  key={l}
                  size="s"
                  label={l.toUpperCase()}
                  selected={locale === l}
                  href={pathname.replace(`/${locale}`, `/${l}`)}
                />
              ))}
            </Row>
          </Row>
        </Row>
      </div>

      {/* Mobile Floating Navigation Dock */}
      <div className={styles.mobileDock} style={{ pointerEvents: 'auto' }}>
        <Row 
          background="neutral-alpha-weak"
          border="neutral-alpha-medium"
          padding="8" 
          gap="16" 
          vertical="center" 
          style={{ 
            borderRadius: '999px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            transition: 'transform 0.3s ease, opacity 0.3s ease'
          }}
        >
           <Link href={getHref("/blog")} aria-label={content.blog?.label || "Blog"} className={styles.navItem} style={{ color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/blog') ? 1 : 0.6 }}>
             <Icon name="book" size="s" />
           </Link>
           <Link href={getHref("/proyek")} aria-label={content.work?.label || "Projects"} className={styles.navItem} style={{ color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/proyek') ? 1 : 0.6 }}>
             <Icon name="rocket" size="s" />
           </Link>
           <Link href={getHref("/teman")} aria-label={content.teman?.label || "Friends"} className={styles.navItem} style={{ color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/teman') ? 1 : 0.6 }}>
             <Icon name="people" size="s" />
           </Link>
           <Link href={getHref("/tentang")} aria-label={content.about?.label || "About"} className={styles.navItem} style={{ color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/tentang') ? 1 : 0.6 }}>
             <Icon name="person" size="s" />
           </Link>
           <Link href={getHref("/sponsor")} aria-label={content.sponsor?.label || "Sponsor"} className={styles.navItem} style={{ color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/sponsor') ? 1 : 0.6 }}>
             <Icon name="heart" size="s" />
           </Link>
           <Link href={getHref("/berbicara")} aria-label={content.speaking?.label || "Speaking"} className={styles.navItem} style={{ color: 'inherit', cursor: 'pointer', opacity: pathname.includes('/berbicara') ? 1 : 0.6 }}>
             <Icon name="microphone" size="s" />
           </Link>
           <Link href="https://www.travellings.cn/go.html" target="_blank" rel="noopener" aria-label="开往-友链接力 (Travellings)" title="开往-友链接力" className={styles.navItem} style={{ color: 'inherit', opacity: 0.6, cursor: 'pointer' }}>
             <Icon name="train" size="s" />
           </Link>
        </Row>
      </div>
    </>
  );
};
