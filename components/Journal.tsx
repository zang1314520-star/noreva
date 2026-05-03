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
  { id: "01", category: "Materials", title: "On linen in summer.", excerpt: "Why we return to the same fabric every season, and why that is not weakness but certainty.", date: "March 2026", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80", tall: false },
  { id: "02", category: "Making", title: "The atelier at 6am.", excerpt: "Behind the scenes of SS 2026 — before the light changes, before the world wakes.", date: "February 2026", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", tall: true },
  { id: "03", category: "World", title: "Paris, January.", excerpt: "Our first presentation in seven years. What it meant, and what we chose not to say.", date: "January 2026", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80", tall: false },
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
      {/* Image - 懒加载 */}
      <div className="img-zoom overflow-hidden mb-5">
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

      {/* Meta */}
      <span className="label text-[#C9A96E] block mb-2">
        {post.category} — {post.date}
      </span>

      {/* Title */}
      <h3 className="font-display text-[clamp(1.1rem,2vw,1.4rem)] font-light text-[#1A1A1A] mb-3 leading-snug group-hover:text-[#C9A96E] transition-colors duration-300">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="font-body text-[13px] text-[#8A8A8A] leading-[1.8] mb-5">
        {post.excerpt}
      </p>

      <Link href={`/journal/${post.id}`} className="cta-link text-[10px]">
        Read
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
      .then(r => r.json())
      .then(data => {
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
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
      >
        <div>
          <span className="label text-[#8A8A8A] block mb-4">The World of NOREVA</span>
          <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A] leading-tight">
            Journal
          </h2>
        </div>
        <span className="gold-rule" />
      </motion.div>

      {/* Grid — staggered columns */}
      <div id="world" className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
        {posts.map((post, i) => (
          <JournalCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}
