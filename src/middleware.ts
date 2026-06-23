import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LANGS = ["en", "id", "zh"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

const COUNTRY_LANG_MAP: Record<string, Lang> = {
  CN: "zh",
  TW: "zh",
  HK: "zh",
  MO: "zh",
  SG: "zh",
  ID: "id",
};

const DEFAULT_LANG: Lang = "id";

function detectLang(request: NextRequest): Lang {
  // Check for bots - we might want to serve them a specific default or just follow the normal logic
  // Googlebot usually doesn't send Accept-Language or country headers that we can rely on for locale
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);

  if (isBot) {
    return DEFAULT_LANG;
  }

  // Vercel injects this header automatically in production
  const country = request.headers.get("x-vercel-ip-country");
  if (country && country in COUNTRY_LANG_MAP) {
    return COUNTRY_LANG_MAP[country];
  }

  // Fallback: browser Accept-Language header
  const acceptLang = request.headers.get("accept-language");
  if (acceptLang) {
    const langs = acceptLang
      .split(",")
      .map((l) => l.split(";")[0].trim().toLowerCase());

    for (const l of langs) {
      if (l.startsWith("zh") || l.startsWith("cmn")) return "zh";
      if (l.startsWith("id")) return "id";
      if (l.startsWith("en")) return "en";
    }
  }

  return DEFAULT_LANG;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already has a supported lang prefix — pass through
  const hasLang = SUPPORTED_LANGS.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (hasLang) return;

  // Detect region and redirect
  const lang = detectLang(request);
  request.nextUrl.pathname = `/${lang}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico.bak|icon.jpg|img|images|resources|favicon.ico|robots.txt|sitemap.xml|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp).*)",
  ],
};
