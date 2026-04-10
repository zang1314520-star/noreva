"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  category: string;
  categoryName: string;
  price: number;
  mainImage: string;
}

interface ProductVignette {
  id: string;
  name: string;
  tagline: string;
  category: string;
  bg: string;
  productId?: string;
}

const vignetteCategories: ProductVignette[] = [
  {
    id: "01",
    name: "Le Sac Nerveux",
    tagline: "The everyday carry.",
    category: "Bags",
    bg: "linear-gradient(135deg, #D8D0C4 0%, #C8BFB1 100%)",
  },
  {
    id: "02",
    name: "Calibre 01",
    tagline: "Time, reconsidered.",
    category: "Watches",
    bg: "linear-gradient(135deg, #C8C4BC 0%, #B8B4AC 100%)",
  },
  {
    id: "03",
    name: "La Marche",
    tagline: "Crafted in Florence.",
    category: "Shoes",
    bg: "linear-gradient(135deg, #D0C8BC 0%, #C0B8AC 100%)",
  },
  {
    id: "04",
    name: "L'Anneau",
    tagline: "A single, quiet statement.",
    category: "Accessories",
    bg: "linear-gradient(135deg, #D4CEC8 0%, #C4BEB8 100%)",
  },
];

const WHATSAPP_NUMBER = "8618508036618";

function ProductCard({ product, index, onImageLoad }: { product: ProductVignette; index: number; onImageLoad?: (img: string | null) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

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
      <Link href="/products" className="block">
        {/* Image — square, studio light feeling */}
        <div className="img-zoom overflow-hidden mb-7 aspect-square">
          <div
            className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            style={{ background: product.bg }}
          />
        </div>

        {/* Text */}
        <div className="pr-4">
          <span className="label text-[#A8A4A0] block mb-3">{product.category}</span>

          <h3
            className="font-display display-tight font-light text-[#1A1A1A] mb-2 leading-tight"
            style={{ fontSize: "24px" }}
          >
            {product.name}
          </h3>

          <p className="font-body text-[13px] text-[#8A8A8A] mb-7 leading-relaxed">
            {product.tagline}
          </p>

          <span className="cta-link">
            View Collection
            <svg width="20" height="1" viewBox="0 0 20 1" fill="none" aria-hidden="true">
              <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="#C9A96E" />
            </svg>
          </span>
        </div>
      </Link>
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
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="px-8 md:px-16 mb-14 md:mb-18 relative"
      >
        {/* Background editorial numeral */}
        <div
          className="absolute -top-8 left-8 md:left-16 font-display font-light text-[#1A1A1A]/[0.04] leading-none select-none pointer-events-none"
          style={{ fontSize: "clamp(7rem, 14vw, 13rem)" }}
          aria-hidden="true"
        >
          02
        </div>

        <div className="relative flex items-end justify-between">
          <div>
            <span className="label text-[#8A8A8A] block mb-5">The Objects</span>
            <span className="gold-rule" />
          </div>
          <Link 
            href="/products" 
            className="hidden md:block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors tracking-wider uppercase pb-1"
          >
            View All →
          </Link>
        </div>
      </motion.div>

      {/* Horizontal scroll */}
      <div className="pl-8 md:pl-16">
        <div
          className="flex gap-10 md:gap-16 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {vignetteCategories.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
          {/* Trailing breathe space */}
          <div className="flex-shrink-0 w-8 md:w-16" />
        </div>
      </div>

      {/* Mobile View All link */}
      <div className="md:hidden px-8 mt-8 text-center">
        <Link 
          href="/products" 
          className="font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors tracking-wider uppercase"
        >
          View All Products →
        </Link>
      </div>
    </section>
  );
}
