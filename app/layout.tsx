import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieConsent from "@/components/CookieConsent";

// 优化的字体加载（全球CDN）
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
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
    alternateLocale: ["fr_FR", "it_IT", "de_DE", "es_ES"],
    url: "https://www.noreva.cc",
    siteName: "NOREVA",
    title: "NOREVA — Premium Fashion House | Quiet Luxury",
    description: "NOREVA is a premium fashion house offering carefully chosen clothing, bags, watches, and accessories.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOREVA — Premium Fashion House",
    description: "Experience quiet luxury crafted in Shanghai and Milan.",
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
  alternates: {
    canonical: "https://www.noreva.cc",
    languages: {
      "en-US": "https://www.noreva.cc",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen bg-white text-[#1A1A1A] antialiased">
        <LanguageProvider>
          {children}
          <CookieConsent />
          <WhatsAppButton phoneNumber="8618508036618" />
        </LanguageProvider>
      </body>
    </html>
  );
}
