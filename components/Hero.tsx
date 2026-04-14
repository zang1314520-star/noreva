"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  // 预加载 Hero 图片
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80";
    document.head.appendChild(link);
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-screen flex overflow-hidden bg-white"
      style={{ minHeight: "100svh" }}
    >
      {/* Right column: brand style product image */}
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
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt="NOREVA Collection SS 2026"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 63vw"
          />

          {/* Large ghost-letter */}
          <div
            className="absolute bottom-0 left-0 leading-none select-none pointer-events-none font-display font-light text-white/[0.08]"
            style={{ fontSize: "clamp(14rem, 28vw, 26rem)" }}
            aria-hidden="true"
          >
            N
          </div>

          {/* Gradient bleed */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/60 to-transparent hidden md:block" />

          {/* Subtle vignette */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/10 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Left column: text */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex flex-col justify-between w-full md:w-[40%] px-8 md:px-16 pt-28 pb-12 md:pb-16 h-full"
      >
        <motion.div
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="label text-[#C4C0BB] uppercase tracking-[0.3em] text-[11px]">
            Maison NOREVA
          </span>
        </motion.div>

        {/* Central editorial copy */}
        <div className="space-y-6">
          <motion.p
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="label text-[#A8A8A8] uppercase tracking-[0.25em]"
          >
            SS 2026
          </motion.p>

          <motion.h1
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="font-display font-light leading-[1.0] text-[#1A1A1A]"
            style={{ fontSize: "clamp(3.5rem, 7.5vw, 6.5rem)" }}
          >
            The New
            <br />
            <em>Collection</em>
          </motion.h1>

          <motion.div
            custom={3}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link href="#collections" className="cta-link mt-8 inline-block">
              Explore
              <svg width="20" height="1" viewBox="0 0 20 1" fill="none" aria-hidden="true">
                <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="#C9A96E" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Bottom: scroll indicator */}
        <motion.div
          custom={4}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4"
        >
          <div className="w-px h-12 bg-[#E0DDD8]" />
          <span className="label text-[#A8A8A8] uppercase tracking-[0.25em]">
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
