"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface JournalPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  tall?: boolean;
}

const DEFAULT_POSTS: JournalPost[] = [
  {
    id: "01",
    category: "Pack Guide",
    title: "18L, 20L or 25L: which backpack capacity fits your day?",
    excerpt: "A practical capacity guide for laptops, gym layers, short trips, and the everyday carry people actually use.",
    date: "March 2026",
    image: "/images/brand/backpack-main-premium.png",
    tall: false,
  },
  {
    id: "02",
    category: "Organization",
    title: "What a 16-inch laptop backpack should get right.",
    excerpt: "Laptop protection is only the beginning. The best work pack makes chargers, cables, keys, and documents effortless to reach.",
    date: "February 2026",
    image: "/images/brand/backpack-detail-organizer.png",
    tall: true,
  },
  {
    id: "03",
    category: "Travel",
    title: "The business-trip backpack checklist.",
    excerpt: "Luggage pass-through, quick-access pockets, water-resistant fabric, and the small details that make airport days calmer.",
    date: "January 2026",
    image: "/images/brand/hero-backpack-campaign.png",
    tall: false,
  },
];

function JournalCard({ post, index }: { post: JournalPost; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`group cursor-pointer ${post.tall ? "md:mt-[-3rem]" : ""}`}
    >
      <div className="img-zoom overflow-hidden mb-5 rounded-[18px] bg-[#F7F5F1]">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            width={600}
            height={post.tall ? 800 : 450}
            className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
              post.tall ? "aspect-[3/4]" : "aspect-[4/3]"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full bg-[#E8E6E2] ${
              post.tall ? "aspect-[3/4]" : "aspect-[4/3]"
            }`}
          />
        )}
      </div>

      <span className="label text-[#C9A96E] block mb-2">
        {post.category} - {post.date}
      </span>

      <h3 className="font-display text-[clamp(1.1rem,2vw,1.4rem)] font-light text-[#1A1A1A] mb-3 leading-snug group-hover:text-[#C9A96E] transition-colors duration-300">
        {post.title}
      </h3>

      <p className="font-body text-[13px] text-[#8A8A8A] leading-[1.8] mb-5">
        {post.excerpt}
      </p>

      <Link href={`/journal/${post.id}`} className="cta-link text-[10px]">
        Read guide
        <svg width="16" height="1" viewBox="0 0 16 1" fill="none">
          <line x1="0" y1="0.5" x2="16" y2="0.5" stroke="#C9A96E" />
        </svg>
      </Link>
    </motion.article>
  );
}

export default function Journal() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  const [posts, setPosts] = useState<JournalPost[]>(DEFAULT_POSTS);

  useEffect(() => {
    fetch("/api/site-images")
      .then((r) => r.json())
      .then((data) => {
        if (data?.journal) {
          setPosts([
            { ...DEFAULT_POSTS[0], image: data.journal.post1 || DEFAULT_POSTS[0].image },
            { ...DEFAULT_POSTS[1], image: data.journal.post2 || DEFAULT_POSTS[1].image },
            { ...DEFAULT_POSTS[2], image: data.journal.post3 || DEFAULT_POSTS[2].image },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="journal"
      className="bg-white py-[clamp(6rem,12vw,10rem)] px-8 md:px-16"
    >
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
      >
        <div>
          <span className="label text-[#8A8A8A] block mb-4">Backpack Guides</span>
          <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A] leading-tight">
            Carry Notes
          </h2>
        </div>
        <p className="max-w-sm font-body text-[13px] leading-[1.8] text-[#8A8A8A]">
          Practical buying advice for laptop backpacks, travel packs, and daily carry setups.
        </p>
        <span className="gold-rule" />
      </motion.div>

      <div id="world" className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
        {posts.map((post, i) => (
          <JournalCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}
