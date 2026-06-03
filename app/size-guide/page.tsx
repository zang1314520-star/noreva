import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Backpack Size Guide - Nayo Smart",
  description: "Compare Nayo Smart backpack capacity, laptop fit, dimensions, weight, and best use cases.",
};

const rows = [
  ["Urban U7", "18L", "Up to 16 inch", "Daily commute", "Lightweight everyday backpack with wide opening"],
  ["Herman H6", "16L", "Up to 16 inch", "Structured city carry", "Half-roll top profile with travel-ready details"],
  ["Herman H8", "18L", "Up to 16 inch", "Work and travel", "3-in-1 carry and deep organization"],
  ["Herman Pro", "20L-30L", "16.3 to 18 inch", "Expandable travel carry", "Waterproof shell with larger load range"],
];

export default function SizeGuidePage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-5xl mx-auto">
          <p className="label text-[#8A8A8A] mb-4">Pack fit</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
            Nayo Smart Size Guide
          </h1>
          <p className="font-body text-[#8A8A8A] mb-12 max-w-2xl leading-[1.9]">
            Compare official Nayo Smart backpack capacities, laptop fit, and best use cases so customers can choose the right bag faster.
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
              ["Choose Urban U7", "For lightweight commute, fast access, and a balanced daily laptop carry."],
              ["Choose Herman H6 or H8", "For more structured silhouettes, stronger organization, and office-to-travel versatility."],
              ["Choose Herman Pro", "For expandable storage, larger devices, and heavier travel or outdoor-oriented carry."],
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
