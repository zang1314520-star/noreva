"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
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

function cdnThumb(url: string, w: number): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${w},c_limit,q_auto,f_auto/`);
}

export default function FeaturedProducts() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const { lang } = useLanguage();
  const isCn = lang === "zh";
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then((data: Product[]) => {
        if (!data || data.length === 0) return;
        // Pick 8 products: try to get a mix of brands
        const brands = [...new Set(data.map(p => p.brand).filter(Boolean))];
        const picked: Product[] = [];
        for (const brand of brands) {
          const brandProducts = data.filter(p => p.brand === brand && p.mainImage);
          if (brandProducts.length > 0) {
            picked.push(brandProducts[Math.floor(Math.random() * brandProducts.length)]);
          }
          if (picked.length >= 8) break;
        }
        // Fill remaining slots
        if (picked.length < 8) {
          const remaining = data.filter(p => p.mainImage && !picked.find(x => x.id === p.id));
          for (let i = 0; picked.length < 8 && i < remaining.length; i++) {
            picked.push(remaining[i]);
          }
        }
        setProducts(picked);
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section ref={ref} className="py-[clamp(5rem,10vw,9rem)] bg-white">
      <div className="px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
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
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link href={`/products/${product.id}`} className="group block">
                <div className="img-zoom overflow-hidden mb-3">
                  <Image
                    src={cdnThumb(product.mainImage, 400)}
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
          animate={inView ? { opacity: 1 } : {}}
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
