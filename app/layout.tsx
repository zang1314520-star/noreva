import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import WhatsAppButton from "@/components/WhatsAppButton";

// 优化的字体加载（全球CDN）
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

// 多语言 SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://www.noreva.cc"),
  title: {
    default: "NOREVA — Premium Fashion House | Quiet Luxury",
    template: "%s | NOREVA",
  },
  description: "NOREVA is a premium fashion house offering carefully chosen clothing, bags, watches, and accessories. Experience quiet luxury crafted in Shanghai and Milan.",
  keywords: ["luxury fashion", "premium clothing", "designer bags", "watches", "accessories", "quiet luxury", "Shanghai", "Milan", "fashion house"],
  authors: [{ name: "NOREVA" }],
  creator: "NOREVA",
  publisher: "NOREVA",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN", "fr_FR", "it_IT", "de_DE", "es_ES"],
    url: "https://www.noreva.cc",
    siteName: "NOREVA",
    title: "NOREVA — Premium Fashion House | Quiet Luxury",
    description: "NOREVA is a premium fashion house offering carefully chosen clothing, bags, watches, and accessories. Experience quiet luxury crafted in Shanghai and Milan.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOREVA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOREVA — Premium Fashion House",
    description: "Experience quiet luxury crafted in Shanghai and Milan.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // 替换为你的 Google 验证码
  },
  alternates: {
    canonical: "https://www.noreva.cc",
    languages: {
      "en-US": "https://www.noreva.cc",
      "zh-CN": "https://www.noreva.cc?lang=zh",
      "fr-FR": "https://www.noreva.cc?lang=fr",
      "it-IT": "https://www.noreva.cc?lang=it",
      "de-DE": "https://www.noreva.cc?lang=de",
      "es-ES": "https://www.noreva.cc?lang=es",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 预连接关键域名 - 加速欧洲访问 */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
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
