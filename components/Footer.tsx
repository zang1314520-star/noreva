"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const collections = [
  { label: "Womenswear", href: "#" },
  { label: "Menswear", href: "#" },
  { label: "Objects", href: "#" },
  { label: "Accessories", href: "#" },
];

const info = [
  { label: "Journal", href: "#journal" },
  { label: "The Atelier", href: "#" },
  { label: "Sustainability", href: "#" },
  { label: "Careers", href: "#" },
];

const WHATSAPP_NUMBER = "33600000000";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E8E6E2] pt-20 pb-12 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-1"
          >
            <span className="label text-[#1A1A1A] block mb-5 text-[13px] tracking-[0.25em]">
              NOREVA
            </span>
            <p className="font-body text-[13px] text-[#8A8A8A] leading-[1.9] mb-4">
              Paris — Milan
            </p>
            <p className="font-body text-[13px] text-[#8A8A8A] leading-[1.9]">
              Est. 2024
            </p>
          </motion.div>

          {/* Collections */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            <span className="label text-[#8A8A8A] block mb-5">Collections</span>
            <nav className="space-y-3">
              {collections.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
          >
            <span className="label text-[#8A8A8A] block mb-5">Maison</span>
            <nav className="space-y-3">
              {info.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="label text-[#8A8A8A] block mb-5">Contact</span>
            <nav className="space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200"
              >
                WhatsApp
              </a>
              <a
                href="mailto:contact@noreva.com"
                className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200"
              >
                contact@noreva.com
              </a>
              <a
                href="#"
                className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200"
              >
                Instagram
              </a>
            </nav>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E8E6E2] mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-body text-[11px] text-[#C0BCBA] tracking-wider">
            © 2026 NOREVA. All rights reserved.
          </p>

          {/* Language toggle */}
          <div className="flex items-center gap-4">
            {["EN", "FR", "IT"].map((lang, i) => (
              <button
                key={lang}
                className={`font-body text-[11px] tracking-widest transition-colors duration-200 ${
                  i === 0
                    ? "text-[#C9A96E]"
                    : "text-[#C0BCBA] hover:text-[#8A8A8A]"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <p className="font-body text-[11px] text-[#C0BCBA] tracking-wider hidden md:block">
            Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
}
