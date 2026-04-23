"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/useTranslation";

const WOMEN_LEFT = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80";
const WOMEN_RIGHT = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80";
const MEN_LEFT = "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80";
const MEN_RIGHT = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";

export default function NewArrivals() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="py-[clamp(6rem,12vw,10rem)] px-8 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <span className="label block mb-4">SS 2026</span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light text-[#1A1A1A] mb-4">
            Upcoming New Arrivals
          </h2>
          <p className="font-body text-[14px] text-[#8A8A8A] tracking-wide">
            Quiet refinement. Uncompromised.
          </p>
          <div className="flex justify-center mt-8">
            <span className="gold-rule" />
          </div>
        </motion.div>

        {/* Images Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="img-zoom"
          >
            <Image
              src={WOMEN_LEFT}
              alt="SS 2026 Collection"
              width={800}
              height={1000}
              className="w-full aspect-[4/5] object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="img-zoom mt-8 md:mt-12"
          >
            <Image
              src={MEN_LEFT}
              alt="SS 2026 Collection"
              width={800}
              height={1000}
              className="w-full aspect-[4/5] object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/products" className="cta-link">
            View All Products
            <svg width="16" height="1" viewBox="0 0 16 1" fill="none">
              <line x1="0" y1="0.5" x2="16" y2="0.5" stroke="#C9A96E" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
