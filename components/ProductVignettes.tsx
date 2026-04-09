"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  bg: string;
  whatsapp: string;
}

const products: Product[] = [
  {
    id: "01",
    name: "Le Sac Nerveux",
    tagline: "The everyday carry.",
    category: "Bags",
    bg: "linear-gradient(135deg, #D8D0C4 0%, #C8BFB1 100%)",
    whatsapp: "I am interested in Le Sac Nerveux by NOREVA.",
  },
  {
    id: "02",
    name: "Calibre 01",
    tagline: "Time, reconsidered.",
    category: "Watches",
    bg: "linear-gradient(135deg, #C8C4BC 0%, #B8B4AC 100%)",
    whatsapp: "I am interested in Calibre 01 by NOREVA.",
  },
  {
    id: "03",
    name: "La Marche",
    tagline: "Crafted in Florence.",
    category: "Shoes",
    bg: "linear-gradient(135deg, #D0C8BC 0%, #C0B8AC 100%)",
    whatsapp: "I am interested in La Marche by NOREVA.",
  },
  {
    id: "04",
    name: "L'Anneau",
    tagline: "A single, quiet statement.",
    category: "Accessories",
    bg: "linear-gradient(135deg, #D4CEC8 0%, #C4BEB8 100%)",
    whatsapp: "I am interested in L'Anneau by NOREVA.",
  },
];

const WHATSAPP_NUMBER = "8618508036618"; // NOREVA WhatsApp

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    product.whatsapp
  )}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[30vw] lg:w-[22vw]"
    >
      {/* Image — square, studio light feeling */}
      <div className="img-zoom overflow-hidden mb-7 aspect-square">
        <div
          className="w-full h-full transition-transform duration-700 ease-out hover:scale-[1.03]"
          style={{ background: product.bg }}
        />
      </div>

      {/* Text */}
      <div className="pr-4">
        <span className="label text-[#A8A4A0] block mb-3">{product.category}</span>

        {/* 24px — slightly more presence */}
        <h3
          className="font-display display-tight font-light text-[#1A1A1A] mb-2 leading-tight"
          style={{ fontSize: "24px" }}
        >
          {product.name}
        </h3>

        <p className="font-body text-[13px] text-[#8A8A8A] mb-7 leading-relaxed">
          {product.tagline}
        </p>

        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="cta-link">
          Inquire
          <svg width="20" height="1" viewBox="0 0 20 1" fill="none" aria-hidden="true">
            <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="#C9A96E" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}

export default function ProductVignettes() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="py-[clamp(5rem,10vw,9rem)] overflow-hidden bg-[#FAFAF8]"
    >
      {/* Section header — single left-aligned block, no split layout */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="px-8 md:px-16 mb-14 md:mb-18 relative"
      >
        {/* Background editorial numeral — purely decorative depth */}
        <div
          className="absolute -top-8 left-8 md:left-16 font-display font-light text-[#1A1A1A]/[0.04] leading-none select-none pointer-events-none"
          style={{ fontSize: "clamp(7rem, 14vw, 13rem)" }}
          aria-hidden="true"
        >
          02
        </div>

        <div className="relative">
          <span className="label text-[#8A8A8A] block mb-5">The Objects</span>
          <span className="gold-rule" />
        </div>
      </motion.div>

      {/* Horizontal scroll — disguised, no obvious scrollbar */}
      <div className="pl-8 md:pl-16">
        <div
          className="flex gap-10 md:gap-16 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
          {/* Trailing breathe space */}
          <div className="flex-shrink-0 w-8 md:w-16" />
        </div>
      </div>
    </section>
  );
}
