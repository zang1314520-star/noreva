"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "./LanguageContext";

const manifestoContent = {
  en: {
    title: "We make things that last.",
    text1: "Clothing is not a trend. It is a decision.",
    text2: "NOREVA is built for people who choose carefully",
    text3: "and wear with intention.",
  },
  zh: {
    title: "我们制作经久耐用的产品。",
    text1: "服装不是潮流，而是一种选择。",
    text2: "NOREVA专为那些精心挑选",
    text3: "用心穿着的人士而打造。",
  },
  fr: {
    title: "Nous créons des choses qui durent.",
    text1: "Le vêtement n'est pas une tendance. C'est une décision.",
    text2: "NOREVA est conçu pour ceux qui choisissent avec soin",
    text3: "et portent avec intention.",
  },
  it: {
    title: "Creiamo cose che durano.",
    text1: "Il vestito non è una tendenza. È una decisione.",
    text2: "NOREVA è costruito per chi sceglie con cura",
    text3: "e indossa con intenzione.",
  },
  de: {
    title: "Wir machen Dinge, die halten.",
    text1: "Kleidung ist kein Trend. Es ist eine Entscheidung.",
    text2: "NOREVA ist für Menschen, die sorgfältig wählen",
    text3: "und mit Absicht tragen.",
  },
  es: {
    title: "Hacemos cosas que duran.",
    text1: "La ropa no es una tendencia. Es una decisión.",
    text2: "NOREVA está hecho para quienes eligen con cuidado",
    text3: "y visten con intención.",
  },
};

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const { lang } = useLanguage();
  const content = manifestoContent[lang] || manifestoContent.en;

  return (
    <section
      ref={ref}
      className="bg-white py-[clamp(8rem,16vw,14rem)] px-8 md:px-16"
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display display-tight font-light italic leading-[1.18] text-[#1A1A1A] mb-12"
          style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)" }}
        >
          {content.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex justify-center mb-12"
          style={{ transformOrigin: "center" }}
        >
          <span className="gold-rule" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.9,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="font-body text-[15px] text-[#8A8A8A] leading-[2.1]"
        >
          {content.text1}
          <br />
          {content.text2}
          <br />
          {content.text3}
        </motion.p>
      </div>
    </section>
  );
}
