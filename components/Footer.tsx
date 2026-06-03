"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/site";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-[#E8E6E2] pt-20 pb-12 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
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
              {t("footerShanghaiMilan")}
            </p>
            <p className="font-body text-[13px] text-[#8A8A8A] leading-[1.9]">
              {t("footerEst")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            <span className="label text-[#8A8A8A] block mb-5">{t("footerCollections")}</span>
            <nav className="space-y-3">
              <Link href="/products" className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200">
                Shop All
              </Link>
              <Link href="/products?category=bags" className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200">
                Bags
              </Link>
              <Link href="/products?category=clothing" className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200">
                Clothing
              </Link>
              <Link href="/products?category=watches" className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200">
                Watches
              </Link>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.11 }}
          >
            <span className="label text-[#8A8A8A] block mb-5">Information</span>
            <nav className="space-y-3">
              <Link href="/privacy" className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200">
                {t("footerPrivacy")}
              </Link>
              <Link href="/returns" className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200">
                Shipping & Returns
              </Link>
              <Link href="/size-guide" className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200">
                Size Guide
              </Link>
              <Link href="/about" className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200">
                About
              </Link>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
          >
            <span className="label text-[#8A8A8A] block mb-5">{t("footerContact")}</span>
            <nav className="space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200"
              >
                {t("footerWhatsApp")}
              </a>
              <a
                href={CONTACT_EMAIL_HREF}
                className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200"
              >
                {CONTACT_EMAIL}
              </a>
              <Link href="/contact" className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200">
                Contact Page
              </Link>
              {INSTAGRAM_URL ? (
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200"
                >
                  {t("footerInstagram")}
                </a>
              ) : null}
            </nav>
          </motion.div>
        </div>

        <div className="h-px bg-[#E8E6E2] mb-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-body text-[11px] text-[#C0BCBA] tracking-wider">
            {t("footerCopyright")}
          </p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-body text-[11px] text-[#C0BCBA] tracking-wider hover:text-[#8A8A8A] transition-colors"
            >
              {t("footerPrivacy")}
            </Link>
            <Link
              href="/returns"
              className="font-body text-[11px] text-[#C0BCBA] tracking-wider hover:text-[#8A8A8A] transition-colors"
            >
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
