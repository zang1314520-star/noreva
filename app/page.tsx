"use client";

import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";
import ProductVignettes from "@/components/ProductVignettes";
import FeaturedProducts from "@/components/FeaturedProducts";
import PersonalShopper from "@/components/PersonalShopper";
import Testimonials from "@/components/Testimonials";
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

      {/* 03 — The Objects */}
      <ProductVignettes />

      <SectionDivider />

      {/* 03.5 — Featured Products (real data) */}
      <FeaturedProducts />

      <SectionDivider />

      {/* 04 — SS 2026 New Arrivals */}
      <NewArrivals />

      <SectionDivider />

      {/* 05 — Journal */}
      <Journal />

      <SectionDivider />

      {/* 06 — Testimonials */}
      <Testimonials />

      <SectionDivider />

      {/* 07 — Personal Shopper / WhatsApp CTA */}
      <PersonalShopper />

      {/* 08 — Footer */}
      <Footer />
    </main>
  );
}
