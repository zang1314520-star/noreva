"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "@/lib/useTranslation";
import { WHATSAPP_NUMBER } from "@/lib/site";

export default function PersonalShopper() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { t } = useTranslation();

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello, I would like help choosing the right Nayo Smart backpack."
  )}`;

  return (
    <section
      ref={ref}
      id="contact"
      className="bg-white py-[clamp(6rem,12vw,10rem)] px-8 md:px-16"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="label text-[#8A8A8A] block mb-8">
            {t("personalTitle")}
          </span>

          <h2 className="font-display text-[clamp(2.4rem,4.5vw,3.8rem)] font-light leading-[1.15] text-[#1A1A1A] mb-8">
            {t("personalSubtitle")}<br />
            <span className="italic">{t("personalSubtitle2")}</span>
          </h2>

          <span className="gold-rule mb-8 block" />

          <div className="space-y-4 mb-12">
            <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9]">
              {t("personalText1")}
            </p>
            <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9]">
              {t("personalText2")}
            </p>
          </div>

          <motion.a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-4 bg-[#1A1A1A] text-white px-10 py-4 font-body text-[11px] tracking-[0.22em] uppercase hover:bg-[#C9A96E] transition-colors duration-300"
          >
            <span>{t("personalBtn")}</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </motion.a>

          <p className="font-body text-[11px] text-[#C9A96E] tracking-wider mt-5">
            {t("personalNote")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
