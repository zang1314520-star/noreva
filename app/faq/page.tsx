import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ - Nayo Smart Backpacks",
  description: "Frequently asked questions about Nayo Smart backpacks, laptop fit, shipping, returns, warranty, and materials.",
};

const FAQS = [
  {
    question: "Which Nayo Smart backpack should I choose?",
    answer: "Choose Urban U7 for lightweight commuting, Herman H6 for a structured half-roll top profile, Herman H8 for deep organization and 3-in-1 carry, and Herman Pro when you want expandable capacity and more rugged daily flexibility.",
  },
  {
    question: "Will my laptop fit?",
    answer: "Each product page lists device compatibility. Most models fit up to 16 inch laptops, while some Herman Pro sizes support larger devices.",
  },
  {
    question: "Are the backpacks waterproof?",
    answer: "Nayo Smart backpacks use water-resistant or waterproof materials depending on model. They are built for rain and daily weather exposure, but not for full submersion.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes. We ship internationally and confirm timing by region before or during checkout. Many regions receive delivery within 5 to 15 business days.",
  },
  {
    question: "What is the return and warranty policy?",
    answer: "Eligible products include 30-day easy returns and a 24-month warranty against manufacturing defects.",
  },
];

export default function FAQPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <Navigation />
      <section className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-3xl mx-auto">
          <p className="label text-[#8A8A8A] mb-4">Support</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-10">
            Nayo Smart FAQ
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
