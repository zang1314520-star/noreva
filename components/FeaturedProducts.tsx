"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  price?: number;
  currency?: string;
  featured?: boolean;
  highlights?: string[];
}

function cdnThumb(url: string, w: number): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${w},c_limit,q_auto,f_auto/`);
}

export default function FeaturedProducts() {
  const { lang } = useLanguage();
  const isCn = lang === "zh";
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Product[]) => {
        const backpacks = (data || []).filter((item) => item.category === "backpacks");
        const featured = backpacks
          .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
          .slice(0, 4);
        setProducts(featured);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <section className="py-[clamp(5rem,10vw,9rem)] bg-white">
        <div className="px-8 md:px-16">
          <div className="text-center mb-14">
            <span className="label text-[#8A8A8A] block mb-3">Featured Backpacks</span>
            <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A]">
              Built for real movement
            </h2>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
          <span className="label text-[#8A8A8A] block mb-3">
            {isCn ? "精选背包" : "Featured Backpacks"}
          </span>
          <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light text-[#1A1A1A]">
            {isCn ? "为真实移动生活打造" : "Built for real movement"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-[13px] leading-[1.8] text-[#8A8A8A]">
            {isCn
              ? "从通勤、商务到短途旅行，按场景选择更省时间。"
              : "Choose by commute, business, travel, and weather-ready carry needs."}
          </p>
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
                <div className="img-zoom overflow-hidden mb-3 rounded-[18px] bg-[#F7F5F1]">
                  <Image
                    src={cdnThumb(product.mainImage, 520)}
                    alt={product.name || ""}
                    width={520}
                    height={650}
                    className="w-full aspect-[4/5] object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                  />
                </div>
                {product.brand && (
                  <span className="text-[9px] tracking-widest uppercase text-[#C9A96E] block">{product.brand}</span>
                )}
                <h3 className="font-display text-sm font-light text-[#1A1A1A] group-hover:text-[#C9A96E] transition-colors line-clamp-1 mt-1">
                  {isCn ? product.nameCn || product.name : product.name}
                </h3>
                {product.highlights?.[0] ? (
                  <p className="mt-2 font-body text-[11px] uppercase tracking-[0.12em] text-[#8A8A8A]">
                    {product.highlights[0]}
                  </p>
                ) : null}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/products" className="cta-link">
            {isCn ? "查看全部背包" : "View All Backpacks"} &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
