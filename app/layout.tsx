import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import NaviComponent from "@/components/NaviBox";
import { Noto_Sans_KR } from "next/font/google";
import SmoothScrolling from "@/lib/smoothScrolling";
import { siteMetadata, siteProfile } from "@/config/profile";

export const metadata: Metadata = {
  metadataBase: new URL(siteProfile.siteUrl),
  title: {
    default: siteMetadata.title,
    template: "%s | Sooho Shin",
  },
  description: siteMetadata.description,
  authors: [{ name: siteProfile.name }],
  creator: siteProfile.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteProfile.siteUrl,
    siteName: "Sooho Shin Portfolio",
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
        <SmoothScrolling>
          <StyledComponentsRegistry>
            <NaviComponent />
            {children}
          </StyledComponentsRegistry>
        </SmoothScrolling>
      </body>
    </html>
  );
}
