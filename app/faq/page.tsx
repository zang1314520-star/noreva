import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ - NOREVA Backpacks",
  description: "Frequently asked questions about NOREVA smart backpacks, laptop fit, shipping, returns, warranty, and materials.",
};

const FAQS = [
  {
    question: "Which backpack should I choose?",
    answer: "Choose Urban 18L for daily commuting, Executive 20L for work and meetings, Transit 25L for travel, and Rolltop 22L if you want flexible capacity and stronger weather coverage.",
  },
  {
    question: "Will my laptop fit?",
    answer: "Each product page lists laptop compatibility. Most NOREVA backpacks fit 16 inch laptops, while the Transit 25L is designed for up to 17 inch devices.",
  },
  {
    question: "Are the backpacks waterproof?",
    answer: "The backpacks use water-resistant fabrics for rain and daily splashes. They are not designed for full submersion.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes. Shipping options and timing are confirmed before payment. For urgent orders, contact us on WhatsApp first.",
  },
  {
    question: "What is the return and warranty policy?",
    answer: "Eligible products include 30-day easy returns and a 24-month warranty against manufacturing defects.",
  },
];

export default function FAQPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <section className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-3xl mx-auto">
          <p className="label text-[#8A8A8A] mb-4">Support</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-10">
            Backpack FAQ
          </h1>
          <div className="divide-y divide-[#E8E6E2] border-y border-[#E8E6E2]">
            {FAQS.map((item) => (
              <div key={item.question} className="py-7">
                <h2 className="font-display text-xl font-light text-[#1A1A1A] mb-3">{item.question}</h2>
                <p className="font-body text-[14px] leading-[1.9] text-[#8A8A8A]">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
