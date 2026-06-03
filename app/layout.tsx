import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import Providers from "@/components/Providers";
import FloatingButtons from "@/components/FloatingButtons";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import { SITE_NAME, SITE_URL, WHATSAPP_NUMBER } from "@/lib/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NOREVA | Smart Backpacks for Work, Travel and Daily Carry",
    template: "%s | NOREVA",
  },
  description:
    "Smart backpacks for work, travel, commuting and organized daily carry. Water-resistant materials, laptop protection, worldwide delivery and direct WhatsApp assistance.",
  keywords: [
    "smart backpacks",
    "travel backpacks",
    "laptop backpacks",
    "commuter backpacks",
    "water-resistant backpacks",
    "business backpacks",
    "Shanghai",
    "Milan",
    "organized carry",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "NOREVA | Smart Backpacks for Work, Travel and Daily Carry",
    description:
      "Smart backpacks for work, travel, commuting and organized daily carry.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NOREVA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOREVA | Smart Backpacks for Work, Travel and Daily Carry",
    description:
      "Water-resistant laptop backpacks with direct WhatsApp assistance.",
    images: ["/twitter-image"],
    creator: "@noreva",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
      "fr-FR": `${SITE_URL}?lang=fr`,
      "it-IT": `${SITE_URL}?lang=it`,
      "de-DE": `${SITE_URL}?lang=de`,
      "es-ES": `${SITE_URL}?lang=es`,
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
      <body
        className={`${playfair.variable} ${ebGaramond.variable} ${pinyonScript.variable} min-h-screen bg-white text-[#1A1A1A] antialiased`}
      >
        <AnalyticsScripts />
        <LanguageProvider>
          <Providers>
            {children}
            <CookieConsent />
            <FloatingButtons phoneNumber={WHATSAPP_NUMBER} />
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
