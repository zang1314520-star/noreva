import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import CollectionEntry from "@/components/CollectionEntry";
import ProductVignettes from "@/components/ProductVignettes";
import PersonalShopper from "@/components/PersonalShopper";
import Journal from "@/components/Journal";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

export default function HomePage() {
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

      {/* 04 — Collection Entry: Womenswear */}
      <CollectionEntry
        season="SS 2026"
        category="Womenswear"
        name="The Atelier Line"
        tagline="Quiet refinement."
        description="Twelve pieces. No more."
        href="#"
        reverse={false}
        bgLeft="linear-gradient(150deg, #D8D4CC 0%, #C8C4BC 50%, #B8B4AC 100%)"
        bgRight="linear-gradient(135deg, #E4E0D8 0%, #D4D0C8 100%)"
      />

      <SectionDivider />

      {/* 04b — Collection Entry: Menswear (reversed) */}
      <CollectionEntry
        season="SS 2026"
        category="Menswear"
        name="Le Volume Sombre"
        tagline="Structure without force."
        description="Eight silhouettes. Uncompromised."
        href="#"
        reverse={true}
        bgLeft="linear-gradient(150deg, #C8C4B8 0%, #B8B4A8 50%, #A8A49C 100%)"
        bgRight="linear-gradient(135deg, #D8D4CC 0%, #C8C4BC 100%)"
      />

      <SectionDivider />

      {/* 05 — The Objects */}
      <ProductVignettes />

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
