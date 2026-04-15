"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/useTranslation";

const CATEGORIES = [
  {
    key: "clothing",
    nameEn: "Clothing",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80",
    subcategories: [
      { nameEn: "T-Shirts", slug: "tshirts" },
      { nameEn: "Outerwear", slug: "outerwear" },
      { nameEn: "Pants", slug: "pants" },
      { nameEn: "Hoodies", slug: "hoodies" },
      { nameEn: "Shirts", slug: "shirts" },
      { nameEn: "Dresses", slug: "dresses" },
    ]
  },
  {
    key: "shoes",
    nameEn: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    subcategories: [
      { nameEn: "Sneakers", slug: "sneakers" },
      { nameEn: "Loafers", slug: "loafers" },
      { nameEn: "Boots", slug: "boots" },
      { nameEn: "Sandals", slug: "sandals" },
    ]
  },
  {
    key: "bags",
    nameEn: "Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    subcategories: [
      { nameEn: "Handbags", slug: "handbags" },
      { nameEn: "Backpacks", slug: "backpacks" },
      { nameEn: "Clutches", slug: "clutches" },
      { nameEn: "Wallets", slug: "wallets" },
    ]
  },
  {
    key: "accessories",
    nameEn: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    subcategories: [
      { nameEn: "Watches", slug: "watches" },
      { nameEn: "Belts", slug: "belts" },
      { nameEn: "Sunglasses", slug: "sunglasses" },
      { nameEn: "Jewelry", slug: "jewelry" },
    ]
  }
];

const shimmer = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAPEAXN3S4rY7hS0lLT0LHQx0bI2MZG0BrWta0I8qIq4u7nE4qIquf/2Q==";

function CategoryCard({ category, index }: { category: typeof CATEGORIES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
        <div className="relative overflow-hidden mb-4 aspect-[3/4]">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#F5F4F2] animate-pulse" />
          )}
          
          <Image
            src={category.image}
            alt={category.nameEn}
            fill
            className={`object-cover transition-transform duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"} ${isHovered ? "scale-105" : ""}`}
            sizes="(max-width: 768px) 50vw, 25vw"
            onLoad={() => setImageLoaded(true)}
            placeholder="blur"
            blurDataURL={shimmer}
          />

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center"
              >
                <motion.h3
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="font-display text-2xl text-white mb-4"
                >
                  {category.nameEn}
                </motion.h3>

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
                      {sub.nameEn}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center">
          <h3 className="font-display text-lg font-light text-[#1A1A1A] group-hover:text-[#C9A96E] transition-colors duration-300">
            {category.nameEn}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProductVignettes() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { t } = useTranslation();

  return (
    <section ref={ref} className="py-[clamp(5rem,10vw,9rem)] overflow-hidden bg-white">
      <div className="px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <span className="label text-[#8A8A8A] block mb-3">Collection</span>
          <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A]">
            {t("productsTitle")}
          </h2>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {CATEGORIES.map((category, index) => (
            <CategoryCard key={category.key} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
