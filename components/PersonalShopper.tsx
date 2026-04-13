"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const WHATSAPP_NUMBER = "8618508036618"; // NOREVA WhatsApp
const WHATSAPP_MESSAGE = "Hello, I would like to speak with a personal shopper at NOREVA.";

export default function PersonalShopper() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <section
      ref={ref}
      id="contact"
      className="bg-white py-[clamp(6rem,12vw,10rem)] px-8 md:px-16"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="label text-[#8A8A8A] block mb-8">
            Personal Service
          </span>

          <h2 className="font-display text-[clamp(2.4rem,4.5vw,3.8rem)] font-light leading-[1.15] text-[#1A1A1A] mb-8">
            Your personal stylist<br />
            <span className="italic">is a message away.</span>
          </h2>

          <span className="gold-rule mb-8 block" />

          <div className="space-y-4 mb-12">
            <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9]">
              We don&apos;t believe in shopping carts.
              <br />
              We believe in conversations.
            </p>
            <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9]">
              Tell us what you&apos;re looking for — a wardrobe,
              a gift, a single piece — and we will guide you.
            </p>
          </div>

          {/* WhatsApp CTA — styled to brand, not platform */}
          <motion.a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-4 bg-[#1A1A1A] text-white px-10 py-4 font-body text-[11px] tracking-[0.22em] uppercase hover:bg-[#C9A96E] transition-colors duration-400"
          >
            <span>Begin Conversation</span>
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
            We respond within 24 hours — Paris time
          </p>
        </motion.div>

        {/* Right — texture/fabric visual */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative hidden md:block"
        >
          {/* Abstract fabric texture composition */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(160deg, #E0DCD4 0%, #CCC8C0 40%, #B8B4AC 100%)",
              }}
            />
            {/* Subtle grid texture overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 19px,
                  #8A8A8A 19px,
                  #8A8A8A 20px
                ), repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 19px,
                  #8A8A8A 19px,
                  #8A8A8A 20px
                )`,
              }}
            />
            {/* Gold accent line */}
            <div className="absolute top-12 right-12 w-px h-24 bg-[#C9A96E] opacity-60" />
            <div className="absolute bottom-16 left-12 right-12">
              <div className="w-8 h-px bg-[#C9A96E] mb-4" />
              <p className="font-display italic text-white/40 text-lg leading-relaxed">
                &ldquo;Each piece begins<br />with a conversation.&rdquo;
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
