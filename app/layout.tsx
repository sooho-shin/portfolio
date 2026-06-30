import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import { Noto_Sans_KR } from "next/font/google";
import SmoothScrolling from "@/lib/smoothScrolling";
import { siteMetadata, siteProfile } from "@/config/profile";
import { buildCanonicalUrl, candidateKeywords } from "@/config/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteProfile.siteUrl),
  title: {
    default: siteMetadata.title,
    template: "%s | 신수호 개발자 포트폴리오",
  },
  description: siteMetadata.description,
  applicationName: "신수호 개발자 포트폴리오",
  authors: [{ name: siteProfile.koreanName }, { name: siteProfile.name }],
  creator: siteProfile.koreanName,
  keywords: [...candidateKeywords],
  alternates: {
    canonical: buildCanonicalUrl("/"),
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: buildCanonicalUrl("/"),
    siteName: "신수호 개발자 포트폴리오",
    type: "website",
    locale: "ko_KR",
    images: ["/images/main-portfolio-photo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: ["/images/main-portfolio-photo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: siteMetadata.title,
  url: buildCanonicalUrl("/"),
  inLanguage: "ko-KR",
  description: siteMetadata.description,
  mainEntity: {
    "@type": "Person",
    name: siteProfile.koreanName,
    alternateName: siteProfile.name,
    url: buildCanonicalUrl("/"),
    email: siteProfile.email,
    jobTitle: siteProfile.role,
    description: siteProfile.description,
    knowsAbout: [...candidateKeywords, ...siteProfile.capabilities],
    sameAs: siteProfile.socials.map(social => social.href),
  },
};

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={notoSansKr.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScrolling>
          <StyledComponentsRegistry>
            {children}
          </StyledComponentsRegistry>
        </SmoothScrolling>
      </body>
    </html>
  );
}
