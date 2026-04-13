"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "./LanguageContext";

const WHATSAPP_NUMBER = "8618508036618";

const content = {
  en: {
    title: "Personal Service",
    subtitle: "Your personal stylist",
    subtitle2: "is a message away.",
    text1: "We don't believe in shopping carts.",
    text2: "We believe in conversations.",
    text3: "Tell us what you're looking for — a wardrobe,",
    text4: "a gift, a single piece — and we will guide you.",
    btn: "Begin Conversation",
    note: "We respond within 24 hours",
  },
  fr: {
    title: "Service Personnel",
    subtitle: "Votre styliste personnel",
    subtitle2: "est à un message de distance.",
    text1: "Nous ne croyons pas aux paniers d'achat.",
    text2: "Nous croyons aux conversations.",
    text3: "Dites-nous ce que vous cherchez — une garde-robe,",
    text4: "un cadeau, une pièce unique — et nous vous guiderons.",
    btn: "Commencer la Conversation",
    note: "Nous répondons sous 24 heures",
  },
  it: {
    title: "Servizio Personale",
    subtitle: "Il tuo stilista personale",
    subtitle2: "è a un messaggio di distanza.",
    text1: "Non crediamo nei carrelli.",
    text2: "Crediamo nelle conversazioni.",
    text3: "Dicci cosa stai cercando — una garderoba,",
    text4: "un regalo, una peça unica — e ti guideremo.",
    btn: "Inizia la Conversazione",
    note: "Rispondiamo entro 24 ore",
  },
  de: {
    title: "Persönlicher Service",
    subtitle: "Ihr persönlicher Stylist",
    subtitle2: "ist nur eine Nachricht entfernt.",
    text1: "Wir glauben nicht an Einkaufswagen.",
    text2: "Wir glauben an Gespräche.",
    text3: "Sagen Sie uns, was Sie suchen — eine Garderobe,",
    text4: "ein Geschenk, ein einzelnes Stück — und wir führen Sie.",
    btn: "Gespräch Beginnen",
    note: "Wir antworten innerhalb von 24 Stunden",
  },
  es: {
    title: "Servicio Personal",
    subtitle: "Tu estilista personal",
    subtitle2: "está a un mensaje de distancia.",
    text1: "No creemos en carros de compra.",
    text2: "Creemos en conversaciones.",
    text3: "Dinos qué buscas — un guardarropa,",
    text4: "un regalo, una pieza única — y te guiaremos.",
    btn: "Iniciar Conversación",
    note: "Respondemos en 24 horas",
  },
};

export default function PersonalShopper() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello, I would like to speak with a personal shopper at NOREVA."
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
            {c.title}
          </span>

          <h2 className="font-display text-[clamp(2.4rem,4.5vw,3.8rem)] font-light leading-[1.15] text-[#1A1A1A] mb-8">
            {c.subtitle}<br />
            <span className="italic">{c.subtitle2}</span>
          </h2>

          <span className="gold-rule mb-8 block" />

          <div className="space-y-4 mb-12">
            <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9]">
              {c.text1}
              <br />
              {c.text2}
            </p>
            <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9]">
              {c.text3}
              <br />
              {c.text4}
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
            <span>{c.btn}</span>
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
            {c.note}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
