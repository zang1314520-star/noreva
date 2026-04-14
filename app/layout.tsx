import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import WhatsAppButton from "@/components/WhatsAppButton";

// 使用 next/font 自动优化字体（全球CDN分发）
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "NOREVA — Premium Fashion",
  description:
    "NOREVA is a premium fashion house offering clothing, bags, watches, shoes, and accessories. Experience quiet luxury.",
  openGraph: {
    title: "NOREVA — Premium Fashion",
    description: "Quiet refinement. Timeless objects.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>N</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {/* 预连接关键域名 - 欧洲用户加速 */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-white text-[#1A1A1A] antialiased">
        <LanguageProvider>
          {children}
          <WhatsAppButton phoneNumber="8618508036618" />
        </LanguageProvider>
      </body>
    </html>
  );
}
