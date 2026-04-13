"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface JournalPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  bg: string;
  image?: string;
  tall?: boolean;
}

const posts: JournalPost[] = [
  {
    id: "01",
    category: "Materials",
    title: "On linen in summer.",
    excerpt:
      "Why we return to the same fabric every season, and why that is not weakness but certainty.",
    date: "March 2026",
    bg: "linear-gradient(145deg, #DDD8CE 0%, #CCCAC0 100%)",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80",
    tall: false,
  },
  {
    id: "02",
    category: "Making",
    title: "The atelier at 6am.",
    excerpt:
      "Behind the scenes of SS 2026 — before the light changes, before the world wakes.",
    date: "February 2026",
    bg: "linear-gradient(145deg, #D0CBB8 0%, #C0BBA8 100%)",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    tall: true,
  },
  {
    id: "03",
    category: "World",
    title: "Paris, January.",
    excerpt:
      "Our first presentation in seven years. What it meant, and what we chose not to say.",
    date: "January 2026",
    bg: "linear-gradient(145deg, #D8D4CC 0%, #C8C4BC 100%)",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
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
      {/* Image */}
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
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAPEAXN3S4rY7hS0lLT0LHQx0bI2MZG0BrWta0I8qIq4u7nE4qIquf/2Q=="
          />
        ) : (
          <div
            className={`w-full ${
              post.tall ? "aspect-[3/4]" : "aspect-[4/3]"
            } transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
            style={{ background: post.bg }}
          />
        )}
      </div>

      {/* Meta */}
      <span className="label text-[#C9A96E] block mb-2">{post.category} — {post.date}</span>

      {/* Title */}
      <h3 className="font-display text-[clamp(1.1rem,2vw,1.4rem)] font-light text-[#1A1A1A] mb-3 leading-snug group-hover:text-[#C9A96E] transition-colors duration-300">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="font-body text-[13px] text-[#8A8A8A] leading-[1.8] mb-5">
        {post.excerpt}
      </p>

      <Link href="#journal" className="cta-link text-[10px]">
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
