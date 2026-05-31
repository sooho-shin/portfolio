export const canonicalBaseUrl = "https://portfolio-beta-navy-98.vercel.app";

export const candidateKeywords = [
  "AI 개발자 포트폴리오",
  "프론트엔드 개발자 포트폴리오",
  "풀스택 개발자 포트폴리오",
  "웹 개발자 포트폴리오",
  "신수호 포트폴리오",
  "Next.js 개발자 포트폴리오",
  "TypeScript 개발자 포트폴리오",
] as const;

export const publicRoutes = ["/", "/about", "/work"] as const;

export const buildCanonicalUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${canonicalBaseUrl}${normalizedPath === "/" ? "/" : normalizedPath}`;
};
