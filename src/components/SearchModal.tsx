"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Flex, Text, Column, Row } from "@once-ui-system/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SearchModal.module.scss";

interface SearchModalProps {
  appId?: string;
  apiKey?: string;
  indexName?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({ 
  appId, 
  apiKey, 
  indexName 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || "id";

  // Simple runtime cache to save Algolia tokens
  const searchCache = useMemo(() => new Map<string, any[]>(), []);

  // Keyboard shortcut Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!appId || !apiKey || !indexName) return;

    // Check cache
    const cacheKey = `${locale}-${searchQuery.toLowerCase().trim()}`;
    if (searchCache.has(cacheKey)) {
      setResults(searchCache.get(cacheKey) || []);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`, {
        method: 'POST',
        headers: {
          'X-Algolia-Application-Id': appId,
          'X-Algolia-API-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          params: `query=${encodeURIComponent(searchQuery)}&filters=lang:${locale}` 
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.hits || []);
        searchCache.set(cacheKey, data.hits || []); // Save to cache
      }
    } catch (err) {
      console.error("Algolia Search Failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getHref = (hit: any) => {
    // Records are already mapped to localized paths in sync script or handled here
    const baseUrl = `/${locale}`;
    
    // If the path already starts with /en, /id, /cn, use it as is
    if (hit.path?.match(/^\/(en|id|cn)\//)) {
        return hit.path;
    }

    if (hit.path) return `${baseUrl}${hit.path}`;
    if (hit.slug) return `${baseUrl}/blog/${hit.slug}`;
    return baseUrl;
  };

  const translations: Record<string, any> = {
    en: {
      placeholder: "Search docs, blogs, projects...",
      searching: "Searching...",
      noResults: "No results found for",
      close: "esc"
    },
    id: {
      placeholder: "Cari dokumen, blog, proyek...",
      searching: "Mencari...",
      noResults: "Tidak ada hasil ditemukan untuk",
      close: "esc"
    },
    cn: {
      placeholder: "搜索文档、博客、项目...",
      searching: "搜索中...",
      noResults: "未找到相关结果：",
      close: "esc"
    }
  };

  const t = translations[locale] || translations.en;

  if (!isOpen) return null;
  
  // Note: classes starting with 'ais-' are used for Algolia branding compliance 
  // and to ensure detection by technology profilers like Wappalyzer.
  return (
    <div className={`${styles.overlay} ais-InstantSearch`} onClick={() => setIsOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder={t.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            {t.close}
          </button>
        </div>

        <div className={`${styles.results} ais-Hits`}>
          {isLoading && <div className={styles.loading}>{t.searching}</div>}
          {!isLoading && query && results.length === 0 && (
            <div className={styles.noResults}>{t.noResults} "{query}"</div>
          )}
          {!isLoading && results.map((hit) => (
            <Link key={hit.objectID} href={getHref(hit)} className={`${styles.hit} ais-Hits-item`} onClick={() => setIsOpen(false)}>
              <Text variant="body-strong-m" style={{ fontWeight: 'bold' }}>{hit.title || hit.name || hit.objectID}</Text>
              {hit.description || hit.summary ? (
                <Text variant="body-default-s" onBackground="neutral-weak" marginTop="4">
                  {hit.description || hit.summary}
                </Text>
              ) : null}
            </Link>
          ))}
        </div>

        <div className={styles.footer}>
          <a 
            href="https://www.algolia.com/?utm_source=react-instantsearch&utm_medium=website&utm_content=powered_by_link&utm_campaign=powered_by" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>Search by</span>
            <svg style={{ height: "16px" }} viewBox="0 0 219.6 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M107 27.5V0.6C107 0.2 106.7 0 106.3 0l-5 0.8C101 0.8 100.8 1.1 100.8 1.4v27.3c0 1.3 0 9.3 9.6 9.5 0.3 0 0.6-0.3 0.6-0.6v-4.1c0-0.3-0.2-0.6-0.5-0.6C107 32.6 107 28.2 107 27.5z" fill="#003DFF"/>
              <path d="M190.2 10.5h-5.1c-0.3 0-0.6 0.3-0.6 0.6v26.6c0 0.3 0.3 0.6 0.6 0.6h5.1c0.3 0 0.6-0.3 0.6-0.6V11.1c0-0.4-0.2-0.6-0.6-0.6z" fill="#003DFF"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M185.2 7.1h5.1c0.3 0 0.6-0.3 0.6-0.6V0.5c0-0.4-0.3-0.6-0.7-0.6l-5.1 0.8c-0.3 0-0.5 0.3-0.5 0.6v5.2c0 0.4 0.2 0.6 0.6 0.6z M176.4 27.5V0.6c0-0.4-0.3-0.6-0.7-0.6l-5 0.8c-0.3 0-0.5 0.3-0.5 0.6v27.3c0 1.3 0 9.3 9.6 9.5 0.3 0 0.6-0.3 0.6-0.6v-4.1c0-0.3-0.2-0.6-0.5-0.6C176.4 32.6 176.4 28.2 176.4 27.5z M163.2 14.3c-1.1-1.2-2.5-2.2-4.1-2.8-1.6-0.7-3.3-1-5.2-1-1.9 0-3.6 0.3-5.2 1-1.6 0.7-2.9 1.6-4.1 2.8-1.1 1.2-2 2.7-2.7 4.4-0.6 1.7-0.9 3.7-0.9 5.8s0.3 3.7 1 5.4c0.6 1.7 1.5 3.2 2.6 4.4 1.1 1.2 2.5 2.2 4.1 2.8 1.6 0.7 4 1 5.2 1 1.2 0 3.7-0.4 5.3-1 1.6-0.7 2.9-1.6 4.1-2.8 1.1-1.2 2-2.7 2.6-4.4 0.6-1.7 0.9-3.3 0.9-5.4s-0.3-4.1-1-5.8c-0.6-1.7-1.5-3.2-2.6-4.4z M158.7 30.6c-1.1 1.6-2.8 2.4-4.8 2.4-2.1 0-3.7-0.8-4.8-2.4-1.1-1.6-1.7-3.4-1.7-6.1 0-2.7 0.6-4.9 1.7-6.5 1.1-1.6 2.8-2.4 4.8-2.4 2.1 0 3.7 0.8 4.8 2.4 1.1 1.6 1.7 3.8 1.7 6.5 0 2.7-0.6 4.6-1.7 6.1z M89.4 10.5h-4.9c-4.8 0-9.1 2.5-11.6 6.4-1.5 2.3-2.3 5-2.3 7.9 0 4.5 2 8.5 5.2 11.1 0.3 0.3 0.6 0.5 0.9 0.7 1.3 0.8 2.8 1.3 4.5 1.3 0.1 0 0.2 0 0.4 0h0.5c3.3-0.5 6.2-3.1 7.1-6.3v5.8c0 0.3 0.3 0.6 0.6 0.6h5c0.3 0 0.6-0.3 0.6-0.6V11.1c0-0.3-0.3-0.6-0.6-0.6H89.4z M89.4 31.2c-1.2 1-2.8 1.4-4.5 1.5h-0.3c-4.2 0-7.7-3.6-7.7-7.9 0-1 0.2-2 0.5-2.9 1.1-2.9 3.9-5 7.1-5h4.9v14.3z M213.4 10.5h-4.9c-4.8 0-9.1 2.5-11.6 6.4-1.5 2.3-2.3 5-2.3 7.9 0 4.5 2 8.5 5.2 11.1 0.3 0.3 0.6 0.5 0.9 0.7 1.3 0.8 2.8 1.3 4.5 1.3h0.5c3.3-0.5 6.2-3.1 7.1-6.3v5.8c0 0.3 0.3 0.6 0.6 0.6h5c0.3 0 0.6-0.3 0.6-0.6V11.1c0-0.3-0.3-0.6-0.6-0.6h-4.4z M213.4 31.2c-1.2 1-2.8 1.4-4.5 1.5h-0.3c-4.2 0-7.7-3.6-7.7-7.9 0-1 0.2-2 0.5-2.9 1.1-2.9 3.9-5 7.1-5h4.9v14.3z M131.4 10.5h-4.9c-4.8 0-9.1 2.5-11.6 6.4-1.2 1.8-2 4-2.2 6.3-0.1 1.1-0.1 2.2 0 3.3 0.4 3.8 2.3 7.2 5.1 9.5 0.3 0.3 0.6 0.5 0.9 0.7 1.3 0.8 2.8 1.3 4.5 1.3 1.8 0 3.5-0.6 4.8-1.6 1.6-1.2 2.9-2.9 3.4-4.8v5h0v1.1c0 2.2-0.6 3.8-1.7 4.9-1.2 1.1-3.1 1.7-5.8 1.7-1.1 0-2.9-0.1-4.7-0.2-0.3 0-0.5 0.1-0.6 0.4l-1.3 4.3c-0.1 0.3 0.1 0.7 0.5 0.8 2.2 0.3 4.3 0.5 5.5 0.5 4.9 0 8.5-1.1 10.9-3.2 2.1-1.9 3.3-4.9 3.5-8.9V11.1c0-0.3-0.3-0.6-0.6-0.6h-5.2z M131.4 16.9c0 0 0.1 13.9 0 14.3-1.2 1-2.7 1.4-4.3 1.5h-0.7c-4-0.2-7.5-3.7-7.5-7.9 0-1 0.2-2 0.5-2.9 1.1-2.9 3.9-5 7.1-5h4.9z" fill="#003DFF"/>
              <path d="M25 0C11.3 0 0.2 11 0 24.6C-0.2 38.4 11 49.9 24.8 50c4.3 0 8.4-1 12-3 0.4-0.2 0.4-0.7 0.1-1l-2.3-2.1c-0.5-0.4-1.2-0.5-1.7-0.3-2.5 1.1-5.3 1.6-8.2 1.6-11.2-0.1-20.2-9.4-20-20.6C4.9 13.6 13.9 4.7 25 4.7h20.3v36L33.7 30.5c-0.4-0.3-0.9-0.3-1.2 0.1-1.8 2.4-4.9 4-8.2 3.7-4.6-0.3-8.4-4-8.7-8.7-0.4-5.5 4-10.2 9.4-10.2 4.9 0 9 3.8 9.4 8.6 0 0.4 0.2 0.8 0.6 1.1l3 2.7c0.3 0.3 0.9 0.1 1-0.3 0.2-1.2 0.3-2.4 0.2-3.6-0.5-7-6.2-12.7-13.2-13.1-8.1-0.5-14.8 5.8-15 13.7-0.2 7.7 6.1 14.4 13.8 14.5 3.2 0.1 6.2-0.9 8.6-2.7l15 13.3c0.6 0.6 1.7 0.1 1.7-0.7v-48C50 0.4 49.5 0 49 0H25z" fill="#003DFF"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
