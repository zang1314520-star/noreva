"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  category: string;
  price: string;
  image: string;
}

interface ObjectsProps {
  products?: Product[];
  maxVisible?: number;
}

// 三大类细分类
const SUBCATEGORIES = [
  // 服装
  { name: "T恤", nameEn: "T-Shirts", slug: "tshirts", group: "clothing" },
  { name: "外套", nameEn: "Outerwear", slug: "outerwear", group: "clothing" },
  { name: "裤子", nameEn: "Pants", slug: "pants", group: "clothing" },
  { name: "卫衣", nameEn: "Hoodies", slug: "hoodies", group: "clothing" },
  { name: "衬衫", nameEn: "Shirts", slug: "shirts", group: "clothing" },
  { name: "裙子", nameEn: "Dresses", slug: "dresses", group: "clothing" },
  // 鞋包
  { name: "鞋子", nameEn: "Shoes", slug: "shoes", group: "bagshoes" },
  { name: "包包", nameEn: "Bags", slug: "bags", group: "bagshoes" },
  // 配饰
  { name: "手表", nameEn: "Watches", slug: "watches", group: "accessories" },
  { name: "皮带", nameEn: "Belts", slug: "belts", group: "accessories" },
];

const shimmer = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAPEAXN3S4rY7hS0lLT0LHQx0bI2MZG0BrWta0I8qIq4u7nE4qIquf/2Q==";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { lang } = useLanguage();

  // 显示6个细分类小按钮
  const displaySubs = SUBCATEGORIES.slice(0, 6);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group"
    >
      <Link href={`/products/${product.id}`}>
        {/* Image container */}
        <div 
          className="relative overflow-hidden mb-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#F5F4F2] animate-pulse" />
          )}
          
          {/* Main Image */}
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={800}
            className={`w-full aspect-[3/4] object-cover transition-transform duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${isHovered ? "scale-105" : ""}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImageLoaded(true)}
            placeholder="blur"
            blurDataURL={shimmer}
          />

          {/* Hover Overlay with Category Bubbles */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                {/* Category Bubbles */}
                <div className="relative flex items-center justify-center">
                  {/* Center - View Now */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.05, type: "spring", stiffness: 200 }}
                    className="absolute w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg z-10"
                  >
                    <span className="text-xs font-medium text-center leading-tight text-[#1A1A1A]">
                      View<br/>Now
                    </span>
                  </motion.div>

                  {/* Surrounding bubbles */}
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const sub = displaySubs[i];
                    if (!sub) return null;
                    // 环形排列
                    const angle = (i * 60 - 30) * (Math.PI / 180);
                    const radius = 70;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <motion.div
                        key={sub.slug}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, x, y }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: 0.08 + i * 0.03, type: "spring", stiffness: 200 }}
                        className="absolute w-11 h-11 rounded-full bg-white/95 flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#C9A96E] hover:text-white transition-all text-[11px] font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = `/products?category=${sub.slug}`;
                        }}
                        title={lang === "zh" ? sub.name : sub.nameEn}
                      >
                        {lang === "zh" ? sub.name : sub.nameEn}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product info */}
        <div className="space-y-1">
          <span className="label text-[#A8A4A0]">{product.category}</span>
          <h3 className="font-display text-[1rem] font-light text-[#1A1A1A] leading-snug group-hover:text-[#C9A96E] transition-colors duration-300">
            {product.name}
          </h3>
          <span className="font-body text-[13px] text-[#8A8A8A]">{product.price}</span>
        </div>
      </Link>
    </motion.div>
  );
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Le Sac Nerveux",
    category: "Bag",
    price: "¥ 4,200",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  },
  {
    id: "2",
    name: "Silk Blouse",
    category: "Clothing",
    price: "¥ 2,800",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80",
  },
  {
    id: "3",
    name: "Calibre 01",
    category: "Watch",
    price: "¥ 18,500",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },
  {
    id: "4",
    name: "Tailored Trousers",
    category: "Pants",
    price: "¥ 3,200",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  },
];

export default function Objects({ products = defaultProducts, maxVisible = 4 }: ObjectsProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  const displayProducts = products.slice(0, maxVisible);

  return (
    <section className="bg-white py-[clamp(5rem,10vw,9rem)] px-8 md:px-16">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 18 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
      >
        <div>
          <span className="label text-[#8A8A8A] block mb-4">Curated Selection</span>
          <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A] leading-tight">
            The Objects
          </h2>
        </div>
        <Link
          href="/products"
          className="cta-link"
        >
          Shop All
          <svg width="20" height="1" viewBox="0 0 20 1" fill="none" aria-hidden="true">
            <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="#C9A96E" />
          </svg>
        </Link>
      </motion.div>

      {/* Product grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {displayProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}