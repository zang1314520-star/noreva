import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Backpack Size Guide - NOREVA",
  description: "Compare NOREVA backpack capacity, laptop fit, dimensions, weight, and best use cases.",
};

const rows = [
  ["Urban 18L", "18L", "Up to 16 inch", "Daily commute", "Light layer, charger, notebook, bottle"],
  ["Executive 20L", "20L", "Up to 16 inch", "Office and meetings", "Documents, tech pouch, lunch box, headphones"],
  ["Rolltop 22L", "22L flexible", "Up to 16 inch", "Weather-ready commute", "Expandable top, rain shell, side pocket"],
  ["Transit 25L", "25L", "Up to 17 inch", "Short trips", "1-2 day clothing, travel kit, documents"],
];

export default function SizeGuidePage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-5xl mx-auto">
          <p className="label text-[#8A8A8A] mb-4">Pack fit</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
            Backpack Size Guide
          </h1>
          <p className="font-body text-[#8A8A8A] mb-12 max-w-2xl leading-[1.9]">
            Pick your backpack by capacity, laptop size, and how much you carry on a normal day. If you are between two sizes, choose the smaller pack for a cleaner work profile and the larger pack for travel flexibility.
          </p>

          <div className="overflow-x-auto border-y border-[#E8E6E2]">
            <table className="w-full border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-[#E8E6E2]">
                  {["Model", "Capacity", "Laptop", "Best for", "Typical carry"].map((heading) => (
                    <th key={heading} className="text-left py-4 pr-6 font-body text-[11px] tracking-[0.15em] uppercase text-[#8A8A8A]">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body text-[14px] text-[#8A8A8A]">
                {rows.map((row) => (
                  <tr key={row[0]} className="border-b border-[#E8E6E2] last:border-b-0">
                    {row.map((cell, index) => (
                      <td key={cell} className={`py-5 pr-6 ${index === 0 ? "text-[#1A1A1A]" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              ["Choose 18L", "For a slim daily backpack that stays close to the body on trains, bikes, and busy sidewalks."],
              ["Choose 20-22L", "For the best balance between office carry, laptop protection, and flexible daily storage."],
              ["Choose 25L", "For business trips, weekend packing, and days when your backpack replaces a small suitcase."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[22px] bg-[#F7F5F1] p-6">
                <h2 className="font-display text-xl font-light text-[#1A1A1A] mb-3">{title}</h2>
                <p className="font-body text-[13px] leading-[1.8] text-[#8A8A8A]">{text}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 font-body text-[13px] text-[#A8A4A0] italic">
            Need help choosing? Contact us via WhatsApp or{" "}
            <a href={CONTACT_EMAIL_HREF} className="text-[#C9A96E] hover:underline">
              {CONTACT_EMAIL}
            </a>
            {" "}with your laptop model and travel routine.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
