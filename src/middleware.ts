import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "de", "es", "fr"];
const defaultLocale = "en";
const protectedRoutes = ["/dashboard"];
const authRoutes = ["/auth/login", "/auth/register"];

function detectLocale(req: NextRequest): string {
  const acceptLang = req.headers.get("accept-language") ?? "";
  const preferred = acceptLang.split(",")[0].split("-")[0].toLowerCase();
  return locales.includes(preferred) ? preferred : defaultLocale;
}

// Check for session cookie without using next-auth/jwt (not Edge-compatible)
function hasSession(req: NextRequest): boolean {
  return !!(
    req.cookies.get("__Secure-authjs.session-token") ||
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token") ||
    req.cookies.get("next-auth.session-token")
  );
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Detect locale from URL
  const pathnameLocale = locales.find(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );

  // No locale in URL → redirect with detected locale
  if (!pathnameLocale) {
    const locale = detectLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const pathnameWithoutLocale =
    pathname.slice(`/${pathnameLocale}`.length) || "/";

  const isProtected = protectedRoutes.some((r) =>
    pathnameWithoutLocale.startsWith(r)
  );
  const isAuthRoute = authRoutes.some((r) =>
    pathnameWithoutLocale.startsWith(r)
  );

  const loggedIn = hasSession(req);

  if (isProtected && !loggedIn) {
    return NextResponse.redirect(
      new URL(`/${pathnameLocale}/auth/login`, req.url)
    );
  }

  if (isAuthRoute && loggedIn) {
    return NextResponse.redirect(
      new URL(`/${pathnameLocale}/dashboard`, req.url)
    );
  }

  // Pass locale to next-intl via header
  const res = NextResponse.next();
  res.headers.set("x-next-intl-locale", pathnameLocale);
  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
