"use client";

import { useParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const articles: Record<string, {
  id: string;
  category: string;
  title: string;
  date: string;
  image: string;
  content: string[];
  takeaways: string[];
}> = {
  "01": {
    id: "01",
    category: "Pack Guide",
    title: "18L, 20L or 25L: which backpack capacity fits your day?",
    date: "March 2026",
    image: "/images/brand/backpack-main-premium.png",
    content: [
      "Capacity is one of the easiest backpack numbers to misunderstand. A larger liter count does not automatically mean a better daily backpack. The right size depends on how often you carry a laptop, whether you pack clothing, and how compact you want the bag to look in work settings.",
      "An 18L backpack is the cleanest everyday option. It works best for a laptop, charger, water bottle, notebook, wallet, keys, and a light layer. Choose this size if you commute daily and want a bag that stays close to the body on trains, bikes, and busy sidewalks.",
      "A 20L backpack is the safest all-rounder for office and business use. It usually gives enough room for a 16-inch laptop, cable pouch, documents, headphones, and a slim lunch box without becoming bulky. If you only want one backpack for workdays, start here.",
      "A 25L backpack makes sense when travel enters the picture. The extra space helps with a change of clothes, dopp kit, compact shoes, or camera gear. The key is structure: travel capacity should expand when needed but still compress visually for meetings.",
      "Our recommendation is simple. Pick 18L for minimal daily carry, 20L for the best work balance, and 25L for frequent overnight travel."
    ],
    takeaways: [
      "18L is best for clean daily commuting.",
      "20L is the most versatile work backpack size.",
      "25L is ideal for short trips and heavier carry days.",
    ],
  },
  "02": {
    id: "02",
    category: "Organization",
    title: "What a 16-inch laptop backpack should get right.",
    date: "February 2026",
    image: "/images/brand/backpack-detail-organizer.png",
    content: [
      "A laptop sleeve is only useful if it protects the laptop during real movement. Look for padding on the back, padding on the bottom, and enough structure that the laptop does not press directly against hard objects inside the main compartment.",
      "The sleeve should also be easy to access. If you fly often or move between meetings, a separate laptop section saves time. If you commute by train or bike, a protected internal sleeve keeps the outside of the bag cleaner and more secure.",
      "Good organization is not about adding endless pockets. It is about placing the right pockets where your hands naturally go. Chargers, cables, mouse, AirPods, keys, passport, and cards should each have a predictable home.",
      "For 16-inch laptops, shape matters. A slim rectangular profile keeps the backpack professional, while a deeper base helps the bag stand upright. That combination makes the bag feel calmer at desks, cafes, airports, and meeting rooms.",
      "If you carry expensive tech every day, prioritize laptop protection, pocket hierarchy, water resistance, and comfortable straps before choosing based on style alone."
    ],
    takeaways: [
      "A false-bottom laptop sleeve protects against drops.",
      "Tech pockets should be easy to reach without unpacking.",
      "A structured base helps a work backpack stand upright.",
    ],
  },
  "03": {
    id: "03",
    category: "Travel",
    title: "The business-trip backpack checklist.",
    date: "January 2026",
    image: "/images/brand/hero-backpack-campaign.png",
    content: [
      "A good business-trip backpack has to do two jobs at once. It needs to hold enough for one or two nights, but it also needs to look sharp when you walk straight from the airport into a meeting.",
      "Start with luggage compatibility. A pass-through sleeve lets the backpack sit securely on a suitcase handle, which is a small detail that makes long airport walks much easier. It also keeps the shoulder straps from carrying weight all day.",
      "Next, check access. A wide-opening main compartment is better for packing clothing, while quick-access pockets are better for passport, boarding pass, phone, charger, and sunglasses. The best travel backpack separates these zones clearly.",
      "Water resistance matters more than people expect. Travel days often include taxi doors, wet sidewalks, coffee shops, and overhead bins. A weather-resistant outer shell gives you enough protection for ordinary rain and spills.",
      "Finally, think about how the backpack looks when it is not full. Premium travel backpacks should hold their shape, keep straps tidy, and avoid the camping-bag look when used for business."
    ],
    takeaways: [
      "Choose a luggage pass-through for frequent flights.",
      "Use quick-access pockets for airport essentials.",
      "Pick a structured, water-resistant shell for business travel.",
    ],
  },
};

export default function JournalArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const article = articles[id];

  if (!article) {
    return (
      <main className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-32 pb-24 px-8 md:px-16 text-center">
          <h1 className="font-display text-3xl mb-6">Guide not found</h1>
          <Link href="/#journal" className="cta-link">
            Return to Carry Notes
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      <div className="relative h-[60vh] md:h-[70vh] mt-16 overflow-hidden bg-[#F7F5F1]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
      </div>

      <article className="max-w-3xl mx-auto px-8 md:px-16 -mt-20 relative z-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white/95 backdrop-blur-sm rounded-[24px] p-6 md:p-10 shadow-sm"
        >
          <span className="label text-[#C9A96E] block mb-4">
            {article.category} - {article.date}
          </span>

          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#1A1A1A] leading-tight mb-8">
            {article.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-10">
            <div className="space-y-6">
              {article.content.map((paragraph, index) => (
                <p key={index} className="font-body text-[15px] text-[#1A1A1A] leading-[2]">
                  {paragraph}
                </p>
              ))}
            </div>

            <aside className="md:sticky md:top-24 h-fit rounded-[18px] bg-[#F7F5F1] p-5">
              <p className="label text-[#8A8A8A] mb-4">Quick takeaways</p>
              <ul className="space-y-3">
                {article.takeaways.map((takeaway) => (
                  <li key={takeaway} className="font-body text-[12px] leading-[1.7] text-[#1A1A1A]">
                    {takeaway}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="mt-16 pt-8 border-t border-[#E8E6E2] flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between">
            <Link href="/#journal" className="cta-link">
              <svg width="16" height="1" viewBox="0 0 16 1" fill="none">
                <line x1="16" y1="0.5" x2="0" y2="0.5" stroke="#C9A96E" />
              </svg>
              Back to Carry Notes
            </Link>
            <Link href="/products" className="cta-link">
              Shop backpacks
              <svg width="16" height="1" viewBox="0 0 16 1" fill="none">
                <line x1="0" y1="0.5" x2="16" y2="0.5" stroke="#C9A96E" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </article>

      <Footer />
    </main>
  );
}
