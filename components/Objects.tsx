"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

interface ObjectsProps {
  products?: any[];
  maxVisible?: number;
}

// 三大类配置
const CATEGORIES = [
  {
    key: "clothing",
    name: "服装",
    nameEn: "Clothing",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80",
    subcategories: [
      { name: "T恤", nameEn: "T-Shirts", slug: "tshirts" },
      { name: "外套", nameEn: "Outerwear", slug: "outerwear" },
      { name: "裤子", nameEn: "Pants", slug: "pants" },
      { name: "卫衣", nameEn: "Hoodies", slug: "hoodies" },
      { name: "衬衫", nameEn: "Shirts", slug: "shirts" },
      { name: "连衣裙", nameEn: "Dresses", slug: "dresses" },
    ]
  },
  {
    key: "bagshoes",
    name: "鞋包",
    nameEn: "Shoes & Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    subcategories: [
      { name: "鞋子", nameEn: "Shoes", slug: "shoes" },
      { name: "包包", nameEn: "Bags", slug: "bags" },
    ]
  },
  {
    key: "accessories",
    name: "配饰",
    nameEn: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    subcategories: [
      { name: "手表", nameEn: "Watches", slug: "watches" },
      { name: "皮带", nameEn: "Belts", slug: "belts" },
    ]
  }
];

const shimmer = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAPEAXN3S4rY7hS0lLT0LHQx0bI2MZG0BrWta0I8qIq4u7nE4qIquf/2Q==";

function CategoryCard({ category, index }: { category: typeof CATEGORIES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { lang } = useLanguage();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products?group=${category.key}`}>
        {/* Image container */}
        <div className="relative overflow-hidden mb-4 aspect-[3/4]">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#F5F4F2] animate-pulse" />
          )}
          
          <Image
            src={category.image}
            alt={category.name}
            fill
            className={`object-cover transition-transform duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${isHovered ? "scale-105" : ""}`}
            sizes="(max-width: 768px) 33vw, 33vw"
            onLoad={() => setImageLoaded(true)}
            placeholder="blur"
            blurDataURL={shimmer}
          />

          {/* Hover Overlay with Category Name */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center"
              >
                {/* Category Title */}
                <motion.h3
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="font-display text-2xl text-white mb-4"
                >
                  {lang === "zh" ? category.name : category.nameEn}
                </motion.h3>

                {/* Subcategory bubbles */}
                <div className="flex flex-wrap justify-center gap-2 max-w-[200px]">
                  {category.subcategories.map((sub, i) => (
                    <motion.button
                      key={sub.slug}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.05 + i * 0.03 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/products?category=${sub.slug}`;
                      }}
                      className="px-3 py-1.5 bg-white/95 rounded-full text-xs text-[#1A1A1A] hover:bg-[#C9A96E] hover:text-white transition-colors"
                    >
                      {lang === "zh" ? sub.name : sub.nameEn}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category info */}
        <div className="text-center">
          <h3 className="font-display text-lg font-light text-[#1A1A1A] group-hover:text-[#C9A96E] transition-colors duration-300">
            {lang === "zh" ? category.name : category.nameEn}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Objects({ products = [], maxVisible = 3 }: ObjectsProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  const { lang } = useLanguage();
  const displayCategories = CATEGORIES.slice(0, maxVisible);

  return (
    <section className="bg-white py-[clamp(5rem,10vw,9rem)] px-8 md:px-16">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 18 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-14 md:mb-20 text-center"
      >
        <span className="label text-[#8A8A8A] block mb-4">Curated Selection</span>
        <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A] leading-tight">
          The Objects
        </h2>
      </motion.div>

      {/* Category grid - 3 columns, evenly spaced */}
      <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
        {displayCategories.map((category, index) => (
          <CategoryCard key={category.key} category={category} index={index} />
        ))}
      </div>

      {/* Bottom link */}
      <div className="mt-12 text-center">
        <Link href="/products" className="cta-link">
          Shop All
          <svg width="20" height="1" viewBox="0 0 20 1" fill="none" aria-hidden="true">
            <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="#C9A96E" />
          </svg>
        </Link>
      </div>
    </section>
  );
}