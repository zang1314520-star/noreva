"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { languages, t } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { useLanguage } from "./LanguageContext";
import { useWishlist } from "@/lib/useWishlist";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { lang, setLang, currentLangName } = useLanguage();
  const wishlist = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    setLangMenuOpen(false);
    window.location.reload();
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-sm border-b border-[#E8E6E2]" : "bg-transparent"
        }`}
      >
        <div className="h-9 bg-[#1A1A1A] text-white">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-center gap-5 overflow-hidden px-4 font-body text-[9px] uppercase tracking-[0.18em] md:gap-10 md:text-[10px]">
            <span>Free Global Shipping</span>
            <span className="hidden h-3 w-px bg-white/25 sm:block" />
            <span>30-Day Returns</span>
            <span className="hidden h-3 w-px bg-white/25 sm:block" />
            <span>24-Month Warranty</span>
            <span className="hidden h-3 w-px bg-white/25 lg:block" />
            <span className="hidden lg:inline">Pack Finder Support</span>
          </div>
        </div>
        <nav className="px-8 md:px-16 h-16 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="nav-link">
              {t(lang, "navHome") || "Home"}
            </Link>
            <Link href="/#testimonials" className="nav-link">
              {t(lang, "navWorld")}
            </Link>
            <Link href="/#journal" className="nav-link">
              {t(lang, "navJournal")}
            </Link>
          </div>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-body text-[13px] tracking-[0.3em] uppercase text-[#1A1A1A] hover:text-[#C9A96E] transition-colors duration-300"
          >
            Nayo Smart
          </Link>

          <div className="hidden md:flex items-center gap-8 ml-auto">
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 font-body text-[11px] tracking-[0.2em] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors"
              >
                {currentLangName}
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className={`transition-transform ${langMenuOpen ? "rotate-180" : ""}`}>
                  <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 bg-white border border-[#E8E6E2] shadow-lg min-w-[120px]"
                    >
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLangChange(language.code)}
                          className={`block w-full text-left px-4 py-2.5 font-body text-[11px] tracking-[0.15em] hover:bg-[#F7F5F1] transition-colors ${
                            lang === language.code ? "text-[#C9A96E]" : "text-[#8A8A8A]"
                          }`}
                        >
                          {language.name} - {language.native}
                        </button>
                      ))}
                    </motion.div>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setLangMenuOpen(false)} />
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link href="/products" className="nav-link">
              {t(lang, "navCollections")}
            </Link>
            <Link href="/products?wishlist=1" className="relative nav-link">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlist.count > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#C9A96E] text-white text-[9px] rounded-full flex items-center justify-center font-medium">{wishlist.count}</span>
              )}
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`w-5 h-px bg-[#1A1A1A] transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-px bg-[#1A1A1A] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-px bg-[#1A1A1A] transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-[#E8E6E2]"
            >
              <div className="px-8 py-6 space-y-4">
                <Link href="/products" className="block font-body text-[13px] tracking-[0.15em] text-[#1A1A1A]" onClick={() => setMenuOpen(false)}>
                  {t(lang, "navCollections")}
                </Link>
                <Link href="/products?wishlist=1" className="flex items-center gap-2 font-body text-[13px] tracking-[0.15em] text-[#1A1A1A]" onClick={() => setMenuOpen(false)}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {lang === "zh" ? "鎴戠殑鏀惰棌" : "Wishlist"} {wishlist.count > 0 && `(${wishlist.count})`}
                </Link>
                <Link href="/#journal" className="block font-body text-[13px] tracking-[0.15em] text-[#1A1A1A]" onClick={() => setMenuOpen(false)}>
                  {t(lang, "navJournal")}
                </Link>
                <Link href="/faq" className="block font-body text-[13px] tracking-[0.15em] text-[#1A1A1A]" onClick={() => setMenuOpen(false)}>
                  FAQ
                </Link>
                <Link href="/about" className="block font-body text-[13px] tracking-[0.15em] text-[#1A1A1A]" onClick={() => setMenuOpen(false)}>
                  About
                </Link>
                <Link href="/contact" className="block font-body text-[13px] tracking-[0.15em] text-[#1A1A1A]" onClick={() => setMenuOpen(false)}>
                  Contact
                </Link>
                <div className="pt-4 border-t border-[#E8E6E2]">
                  <p className="text-[11px] tracking-[0.2em] text-[#8A8A8A] mb-3">LANGUAGE</p>
                  <div className="flex flex-wrap gap-4">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          handleLangChange(language.code);
                          setMenuOpen(false);
                        }}
                        className={`font-body text-[11px] tracking-[0.15em] ${
                          lang === language.code ? "text-[#C9A96E]" : "text-[#8A8A8A]"
                        }`}
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
