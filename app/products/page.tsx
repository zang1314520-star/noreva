"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Objects from "@/components/Objects";
import { useTranslation } from "@/lib/useTranslation";

export default function ProductsPage() {
  const { t } = useTranslation();

  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      {/* Page Header */}
      <section className="pt-32 pb-16 px-8 md:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="label text-[#8A8A8A] block mb-4">Collection</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            {t("productsTitle")}
          </h1>
          <p className="font-body text-[#8A8A8A] text-base md:text-lg leading-relaxed">
            {t("productsSubtitle")}
          </p>
        </div>
      </section>

      {/* Categories Grid - 三大分类 + 悬浮效果 */}
      <section className="px-8 md:px-16 pb-24">
        <Objects />
      </section>

      <Footer />
    </main>
  );
}
