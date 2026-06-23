import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import classNames from "classnames";
import { Suspense } from "react";

import {
  Background,
  Column,
  Flex,
  Meta,
  type opacity,
  RevealFx,
  type SpacingToken,
} from "@once-ui-system/core";
import { Footer, Header, Providers, TopLoadingBar, SearchModal, TechTrap, KinaChatWidget } from "@/components";
import { baseURL, effects, fonts, style, dataStyle, getContent, display } from "@/resources";
import Script from "next/script";

// Mapping kode internal → hreflang ISO 639-1
// Karena sekarang kita pakai 'zh' secara internal, mapping jadi identitas
const LANG_TO_HREFLANG: Record<string, string> = {
  en: "en",
  id: "id",
  zh: "zh",
};

const ALL_LOCALES = ["en", "id", "zh"] as const;

function minifyScript(code: string): string {
  return code
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//")) {
        return "";
      }
      return trimmed;
    })
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ");
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "id" }, { lang: "zh" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { home } = getContent(lang);
  const metadata = Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: `/${lang}${home.path === "/" ? "" : home.path}`,
    image: home.image.startsWith('http') ? home.image : `${baseURL}${home.image}`,
  });

  return {
    ...metadata,
    description: home.description,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const htmlLang = LANG_TO_HREFLANG[lang] ?? lang;

  return (
    <html
      suppressHydrationWarning
      lang={htmlLang}
      className={classNames(
        fonts.heading.variable,
        // body & label share the same font as heading (poppins), skip duplicates
        ...(fonts.body.variable !== fonts.heading.variable ? [fonts.body.variable] : []),
        ...(fonts.label.variable !== fonts.heading.variable && fonts.label.variable !== fonts.body.variable ? [fonts.label.variable] : []),
        fonts.code.variable,
      )}
    >
      <head>

        {/* ── RSS Autodiscovery ── */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`Blog Feed – All Languages`}
          href={`${baseURL}/rss.xml`}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`Blog Feed – ${htmlLang.toUpperCase()}`}
          href={`${baseURL}/${lang}/rss.xml`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Davin Gahisan Mustafid",
              "url": baseURL,
              "image": `${baseURL}/images/author.jpg`,
              "jobTitle": "Frontend Engineer",
              "sameAs": [
                "https://github.com/davingm",
                "https://www.linkedin.com/in/davingm",
                "https://x.com/davingm_dev",
                "https://bsky.app/profile/davingm.com"
              ]
            })
          }}
        />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: minifyScript(`
              (function() {
                try {
                  const root = document.documentElement;
                  const defaultTheme = 'system';
                  
                  // Set defaults from config
                  const config = ${JSON.stringify({
              brand: style.brand,
              accent: style.accent,
              neutral: style.neutral,
              solid: style.solid,
              "solid-style": style.solidStyle,
              border: style.border,
              surface: style.surface,
              transition: style.transition,
              scaling: style.scaling,
              "viz-style": dataStyle.variant,
            })};
                  
                  // Apply default values
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  
                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  
                  // Apply saved theme
                  const savedTheme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(savedTheme);
                  root.setAttribute('data-theme', resolvedTheme);
                  
                  // Apply any saved style overrides
                  const styleKeys = Object.keys(config);
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `),
          }}
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-5JWVJC5TB9"
        />
        <Script id="google-analytics">
          {minifyScript(`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5JWVJC5TB9');
          `)}
        </Script>
        <Script id="linkedin-insight-1">
          {minifyScript(`
            _linkedin_partner_id = "9120996";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `)}
        </Script>
        <Script id="linkedin-insight-2">
          {minifyScript(`
            (function(l) {
            if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);})(window.lintrk);
          `)}
        </Script>
        <Script
          src="https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.umd.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-name="BMC-Widget"
          data-id="davingm"
          data-description="Support me on Buy me a coffee!"
          data-message="Thanks for your support!"
          data-color="#FFDD00"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
          strategy="lazyOnload"
        />
      </head>
      <Providers>
        <body
          style={{
            background: "var(--page-background, var(--neutral-background, #000))",
            color: "var(--neutral-on-background-strong)",
            minHeight: "100vh",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <noscript>
            <img height="1" width="1" style={{ display: "none" }} alt="" src="https://px.ads.linkedin.com/collect/?pid=9120996&fmt=gif" />
          </noscript>
          <Suspense fallback={null}>
            <TopLoadingBar />
          </Suspense>
          <Flex fillWidth minHeight="16" s={{ hide: true }} />
          <Flex zIndex={1} fillWidth padding="l" horizontal="center" flex={1}>
            <Flex horizontal="center" fillWidth minHeight="0">
               {children}
            </Flex>
          </Flex>
          <Suspense fallback={null}>
            <SearchModal 
              appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID} 
              apiKey={process.env.NEXT_PUBLIC_ALGOLIA_API_KEY} 
              indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME} 
            />
          </Suspense>
          <TechTrap />
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          {display.kinaAiWidget && (
            <Suspense fallback={null}>
              <KinaChatWidget />
            </Suspense>
          )}
        </body>
      </Providers>
    </html>
  );
}
