"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "./LanguageContext";

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  brand: string;
  category: string;
  categoryName: string;
  categoryNameCn?: string;
  mainImage: string;
}

// Always fetch fresh data, pick 8 with brand diversity
export default function FeaturedProducts() {
  const { lang } = useLanguage();
  const isCn = lang === "zh";
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then((data: Product[]) => {
        if (!data || data.length === 0) { setLoaded(true); return; }
        // Brand diversity first, then fill
        const brands = [...new Set(data.map(p => p.brand).filter(Boolean))];
        const picked: Product[] = [];
        for (const brand of brands) {
          const bp = data.filter(p => p.brand === brand);
          if (bp.length > 0) picked.push(bp[Math.floor(Math.random() * bp.length)]);
          if (picked.length >= 8) break;
        }
        if (picked.length < 8) {
          const rem = data.filter(p => !picked.find(x => x.id === p.id));
          for (let i = 0; picked.length < 8 && i < rem.length; i++) picked.push(rem[i]);
        }
        setProducts(picked);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <section className="py-[clamp(5rem,10vw,9rem)] bg-white">
        <div className="px-8 md:px-16">
          <div className="text-center mb-14">
            <span className="label text-[#8A8A8A] block mb-3">{isCn ? "精选单品" : "Curated Selection"}</span>
            <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A]">
              {isCn ? "为您甄选" : "Selected for You"}
            </h2>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-[4/5] bg-[#F5F4F2] animate-pulse rounded" />
                <div className="h-3 w-16 bg-[#F5F4F2] animate-pulse rounded" />
                <div className="h-3 w-24 bg-[#F5F4F2] animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] bg-white">
      <div className="px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <span className="label text-[#8A8A8A] block mb-3">{isCn ? "精选单品" : "Curated Selection"}</span>
          <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A]">
            {isCn ? "为您甄选" : "Selected for You"}
          </h2>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link href={`/products/${product.id}`} className="group block">
                <div className="img-zoom overflow-hidden mb-3">
                  <Image
                    src={product.mainImage}
                    alt={product.name || ""}
                    width={400}
                    height={500}
                    className="w-full aspect-[4/5] object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                  />
                </div>
                {product.brand && (
                  <span className="text-[9px] tracking-widest uppercase text-[#C9A96E] block">{product.brand}</span>
                )}
                <h3 className="font-display text-sm font-light text-[#1A1A1A] group-hover:text-[#C9A96E] transition-colors line-clamp-1 mt-1">
                  {isCn ? (product.nameCn || product.name) : product.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/products" className="cta-link">
            {isCn ? "查看全部" : "View All"} &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}