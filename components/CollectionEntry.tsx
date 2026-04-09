"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

interface CollectionEntryProps {
  category: string;
  season: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  reverse?: boolean;
  bgLeft?: string;
  bgRight?: string;
}

export default function CollectionEntry({
  category,
  season,
  name,
  tagline,
  description,
  href,
  reverse = false,
  bgLeft = "linear-gradient(135deg, #D4CFC5 0%, #BDB8AE 100%)",
  bgRight = "linear-gradient(135deg, #E2DDD5 0%, #CCC8BF 100%)",
}: CollectionEntryProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      id="collections"
      className="py-[clamp(5rem,10vw,9rem)] px-8 md:px-16 overflow-hidden"
    >
      <div
        className={`flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-stretch`}
      >
        {/* Large portrait image — 42% */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-[42%] img-zoom overflow-hidden"
        >
          <div
            className="w-full aspect-[3/4] md:aspect-auto md:h-full min-h-[460px] md:min-h-[620px] transition-transform duration-700 ease-out hover:scale-[1.025]"
            style={{ background: bgLeft }}
          />
        </motion.div>

        {/* Text + secondary image — 58%, pinned bottom */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? -50 : 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full md:w-[58%] flex flex-col ${
            reverse ? "md:pr-16 lg:pr-24" : "md:pl-16 lg:pl-24"
          } pt-10 md:pt-0`}
        >
          {/* Top label — season + category */}
          <div className="mb-auto pt-2">
            <span className="label text-[#A8A4A0]">
              {season}&thinsp;—&thinsp;{category}
            </span>
          </div>

          {/* Secondary image — 3:2 ratio (more editorial, less digital) */}
          <div className="img-zoom overflow-hidden my-10 md:my-12">
            <div
              className="w-full transition-transform duration-700 ease-out hover:scale-[1.025]"
              style={{
                background: bgRight,
                aspectRatio: "3 / 2",
              }}
            />
          </div>

          {/* Text block — pinned to natural flow after secondary image */}
          <div className="mt-auto">
            <span className="gold-rule mb-10 block" />

            <h2
              className="font-display display-tight font-light leading-[1.12] text-[#1A1A1A] mb-5"
              style={{ fontSize: "clamp(2rem, 3.8vw, 3.2rem)" }}
            >
              {name}
            </h2>

            {/* Tagline — 19px italic, clearly distinct from description */}
            <p className="font-display italic text-[#8A8A8A] leading-relaxed mb-4"
               style={{ fontSize: "19px" }}>
              {tagline}
            </p>

            {/* Description — 12px, clearly subordinate */}
            <p className="font-body text-[#A8A4A0] mb-10 tracking-wide"
               style={{ fontSize: "12px" }}>
              {description}
            </p>

            <Link href={href} className="cta-link">
              View Collection
              <svg width="28" height="1" viewBox="0 0 28 1" fill="none" aria-hidden="true">
                <line x1="0" y1="0.5" x2="28" y2="0.5" stroke="#C9A96E" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
