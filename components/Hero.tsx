"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/useTranslation";

const DEFAULT_HERO_IMAGE = "https://cdn.shopify.com/s/files/1/0095/3519/3135/files/H8-7.jpg?v=1763092998";

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
  const { t, lang } = useTranslation();
  const isCn = lang === "zh";
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const proofPoints = isCn
    ? ["16 寸电脑", "防泼水", "30 天退货"]
    : ["Fits 16\" laptop", "Water-resistant", "30-day returns"];

  return (
    <section
      ref={ref}
      className="relative h-screen flex overflow-hidden bg-white"
      style={{ minHeight: "100svh" }}
    >
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
            src={DEFAULT_HERO_IMAGE}
            alt="Nayo Smart backpack campaign"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 63vw, 1200px"
          />

          <div
            className="absolute bottom-0 left-0 leading-none select-none pointer-events-none font-display font-light text-white/[0.08]"
            style={{ fontSize: "clamp(14rem, 28vw, 26rem)" }}
            aria-hidden="true"
          >
            N
          </div>

          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/60 to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent md:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/10 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="absolute bottom-8 right-8 hidden lg:grid w-[min(100%-2rem,24rem)] grid-cols-3 overflow-hidden rounded-[2px] border border-white/25 bg-white/72 backdrop-blur-md shadow-2xl shadow-black/10"
          >
            {proofPoints.map((item, index) => (
              <div
                key={item}
                className={`px-4 py-3 text-center ${index < proofPoints.length - 1 ? "border-r border-black/8" : ""}`}
              >
                <p className="font-body text-[11px] leading-none tracking-[0.08em] text-[#7E7A74] whitespace-nowrap">
                  {item}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

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
            {t("heroBrand")}
          </span>
        </motion.div>

        <div className="space-y-6">
          <motion.p
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="label text-[#8A8A8A] uppercase tracking-[0.25em]"
          >
            {t("heroSeason")}
          </motion.p>

          <motion.h1
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="font-display font-light leading-[1.15] text-[#1A1A1A]"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
          >
            {isCn ? (
              <>
                每天都有条理，<br />
                <em>为每次旅程精心打磨。</em>
              </>
            ) : (
              <>
                {t("heroManifesto1")}<br />
                <em>{t("heroManifesto2")}</em>
              </>
            )}
          </motion.h1>

          <motion.div
            custom={3}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mt-6"
          >
            <p className="font-body text-[#8A8A8A] text-base leading-relaxed">
              {t("heroSubtext")}
            </p>
          </motion.div>

          <motion.div
            custom={4}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-5 sm:items-center"
          >
            <Link href="/products" className="mt-8 inline-flex bg-[#232933] px-7 py-4 font-body text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#d8b36a] hover:text-[#1A1A1A]">
              Shop Backpacks
            </Link>
            <Link href="#objects" className="cta-link mt-0 sm:mt-8 inline-flex items-center gap-3">
              Find Your Pack
              <svg width="20" height="1" viewBox="0 0 20 1" fill="none" aria-hidden="true">
                <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="#C9A96E" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <motion.div
          custom={5}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4"
        >
          <div className="w-px h-12 bg-[#E0DDD8]" />
          <span className="label text-[#A8A8A0] uppercase tracking-[0.25em]">
            {t("heroScroll")}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
