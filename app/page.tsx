"use client";

import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import CollectionEntry from "@/components/CollectionEntry";
import ProductVignettes from "@/components/ProductVignettes";
import PersonalShopper from "@/components/PersonalShopper";
import Journal from "@/components/Journal";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import { useTranslation } from "@/lib/useTranslation";

// High-end fashion images from Unsplash
const WOMEN_LEFT = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80";
const WOMEN_RIGHT = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80";
const MEN_LEFT = "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80";
const MEN_RIGHT = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="relative">
      {/* 01 — Navigation */}
      <Navigation />

      {/* 02 — Hero */}
      <Hero />

      <SectionDivider />

      {/* 03 — Brand Manifesto */}
      <Manifesto />

      <SectionDivider />

      {/* 04 — The Objects (moved up) */}
      <ProductVignettes />

      <SectionDivider />

      {/* 05 — Collection Entry: Womenswear */}
      <CollectionEntry
        season="SS 2026"
        category="Womenswear"
        name={t("collectionsTheAtelier")}
        tagline={t("collectionsAtelierTagline")}
        description={t("collectionsAtelierDesc")}
        href="#"
        reverse={false}
        imageLeft={WOMEN_LEFT}
        imageRight={WOMEN_RIGHT}
      />

      <SectionDivider />

      {/* 05b — Collection Entry: Menswear (reversed) */}
      <CollectionEntry
        season="SS 2026"
        category="Menswear"
        name={t("collectionsLeVolume")}
        tagline={t("collectionsLeVolumeTagline")}
        description={t("collectionsLeVolumeDesc")}
        href="#"
        reverse={true}
        imageLeft={MEN_LEFT}
        imageRight={MEN_RIGHT}
      />

      <SectionDivider />

      {/* 06 — Personal Shopper / WhatsApp CTA */}
      <PersonalShopper />

      <SectionDivider />

      {/* 07 — Journal */}
      <Journal />

      {/* 08 — Footer */}
      <Footer />
    </main>
  );
}
