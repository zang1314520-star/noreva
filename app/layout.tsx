import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import Providers from "@/components/Providers";
import FloatingButtons from "@/components/FloatingButtons";
import CookieConsent from "@/components/CookieConsent";

// 欧式艺术风格字体
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  fallback: ["cursive"],
});

// 完整的 SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://www.noreva.cc"),
  title: {
    default: "NOREVA — Premium Fashion House | Quiet Luxury",
    template: "%s | NOREVA",
  },
  description: "NOREVA is a premium fashion house offering carefully chosen clothing, bags, watches, and accessories. Experience quiet luxury crafted in Shanghai and Milan. Free worldwide shipping.",
  keywords: [
    "luxury fashion",
    "premium clothing",
    "designer bags",
    "watches",
    "accessories",
    "quiet luxury",
    "Shanghai",
    "Milan",
    "fashion house",
    "high-end fashion",
    "luxury brand",
    "men's fashion",
    "women's fashion",
  ],
  authors: [{ name: "NOREVA" }],
  creator: "NOREVA",
  publisher: "NOREVA",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "it_IT", "de_DE", "es_ES"],
    url: "https://www.noreva.cc",
    siteName: "NOREVA",
    title: "NOREVA — Premium Fashion House | Quiet Luxury",
    description: "NOREVA is a premium fashion house offering carefully chosen clothing, bags, watches, and accessories. Experience quiet luxury crafted in Shanghai and Milan.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NOREVA - Premium Fashion House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOREVA — Premium Fashion House | Quiet Luxury",
    description: "Experience quiet luxury crafted in Shanghai and Milan.",
    images: ["/twitter-image"],
    creator: "@noreva",
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
  category: "Fashion",
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
        <meta name="geo.region" content="CN-31,IT-25" />
        <meta name="geo.placename" content="Shanghai, Milan" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-white text-[#1A1A1A] antialiased">
        <LanguageProvider>
          <Providers>
            {children}
            <CookieConsent />
            <FloatingButtons phoneNumber="8617338700032" />
          </Providers>
        </LanguageProvider>
      </body>
    
</html>
  );
}
