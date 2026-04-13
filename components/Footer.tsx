"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { languages } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

const collections = [
  { label: "Shop All", labelFr: "Tout Voir", labelIt: "Vedi Tutto", labelDe: "Alle Ansehen", labelEs: "Ver Todo", href: "/products" },
  { label: "Bags", labelFr: "Sacs", labelIt: "Borse", labelDe: "Taschen", labelEs: "Bolsos", href: "/products?category=bags" },
  { label: "Clothing", labelFr: "Vêtements", labelIt: "Abbigliamento", labelDe: "Kleidung", labelEs: "Ropa", href: "/products?category=clothing" },
  { label: "Watches", labelFr: "Montres", labelIt: "Orologi", labelDe: "Uhren", labelEs: "Relojes", href: "/products?category=watches" },
  { label: "Pants", labelFr: "Pantalons", labelIt: "Pantaloni", labelDe: "Hosen", labelEs: "Pantalones", href: "/products?category=pants" },
];

const info = [
  { label: "Journal", href: "#journal" },
  { label: "The Atelier", href: "#" },
  { label: "Sustainability", href: "#" },
  { label: "Careers", href: "#" },
];

const WHATSAPP_NUMBER = "8618508036618";

export default function Footer() {
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const getCollectionLabel = (item: typeof collections[0]) => {
    switch (currentLang) {
      case "fr": return item.labelFr;
      case "it": return item.labelIt;
      case "de": return item.labelDe;
      case "es": return item.labelEs;
      default: return item.label;
    }
  };

  const getLabel = (key: string) => {
    const labels: Record<string, Record<Language, string>> = {
      collections: { en: "Collections", fr: "Collections", it: "Collezioni", de: "Kollektionen", es: "Colecciones" },
      maison: { en: "Maison", fr: "Maison", it: "Maison", de: "Maison", es: "Maison" },
      contact: { en: "Contact", fr: "Contact", it: "Contatto", de: "Kontakt", es: "Contacto" },
      whatsApp: { en: "WhatsApp", fr: "WhatsApp", it: "WhatsApp", de: "WhatsApp", es: "WhatsApp" },
      instagram: { en: "Instagram", fr: "Instagram", it: "Instagram", de: "Instagram", es: "Instagram" },
      shanghaiMilan: { en: "Shanghai — Milan", fr: "Shanghai — Milan", it: "Shanghai — Milano", de: "Shanghai — Mailand", es: "Shanghái — Milán" },
      est: { en: "Est. 2026", fr: "Est. 2026", it: "Est. 2026", de: "Est. 2026", es: "Est. 2026" },
      copyright: { en: "© 2026 NOREVA. All rights reserved.", fr: "© 2026 NOREVA. Tous droits réservés.", it: "© 2026 NOREVA. Tutti i diritti riservati.", de: "© 2026 NOREVA. Alle Rechte vorbehalten.", es: "© 2026 NOREVA. Todos los derechos reservados." },
      privacy: { en: "Privacy Policy", fr: "Politique de Confidentialité", it: "Informativa sulla Privacy", de: "Datenschutz", es: "Política de Privacidad" },
    };
    return labels[key]?.[currentLang] || labels[key]?.en || key;
  };

  return (
    <footer className="bg-white border-t border-[#E8E6E2] pt-20 pb-12 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
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
              {getLabel("shanghaiMilan")}
            </p>
            <p className="font-body text-[13px] text-[#8A8A8A] leading-[1.9]">
              {getLabel("est")}
            </p>
          </motion.div>

          {/* Collections */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            <span className="label text-[#8A8A8A] block mb-5">{getLabel("collections")}</span>
            <nav className="space-y-3">
              {collections.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200"
                >
                  {getCollectionLabel(item)}
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
            <span className="label text-[#8A8A8A] block mb-5">{getLabel("maison")}</span>
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
            <span className="label text-[#8A8A8A] block mb-5">{getLabel("contact")}</span>
            <nav className="space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors duration-200"
              >
                {getLabel("whatsApp")}
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
                {getLabel("instagram")}
              </a>
            </nav>
          </motion.div>
        </div>

        <div className="h-px bg-[#E8E6E2] mb-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-body text-[11px] text-[#C0BCBA] tracking-wider">
            {getLabel("copyright")}
          </p>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 font-body text-[11px] tracking-widest text-[#C9A96E] hover:text-[#8A8A8A] transition-colors"
            >
              {currentLang.toUpperCase()}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={langMenuOpen ? "rotate-180" : ""}>
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            
            {langMenuOpen && (
              <div className="absolute bottom-full mb-2 right-0 bg-white border border-[#E8E6E2] shadow-lg py-2 min-w-[120px]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 font-body text-[11px] tracking-wider hover:bg-[#FAFAFA] transition-colors ${
                      currentLang === lang.code ? "text-[#C9A96E]" : "text-[#8A8A8A]"
                    }`}
                  >
                    {lang.name} ({lang.native})
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="font-body text-[11px] text-[#C0BCBA] tracking-wider hidden md:block">
            {getLabel("privacy")}
          </p>
        </div>
      </div>
    </footer>
  );
}