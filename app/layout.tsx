import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import NaviComponent from "@/components/NaviBox";
import { Noto_Sans_KR } from "next/font/google";
import SmoothScrolling from "@/lib/smoothScrolling";

export const metadata: Metadata = {
  title: "Service Developer Portfolio | Sooho",
  description:
    "TypeScript, React, API integration, and verified AI workflow portfolio by Sooho",
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
