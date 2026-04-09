"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

// Each text element staggers in 120ms apart — slow, deliberate, editorial
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: 0.2 + i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Image parallaxes faster than text — creates cinematic depth separation
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex overflow-hidden bg-white"
      style={{ minHeight: "100svh" }}
    >
      {/* ── Right column: editorial image ── */}
      <motion.div
        style={{ y: imageY }}
        className="absolute right-0 top-0 w-full md:w-[63%] h-full"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full relative"
        >
          {/* Image placeholder — replace with <Image> using editorial photography */}
          <div
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(160deg, #EAE6DE 0%, #D8D3C9 28%, #C6C0B4 58%, #B5AFA3 100%)",
            }}
          />

          {/* Large ghost-letter — editorial depth layer, purely decorative */}
          <div
            className="absolute bottom-0 left-0 leading-none select-none pointer-events-none font-display font-light text-white/[0.07]"
            style={{ fontSize: "clamp(14rem, 28vw, 26rem)" }}
            aria-hidden="true"
          >
            N
          </div>

          {/* Gradient bleed: smooth merge into white column */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/60 to-transparent hidden md:block" />

          {/* Subtle vignette on bottom */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/10 to-transparent" />
        </motion.div>
      </motion.div>

      {/* ── Left column: text ── */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex flex-col justify-between w-full md:w-[40%] px-8 md:px-16 pt-28 pb-12 md:pb-16 h-full"
      >
        {/* Top: wordmark — echoes the nav logo at a whisper */}
        <motion.div
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <span
            className="label text-[#C4C0BB]"
            style={{ letterSpacing: "0.32em" }}
          >
            Maison NOREVA
          </span>
        </motion.div>

        {/* Middle: main headline — single dominant moment */}
        <div className="flex flex-col gap-6">
          <motion.span
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="gold-rule"
          />

          <motion.h1
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="font-display display-tight font-light text-[#1A1A1A] leading-[1.0]"
            style={{ fontSize: "clamp(4.5rem, 8.5vw, 8rem)" }}
          >
            The New
            <br />
            <span className="italic font-light">Collection</span>
          </motion.h1>

          <motion.p
            custom={3}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="label text-[#A8A4A0] tracking-[0.28em]"
          >
            SS&thinsp;2026
          </motion.p>
        </div>

        {/* Bottom: CTA + scroll indicator side by side */}
        <motion.div
          custom={4}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-end justify-between"
        >
          <Link href="#collections" className="cta-link">
            Explore
            <svg width="28" height="1" viewBox="0 0 28 1" fill="none" aria-hidden="true">
              <line x1="0" y1="0.5" x2="28" y2="0.5" stroke="#C9A96E" />
            </svg>
          </Link>

          {/* Scroll indicator — lives in white column, not over image */}
          <div className="flex flex-col items-center gap-3">
            <span
              className="text-caption text-[#C4C0BB]"
              style={{ writingMode: "vertical-rl", letterSpacing: "0.22em" }}
            >
              Scroll
            </span>
            <motion.div
              animate={{ scaleY: [1, 0.25, 1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.4,
              }}
              className="w-px h-12 bg-[#C9A96E]/60 origin-top"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
