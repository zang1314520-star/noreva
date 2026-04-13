"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { languages } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

const navLeft = [
  { label: "Shop", labelFr: "Boutique", labelIt: "Negozio", labelDe: "Shop", labelEs: "Tienda", href: "/products" },
  { label: "Collections", labelFr: "Collections", labelIt: "Collezioni", labelDe: "Kollektionen", labelEs: "Colecciones", href: "#collections" },
  { label: "World", labelFr: "Monde", labelIt: "Mondo", labelDe: "Welt", labelEs: "Mundo", href: "#world" },
];

const navRight = [
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

const getLabel = (item: typeof navLeft[0], lang: Language) => {
  switch (lang) {
    case "fr": return item.labelFr;
    case "it": return item.labelIt;
    case "de": return item.labelDe;
    case "es": return item.labelEs;
    default: return item.label;
  }
};

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>("en");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    const saved = localStorage.getItem("noreva-lang") as Language;
    if (saved && ["en", "fr", "it", "de", "es"].includes(saved)) {
      setCurrentLang(saved);
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLangChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem("noreva-lang", lang);
    setLangMenuOpen(false);
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
          {/* Left links */}
          <div className="hidden md:flex items-center gap-10">
            {navLeft.map((item) => (
              <Link key={item.label} href={item.href} className="nav-link">
                {getLabel(item, currentLang)}
              </Link>
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
                {currentLang.toUpperCase()}
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className={langMenuOpen ? "rotate-180" : ""}>
                  <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              
              {langMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 bg-white border border-[#E8E6E2] shadow-lg py-2 min-w-[140px] z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangChange(lang.code)}
                        className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors ${
                          currentLang === lang.code ? "text-[#C9A96E]" : "text-[#8A8A8A]"
                        }`}
                      >
                        <span className="font-body text-[12px]">{lang.name}</span>
                        <span className="font-body text-[10px] text-[#A8A4A0]">{lang.native}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>

            {/* Right nav links */}
            {navRight.map((item) => (
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
              {currentLang.toUpperCase()}
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
            className="fixed top-16 right-8 z-50 bg-white border border-[#E8E6E2] shadow-lg py-2 min-w-[140px]"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLangChange(lang.code)}
                className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors ${
                  currentLang === lang.code ? "text-[#C9A96E]" : "text-[#8A8A8A]"
                }`}
              >
                <span className="font-body text-[12px]">{lang.name}</span>
                <span className="font-body text-[10px] text-[#A8A4A0]">{lang.native}</span>
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
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-10"
          >
            {[...navLeft, ...navRight].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-display text-4xl text-[#1A1A1A] hover:text-[#C9A96E] transition-colors duration-300 italic"
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