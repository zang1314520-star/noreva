"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      ref={ref}
      className="bg-white py-[clamp(8rem,16vw,14rem)] px-8 md:px-16"
    >
      {/* max-w-2xl — more intimate than 3xl, forces tighter line measure */}
      <div className="max-w-2xl mx-auto text-center">

        {/* Headline — the emotional hook */}
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display display-tight font-light italic leading-[1.18] text-[#1A1A1A] mb-12"
          style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)" }}
        >
          We make things that last.
        </motion.h2>

        {/* Gold rule — visual pause, gives the headline space to breathe */}
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

        {/* Body — one breath, not three separate paragraphs */}
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
          Clothing is not a trend. It is a decision.
          <br />
          NOREVA is built for people who choose carefully
          <br />
          and wear with intention.
        </motion.p>

      </div>
    </section>
  );
}
