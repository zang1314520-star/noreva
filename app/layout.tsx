import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import WhatsAppButton from "@/components/WhatsAppButton";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-white text-[#1A1A1A] antialiased">
        <LanguageProvider>
          {children}
          <WhatsAppButton phoneNumber="8618508036618" />
        </LanguageProvider>
      </body>
    </html>
  );
}
