"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { languages } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { useLanguage } from "./LanguageContext";

// 三大分类
const CATEGORIES = [
  {
    key: "clothing",
    name: "服装",
    nameEn: "Clothing",
    subcategories: [
      { name: "T恤", nameEn: "T-Shirts", slug: "tshirts" },
      { name: "外套", nameEn: "Outerwear", slug: "outerwear" },
      { name: "裤子", nameEn: "Pants", slug: "pants" },
      { name: "卫衣", nameEn: "Hoodies", slug: "hoodies" },
      { name: "衬衫", nameEn: "Shirts", slug: "shirts" },
      { name: "连衣裙", nameEn: "Dresses", slug: "dresses" },
    ]
  },
  {
    key: "bagshoes",
    name: "鞋包",
    nameEn: "Shoes & Bags",
    subcategories: [
      { name: "鞋子", nameEn: "Shoes", slug: "shoes" },
      { name: "包包", nameEn: "Bags", slug: "bags" },
    ]
  },
  {
    key: "accessories",
    name: "配饰",
    nameEn: "Accessories",
    subcategories: [
      { name: "手表", nameEn: "Watches", slug: "watches" },
      { name: "皮带", nameEn: "Belts", slug: "belts" },
    ]
  }
];

const NAV_RIGHT = [
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { lang, setLang, currentLangName } = useLanguage();

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
        <nav className="px-8 md:px-16 h-16 flex items-center justify-between">
          {/* Left: Categories with dropdown */}
          <div className="hidden md:flex items-center gap-10">
            {CATEGORIES.map((category) => (
              <div
                key={category.key}
                className="relative"
                onMouseEnter={() => setActiveCategory(category.key)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button className="nav-link flex items-center gap-1">
                  {lang === "zh" ? category.name : category.nameEn}
                  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className={`transition-transform ${activeCategory === category.key ? "rotate-180" : ""}`}>
                    <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeCategory === category.key && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 bg-white border border-[#E8E6E2] shadow-lg min-w-[180px] z-50"
                    >
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/products?category=${sub.slug}`}
                          className="block px-5 py-3 text-sm text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#FAFAFA] transition-colors border-b border-[#F0EFED] last:border-0"
                          onClick={() => setActiveCategory(null)}
                        >
                          {lang === "zh" ? sub.name : sub.nameEn}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Center logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-body text-[13px] tracking-[0.3em] uppercase text-[#1A1A1A] hover:text-[#C9A96E] transition-colors duration-300"
          >
            NOREVA
          </Link>

          {/* Right side: Language + Links */}
          <div className="hidden md:flex items-center gap-8 ml-auto">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 font-body text-[11px] tracking-[0.2em] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors"
              >
                {currentLangName}
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className={langMenuOpen ? "rotate-180" : ""}>
                  <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              
              <AnimatePresence>
                {langMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 bg-white border border-[#E8E6E2] shadow-lg py-2 min-w-[140px] z-50"
                    >
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => handleLangChange(l.code)}
                          className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors ${
                            lang === l.code ? "text-[#C9A96E]" : "text-[#8A8A8A]"
                          }`}
                        >
                          <span className="font-body text-[12px]">{l.name}</span>
                          <span className="font-body text-[10px] text-[#A8A4A0]">{l.native}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Right nav links */}
            {NAV_RIGHT.map((item) => (
              <Link key={item.label} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile: Language + Menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="font-body text-[11px] tracking-[0.2em] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors"
            >
              {currentLangName}
            </button>
            
            <button
              className="flex flex-col gap-[5px] p-2 group"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-px bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block w-4 h-px bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-px bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Language Menu */}
      <AnimatePresence>
        {langMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-8 z-50 bg-white border border-[#E8E6E2] shadow-lg py-2 min-w-[140px] md:hidden"
          >
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLangChange(l.code)}
                className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors ${
                  lang === l.code ? "text-[#C9A96E]" : "text-[#8A8A8A]"
                }`}
              >
                <span className="font-body text-[12px]">{l.name}</span>
                <span className="font-body text-[10px] text-[#A8A4A0]">{l.native}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8"
          >
            {CATEGORIES.map((category) => (
              <div key={category.key} className="text-center">
                <h3 className="font-display text-2xl text-[#1A1A1A] mb-4">
                  {lang === "zh" ? category.name : category.nameEn}
                </h3>
                <div className="space-y-2">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/products?category=${sub.slug}`}
                      className="block font-body text-sm text-[#8A8A8A] hover:text-[#C9A96E] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {lang === "zh" ? sub.name : sub.nameEn}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {NAV_RIGHT.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-display text-2xl text-[#1A1A1A] hover:text-[#C9A96E] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}