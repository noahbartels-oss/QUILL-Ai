import { getToken } from "next-auth/jwt";
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

export default async function middleware(req: NextRequest) {
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

  if (isProtected || isAuthRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (isProtected && !token) {
      return NextResponse.redirect(
        new URL(`/${pathnameLocale}/auth/login`, req.url)
      );
    }

    if (isAuthRoute && token) {
      return NextResponse.redirect(
        new URL(`/${pathnameLocale}/dashboard`, req.url)
      );
    }
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
