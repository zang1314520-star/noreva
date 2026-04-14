"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface CollectionEntryProps {
  category: string;
  season: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  reverse?: boolean;
  imageLeft?: string;
  imageRight?: string;
}

export default function CollectionEntry({
  category,
  season,
  name,
  tagline,
  description,
  href,
  reverse = false,
  imageLeft,
  imageRight,
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
          {imageLeft ? (
            <Image
              src={imageLeft}
              alt={`${category} collection`}
              width={800}
              height={1067}
              className="w-full aspect-[3/4] md:aspect-auto md:h-full min-h-[460px] md:min-h-[620px] object-cover transition-transform duration-700 ease-out hover:scale-[1.025]"
              sizes="(max-width: 768px) 100vw, 42vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-[3/4] md:aspect-auto md:h-full min-h-[460px] md:min-h-[620px] bg-[#E8E6E2]" />
          )}
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

          {/* Secondary image — 3:2 ratio */}
          <div className="img-zoom overflow-hidden my-10 md:my-12">
            {imageRight ? (
              <Image
                src={imageRight}
                alt=""
                width={800}
                height={533}
                className="w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.025]"
                style={{ aspectRatio: "3 / 2" }}
                sizes="(max-width: 768px) 100vw, 58vw"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full bg-[#E8E6E2]"
                style={{ aspectRatio: "3 / 2" }}
              />
            )}
          </div>

          {/* Text block */}
          <div className="mt-auto">
            <span className="gold-rule mb-10 block" />

            <h2
              className="font-display display-tight font-light leading-[1.12] text-[#1A1A1A] mb-5"
              style={{ fontSize: "clamp(2rem, 3.8vw, 3.2rem)" }}
            >
              {name}
            </h2>

            <p className="font-body text-[#8A8A8A] text-[15px] leading-relaxed mb-8 max-w-[340px]">
              {tagline}
            </p>

            <p className="font-body text-[13px] text-[#A8A4A0] leading-[1.8] mb-10 max-w-[280px]">
              {description}
            </p>

            <Link href={href} className="cta-link">
              View Collection
              <svg width="20" height="1" viewBox="0 0 20 1" fill="none" aria-hidden="true">
                <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="#C9A96E" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
