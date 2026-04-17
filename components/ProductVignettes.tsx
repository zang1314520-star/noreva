"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  { key: "clothing", nameEn: "Clothing", image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80", subcategories: [
    { nameEn: "T-Shirts", slug: "tshirts", brands: ["Louis Vuitton", "Dior", "Gucci", "Balenciaga"] },
    { nameEn: "Outerwear", slug: "outerwear", brands: ["Burberry", "Prada", "Versace"] },
    { nameEn: "Pants", slug: "pants", brands: ["Armani", "D&G", "Valentino"] },
    { nameEn: "Hoodies", slug: "hoodies", brands: ["Off-White", "Palm Angels"] },
    { nameEn: "Shirts", slug: "shirts", brands: ["Armani", "Zegna", "Cucinelli"] },
    { nameEn: "Dresses", slug: "dresses", brands: ["Valentino", "Chanel", "Dior"] },
  ]},
  { key: "shoesbags", nameEn: "Shoes & Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", subcategories: [
    { nameEn: "Sneakers", slug: "sneakers", brands: ["Nike", "Adidas", "NB", "Asics"] },
    { nameEn: "Loafers", slug: "loafers", brands: ["Gucci", "Tods", "Berluti"] },
    { nameEn: "Handbags", slug: "handbags", brands: ["Hermes", "Chanel", "LV", "Dior"] },
    { nameEn: "Backpacks", slug: "backpacks", brands: ["MCM", "LV", "Prada"] },
    { nameEn: "Boots", slug: "boots", brands: ["YSL", "Jimmy Choo", "Bottega"] },
    { nameEn: "Clutches", slug: "clutches", brands: ["Judith Leiber", "Gucci"] },
  ]},
  { key: "accessories", nameEn: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", subcategories: [
    { nameEn: "Watches", slug: "watches", brands: ["Rolex", "Omega", "Patek Philippe", "AP"] },
    { nameEn: "Belts", slug: "belts", brands: ["Gucci", "LV", "Hermes"] },
    { nameEn: "Sunglasses", slug: "sunglasses", brands: ["Ray-Ban", "Oakley", "Persol"] },
    { nameEn: "Jewelry", slug: "jewelry", brands: ["Cartier", "Bulgari", "VCA"] },
  ]},
];

const shimmer = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAPEAXN3S4rY7hS0lLT0LHQx0bI2MZG0BrWta0I8qIq4u7nE4qIquf/2Q==";

function BrandBubble({ name, index }: { name: string; index: number }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
      whileHover={{ scale: 1.1 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/products?brand=${encodeURIComponent(name.toLowerCase().replace(/[^a-z0-9]/g, "-"))}`;
      }}
      className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white/95 shadow-lg flex items-center justify-center text-[9px] md:text-[10px] lg:text-[11px] font-medium text-[#1A1A1A] hover:bg-[#C9A96E] hover:text-white transition-colors duration-300 px-1"
    >
      {name}
    </motion.button>
  );
}

function CategoryCard({ category, index }: { category: typeof CATEGORIES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeSub, setActiveSub] = useState<typeof category.subcategories[0] | null>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveSub(null); }}
    >
      <Link href={`/products?group=${category.key}`}>
        <div className="relative overflow-hidden mb-4 aspect-[3/4]">
          {!imageLoaded && <div className="absolute inset-0 bg-[#F5F4F2] animate-pulse" />}
          <Image
            src={category.image}
            alt={category.nameEn}
            fill
            className={`object-cover transition-transform duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"} ${isHovered ? "scale-105" : ""}`}
            sizes="(max-width: 768px) 50vw, 33vw"
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
                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4"
              >
                <motion.h3 initial={{ y: 20 }} animate={{ y: 0 }} className="font-display text-xl md:text-2xl text-white mb-3 text-center">
                  {category.nameEn}
                </motion.h3>
                <AnimatePresence mode="wait">
                  {activeSub ? (
                    <motion.div key="brands" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center gap-3">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveSub(null); }} className="text-white/70 hover:text-white text-xs underline">
                        Back
                      </button>
                      <div className="flex flex-wrap justify-center gap-2">
                        {activeSub.brands.map((brand, i) => <BrandBubble key={brand} name={brand} index={i} />)}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="subs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap justify-center gap-2 max-w-[240px]">
{category.subcategories.map((sub) => (                        <button key={sub.slug} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveSub(sub); }} className="px-3 py-1.5 bg-white/95 rounded-full text-xs text-[#1A1A1A] hover:bg-[#C9A96E] hover:text-white transition-colors">{sub.nameEn}</button>))}                    </motion.div>                  )}                </AnimatePresence>              </motion.div>            )}          </AnimatePresence>        </div>        <div className="text-center">          <h3 className="font-display text-lg font-light text-[#1A1A1A] group-hover:text-[#C9A96E] transition-colors duration-300">{category.nameEn}</h3>        </div>      </Link>    </motion.div>  );} export default function ProductVignettes() { const ref = useRef<HTMLElement>(null); const inView = useInView(ref, { once: true, margin: "-10%" }); return (    <section ref={ref} className="py-[clamp(5rem,10vw,9rem)] overflow-hidden bg-white">      <div className="px-8 md:px-16">        <motion.div initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} className="text-center mb-14">          <span className="label text-[#8A8A8A] block mb-3">Collection</span>          <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A]">The Objects</h2>        </motion.div>        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">{CATEGORIES.map((category, index) => (          <CategoryCard key={category.key} category={category} index={index} />        ))}</div>      </div>    </section>  ); }