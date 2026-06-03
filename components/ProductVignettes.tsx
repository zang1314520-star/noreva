"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const PACKS = [
  {
    title: "Commuter Backpacks",
    subtitle: "Slim, organized, ready for daily movement.",
    href: "/products?use=commute",
    image: "/images/products/backpack-urban.svg",
    specs: ["16 inch laptop", "18L", "Water-resistant"],
  },
  {
    title: "Travel Backpacks",
    subtitle: "More capacity for airport days and weekend escapes.",
    href: "/products?use=travel",
    image: "/images/products/backpack-travel.svg",
    specs: ["17 inch laptop", "25L", "Luggage strap"],
  },
  {
    title: "Business Backpacks",
    subtitle: "Structured carry for meetings, documents and devices.",
    href: "/products?use=business",
    image: "/images/products/backpack-business.svg",
    specs: ["16 inch laptop", "20L", "Hidden pocket"],
  },
];

export default function ProductVignettes() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} id="objects" className="py-[clamp(5rem,10vw,9rem)] overflow-hidden bg-white">
      <div className="px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <span className="label text-[#8A8A8A] block mb-3">Pack Finder</span>
          <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A]">
            Choose by how you move
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {PACKS.map((pack, index) => (
            <motion.div
              key={pack.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: index * 0.1 }}
              className="group"
            >
              <Link href={pack.href}>
                <div className="relative overflow-hidden mb-5 aspect-[3/4] bg-[#F7F5F1]">
                  <Image src={pack.image} alt={pack.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <h3 className="font-display text-xl font-light text-[#1A1A1A] group-hover:text-[#C9A96E] transition-colors duration-300">
                  {pack.title}
                </h3>
                <p className="mt-2 font-body text-[13px] leading-[1.8] text-[#8A8A8A]">{pack.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {pack.specs.map((spec) => (
                    <span key={spec} className="bg-[#F5F4F2] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[#8A8A8A]">
                      {spec}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
