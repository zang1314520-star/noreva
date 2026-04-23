"use client";

import { useParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const articles: Record<string, {
  id: string;
  category: string;
  title: string;
  date: string;
  image: string;
  content: string[];
}> = {
  "01": {
    id: "01",
    category: "Materials",
    title: "On linen in summer.",
    date: "March 2026",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
    content: [
      "There is a reason we return to linen every summer. It is not habit. It is conviction.",
      "Linen breathes. In heat, in humidity, in the particular languor of July afternoons, it does what no synthetic can — it works with the body, not against it. The same cannot be said for most things we wear.",
      "We source our linen from a single mill in Belgium. The same mill. Every season. The relationship began in 2019, when we were still finding ourselves. Now it is one of the anchors of our identity.",
      "The fabric arrives pre-washed, which softens it without weakening it. It wrinkles beautifully — intentionally, deliberately. We do not fight the wrinkles. We consider them evidence of a life being lived.",
      "This season, we introduced linen in three new colors: unbleached ecru, stone grey, and a pale indigo we call 'morning sky.' Each feels different against the skin. Each tells a different story.",
      "The decision to commit fully to linen was not made lightly. It meant reducing our range. It meant saying no to cotton blends that would be easier to produce. It meant accepting that some customers would prefer the smooth drape of other fabrics.",
      "But linen is honest. And we have decided to be honest too."
    ]
  },
  "02": {
    id: "02",
    category: "Making",
    title: "The atelier at 6am.",
    date: "February 2026",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    content: [
      "The atelier opens before dawn. This is not for effect — it is simply how the work demands to be done.",
      "In the early hours, the light is different. Softer. More honest. Patterns are cut with greater precision. Seams are placed with more care. The noise of the city has not yet built to its peak, and concentration deepens accordingly.",
      "SS 2026 was conceived here, in this quiet. The twelve pieces of The Atelier Line — each one a response to the question: what is the minimum required for maximum effect?",
      "The answer, we found, is not simplicity. It is intention. A collar that sits exactly 3.8cm at the back, no more. A shoulder seam placed 1.2cm forward to create the illusion of narrower upper arms without the discomfort of a constrictive sleeve. These are the details that cannot be photographed.",
      "We do not believe in invisible labor. Everything visible in our work is there because it should be. Everything invisible — the hours before the light changed — is there too, in the weight of the garment, in the way it settles.",
      "The atelier will remain open to visitors by appointment from June. There is no shop. There is only the making."
    ]
  },
  "03": {
    id: "03",
    category: "World",
    title: "Paris, January.",
    date: "January 2026",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
    content: [
      "Seven years since our last presentation. Seven years of asking ourselves whether Paris was necessary.",
      "The answer was always yes. But 'yes' required a reason. Not a celebration, not a milestone — these are hollow without substance. A reason that had to do with the work itself.",
      "We found it in the question of silence. Paris, in January, is the quietest city in Europe. The tourists are gone. The restaurants close early. The Seine reflects grey skies with an accuracy that seems almost accusatory. In this silence, clothing speaks.",
      "We showed in a space in the 10th arrondissement. No music. No models walking to beats. The garments were presented on wooden forms, lit by north-facing windows. Visitors arrived without invitation — we had sent nothing but an address.",
      "The response was not applause. It was quiet — the kind of quiet that is worth more. People touched the fabrics. They asked about construction. They stood in front of single pieces for minutes at a time.",
      "We did not give a speech. We did not print a manifesto. We simply made the work, and let it speak.",
      "What we chose not to say: that this was our best collection. That we are proud, quietly, in the way that allows for the next thing."
    ]
  }
};

export default function JournalArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const article = articles[id];

  if (!article) {
    return (
      <main className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-32 pb-24 px-8 md:px-16 text-center">
          <h1 className="font-display text-3xl mb-6">Article not found</h1>
          <Link href="/#journal" className="cta-link">
            Return to Journal
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      <div className="relative h-[60vh] md:h-[70vh] mt-16 overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      <article className="max-w-2xl mx-auto px-8 md:px-16 -mt-20 relative z-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="label text-[#C9A96E] block mb-4">
            {article.category} — {article.date}
          </span>

          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#1A1A1A] leading-tight mb-8">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 mb-12">
            <span className="gold-rule" />
          </div>

          <div className="space-y-6">
            {article.content.map((paragraph, index) => (
              <p key={index} className="font-body text-[15px] text-[#1A1A1A] leading-[2]">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-[#E8E6E2]">
            <Link href="/#journal" className="cta-link">
              <svg width="16" height="1" viewBox="0 0 16 1" fill="none">
                <line x1="16" y1="0.5" x2="0" y2="0.5" stroke="#C9A96E" />
              </svg>
              Back to Journal
            </Link>
          </div>
        </motion.div>
      </article>

      <Footer />
    </main>
  );
}
