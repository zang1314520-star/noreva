"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  category: string;
  categoryName: string;
  price: number;
  description: string;
  mainImage: string;
}

interface ProductVignette {
  id: string;
  name: string;
  tagline: string;
  category: string;
  bg: string;
  image?: string;
}

const WHATSAPP_NUMBER = "8618508036618";

function FeaturedProduct({ product, index }: { product: ProductVignette; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={"/products/" + product.id} className="block group">
        <div className="img-zoom overflow-hidden mb-5 aspect-square bg-[#F0EFED]">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
            />
          ) : (
            <div 
              className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ background: product.bg }}
            />
          )}
        </div>
        <div>
          <span className="label text-[#A8A4A0] block mb-2">{product.category}</span>
          <h3 className="font-display font-light text-[#1A1A1A] mb-1 leading-tight" style={{ fontSize: "18px" }}>
            {product.name}
          </h3>
          <p className="font-body text-[12px] text-[#8A8A8A] mb-4 leading-relaxed line-clamp-2">
            {product.tagline}
          </p>
          <span className="cta-link text-xs">
            View Details
            <svg width="16" height="1" viewBox="0 0 20 1" fill="none" aria-hidden="true">
              <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="#C9A96E" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProductVignettes() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [products, setProducts] = useState<ProductVignette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const featured = data.slice(0, 4).map((p: Product) => ({
            id: p.id,
            name: p.name,
            tagline: p.description || "",
            category: p.categoryName || p.category,
            bg: "linear-gradient(135deg, #E8E6E2 0%, #D8D6D2 100%)",
            image: p.mainImage,
          }));
          setProducts(featured);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const defaultProducts: ProductVignette[] = [
    { id: "1", name: "Le Sac Nerveux", tagline: "The everyday carry.", category: "Bags", bg: "linear-gradient(135deg, #D8D0C4 0%, #C8BFB1 100%)" },
    { id: "2", name: "Calibre 01", tagline: "Time, reconsidered.", category: "Watches", bg: "linear-gradient(135deg, #C8C4BC 0%, #B8B4AC 100%)" },
    { id: "3", name: "La Marche", tagline: "Crafted in Florence.", category: "Shoes", bg: "linear-gradient(135deg, #D0C8BC 0%, #C0B8AC 100%)" },
    { id: "4", name: "L'Anneau", tagline: "A single, quiet statement.", category: "Accessories", bg: "linear-gradient(135deg, #D4CEC8 0%, #C4BEB8 100%)" },
  ];

  const displayProducts = loading ? defaultProducts : (products.length > 0 ? products : defaultProducts);

  return (
    <section ref={ref} className="py-[clamp(5rem,10vw,9rem)] overflow-hidden bg-white">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="px-8 md:px-16 mb-14 md:mb-18 relative"
      >
        <div className="absolute -top-8 left-8 md:left-16 font-display font-light text-[#1A1A1A]/[0.04] leading-none select-none pointer-events-none" style={{ fontSize: "clamp(7rem, 14vw, 13rem)" }} aria-hidden="true">
          02
        </div>
        <div className="relative flex items-end justify-between">
          <div>
            <span className="label text-[#8A8A8A] block mb-5">The Objects</span>
            <span className="gold-rule" />
          </div>
          <Link href="/products" className="hidden md:block font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors tracking-wider uppercase pb-1">
            View All
          </Link>
        </div>
      </motion.div>

      <div className="px-8 md:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {displayProducts.map((p, i) => (
            <FeaturedProduct key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>

      <div className="md:hidden px-8 mt-8 text-center">
        <Link href="/products" className="font-body text-[13px] text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors tracking-wider uppercase">
          View All Products
        </Link>
      </div>
    </section>
  );
}
