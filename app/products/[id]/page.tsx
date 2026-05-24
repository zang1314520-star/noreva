"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from 'lucide-react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { useWishlist, useRecentlyViewed } from "@/lib/useWishlist";
import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "8618508036618";

const shimmer = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQIRAxEAPwBc3dLitjuFLSUtPQsdDHRsjYxkbQGta1rQjyoiri7ucTioiq5/2Q==";

const content: Record<string, { description: string; materials: string; inquiry: string; brand: string; back: string; related: string; share: string }> = {
  en: { description: "Description", materials: "Materials & Care", inquiry: "Make an Inquiry via WhatsApp", brand: "Brand", back: "Back to Collection", related: "You May Also Like", share: "Share" },
  zh: { description: "产品描述", materials: "材质与保养", inquiry: "通过WhatsApp咨询", brand: "品牌", back: "返回产品列表", related: "猜你喜欢", share: "分享" },
  fr: { description: "Description", materials: "Matières & Entretien", inquiry: "Faire une demande via WhatsApp", brand: "Marque", back: "Retour à la collection", related: "Vous aimerez aussi", share: "Partager" },
  it: { description: "Descrizione", materials: "Materiali & Cura", inquiry: "Fai una richiesta via WhatsApp", brand: "Marca", back: "Torna alla collezione", related: "Potrebbe piacerti anche", share: "Condividi" },
  de: { description: "Beschreibung", materials: "Materialien & Pflege", inquiry: "Anfrage über WhatsApp", brand: "Marke", back: "Zurück zur Kollektion", related: "Das könnte Ihnen auch gefallen", share: "Teilen" },
  es: { description: "Descripción", materials: "Materiales y cuidado", inquiry: "Consultar por WhatsApp", brand: "Marca", back: "Volver a la colección", related: "También te puede gustar", share: "Compartir" },
};

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  brand: string;
  category: string;
  categoryName: string;
  categoryNameCn?: string;
  description: string;
  descriptionCn?: string;
  materials?: string;
  mainImage: string;
  images?: string[];
  detailImages?: string[];
}

// Cloudinary optimized URL helper
function cdnThumb(url: string, w: number): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${w},c_limit,q_auto,f_auto/`);
}

// ========== Image Zoom Component ==========
function ImageWithZoom({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
    setContainerSize({ w: rect.width, h: rect.height });
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div
        ref={containerRef}
        className="aspect-[4/5] overflow-hidden bg-[#F5F4F2] relative cursor-crosshair"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onClick={onClick}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL={shimmer}
          priority
        />
        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
        </div>
      </div>

      {/* Zoom Panel - appears to the right on hover */}
      {isHovering && containerSize.w > 0 && (
        <div className="hidden lg:block absolute left-full top-0 ml-6 w-[400px] h-[500px] bg-white border border-[#E8E6E2] shadow-xl overflow-hidden pointer-events-none z-10">
          <div
            className="w-full h-full bg-no-repeat"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundSize: "250%",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ========== Lightbox Component ==========
function Lightbox({ images, index, onClose, onNext, onPrev }: {
  images: string[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") onNext();
    if (e.key === "ArrowLeft") onPrev();
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? onNext() : onPrev();
    }
    touchRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Close button */}
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-10 transition-colors">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-6 text-white/50 text-sm font-body">
        {index + 1} / {images.length}
      </div>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}

      {/* Image */}
      <div className="relative w-full h-full max-w-5xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[index]}
          alt=""
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
        </button>
      )}
    </div>
  );
}

// ========== Skeleton Loading ==========
function DetailSkeleton() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <div className="pt-24 pb-6 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      <section className="px-8 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-[#F5F4F2] animate-pulse rounded" />
              <div className="flex gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-20 h-24 bg-[#F5F4F2] animate-pulse rounded flex-shrink-0" />
                ))}
              </div>
            </div>
            {/* Info skeleton */}
            <div className="lg:pt-8 space-y-6">
              <div className="space-y-3">
                <div className="h-3 w-24 bg-[#F5F4F2] animate-pulse rounded" />
                <div className="h-3 w-16 bg-[#F5F4F2] animate-pulse rounded" />
                <div className="h-8 w-3/4 bg-[#F5F4F2] animate-pulse rounded" />
              </div>
              <div className="h-[1px] w-12 bg-[#E8E6E2]" />
              <div className="space-y-2">
                <div className="h-3 w-20 bg-[#F5F4F2] animate-pulse rounded" />
                <div className="h-3 w-full bg-[#F5F4F2] animate-pulse rounded" />
                <div className="h-3 w-full bg-[#F5F4F2] animate-pulse rounded" />
                <div className="h-3 w-2/3 bg-[#F5F4F2] animate-pulse rounded" />
              </div>
              <div className="h-14 w-full bg-[#F5F4F2] animate-pulse rounded" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const wishlist = useWishlist();
  const cart = useCart();
  const recentlyViewed = useRecentlyViewed();
  const { lang } = useLanguage();
  const c = content[lang] || content.en;
  const isCn = lang === "zh";

  useEffect(() => {
    params.then(({ id }) => {
      Promise.all([
        fetch(`/api/products?id=${id}`).then(r => r.json()),
        fetch("/api/products").then(r => r.json()),
      ]).then(([detail, all]) => {
        if (detail.id) {
          setProduct(detail);
          recentlyViewed.add(detail.id);
        }
        setAllProducts(all || []);
        setLoading(false);
      });
    });
  }, [params]);

  if (loading) return <DetailSkeleton />;
  if (!product) return <main className="bg-white min-h-screen"><Navigation /><div className="pt-32 text-center"><p className="font-display text-2xl mb-4">{isCn ? "产品未找到" : "Product not found"}</p><a href="/products" className="cta-link">{c.back}</a></div></main>;

  const allImages = [product.mainImage, ...(product.detailImages || product.images || [])].filter(Boolean);
  const displayName = isCn ? (product.nameCn || product.name) : product.name;
  const displayDesc = isCn ? (product.descriptionCn || product.description) : product.description;
  const whatsappMessage = encodeURIComponent(
    isCn
      ? `您好，我对这款 ${product.brand ? product.brand + " " : ""}${product.nameCn || product.name} 感兴趣，请问可以提供更多信息吗？\n商品链接：${typeof window !== "undefined" ? window.location.href : ""}`
      : `Hello, I am interested in ${product.brand ? product.brand + " " : ""}${product.name}. Could you provide more information?\nProduct: ${typeof window !== "undefined" ? window.location.href : ""}`
  );

  // Related products: same brand first, then same category, exclude current, limit 6
  const related = allProducts
    .filter(p => p.id !== product.id)
    .sort((a, b) => {
      const aScore = (a.brand === product.brand ? 2 : 0) + (a.category === product.category ? 1 : 0);
      const bScore = (b.brand === product.brand ? 2 : 0) + (b.category === product.category ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, 6);

  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <Lightbox
          images={allImages}
          index={selectedImage}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setSelectedImage((selectedImage + 1) % allImages.length)}
          onPrev={() => setSelectedImage((selectedImage - 1 + allImages.length) % allImages.length)}
        />
      )}

      <div className="pt-24 pb-6 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <a href="/products" className="font-body text-xs text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors">&larr; {c.back}</a>
        </div>
      </div>

      <section className="px-8 md:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              {allImages.length > 0 ? (
                <>
                  <ImageWithZoom src={allImages[selectedImage]} alt={displayName} onClick={() => setLightboxOpen(true)} />
                  {allImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {allImages.map((img, index) => (
                        <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-24 flex-shrink-0 overflow-hidden transition-all duration-200 ${selectedImage === index ? "ring-2 ring-[#C9A96E]" : "opacity-60 hover:opacity-100"}`}>
                          <Image src={cdnThumb(img, 160)} alt="" width={80} height={96} className="w-full h-full object-cover" placeholder="blur" blurDataURL={shimmer} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/5] bg-[#F5F4F2] flex items-center justify-center">
                  <svg className="w-20 h-20 text-[#E8E6E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:pt-8">
              <div className="mb-8">
                {product.brand && (
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A96E] block mb-3">{product.brand}</span>
                )}
                <span className="label text-[#A8A4A0] block mb-3">
                  {isCn ? (product.categoryNameCn || product.categoryName) : product.categoryName}
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-light text-[#1A1A1A] mb-2">{displayName}</h1>
                {product.nameCn && product.name && isCn && (
                  <p className="font-body text-sm text-[#A8A4A0] mb-4">{product.name}</p>
                )}
              </div>

              <div className="mb-10">
                <span className="gold-rule mb-6 block" />
                <h3 className="label text-[#8A8A8A] mb-4">{c.description}</h3>
                <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9] whitespace-pre-line">{displayDesc}</p>
              </div>

              {product.materials && (
                <div className="mb-10">
                  <h3 className="label text-[#8A8A8A] mb-4">{c.materials}</h3>
                  <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9]">{product.materials}</p>
                </div>
              )}

              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#1A1A1A] text-white text-center py-4 font-body text-[11px] tracking-[0.22em] uppercase hover:bg-[#C9A96E] transition-colors duration-300">
                {c.inquiry} &rarr;
              </a>

              {/* Add to Cart */}
              <button
                onClick={() => {
                  if (!product) return;
                  cart.addItem({
                    id: product.id,
                    name: isCn ? (product.nameCn || product.name) : product.name,
                    brand: product.brand || "",
                    price: product.price || 0,
                    currency: product.currency || "EUR",
                    image: product.mainImage || "",
                  });
                }}
                className="mt-3 block w-full bg-[#C9A96E] text-white text-center py-4 font-body text-[11px] tracking-[0.22em] uppercase hover:bg-amber-700 transition-colors duration-300"
              >
                <ShoppingBag className="w-4 h-4 inline-block mr-2" />
                {isCn ? "加入购物车" : "Add to Bag"}
              </button>

              {/* Wishlist + Share row */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => product && wishlist.toggle(product.id)}
                  className={`flex items-center justify-center gap-2 py-3 border transition-colors font-body text-[11px] tracking-[0.15em] uppercase ${
                    product && wishlist.has(product.id)
                      ? "border-[#C9A96E] text-[#C9A96E]"
                      : "border-[#E8E6E2] text-[#8A8A8A] hover:text-[#1A1A1A] hover:border-[#1A1A1A]"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={product && wishlist.has(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {product && wishlist.has(product.id) ? (isCn ? "已收藏" : "Saved") : (isCn ? "收藏" : "Save")}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: displayName, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert(isCn ? "链接已复制" : "Link copied!");
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 border border-[#E8E6E2] text-[#8A8A8A] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors font-body text-[11px] tracking-[0.15em] uppercase"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  {c.share}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="px-8 md:px-16 pb-24 border-t border-[#E8E6E2]">
          <div className="max-w-7xl mx-auto pt-16">
            <h2 className="font-display text-2xl font-light text-[#1A1A1A] mb-2 text-center">{c.related}</h2>
            <span className="gold-rule mx-auto mb-10 block" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="group block">
                  <div className="img-zoom overflow-hidden mb-3">
                    {p.mainImage ? (
                      <Image
                        src={cdnThumb(p.mainImage, 400)}
                        alt={p.name || ""}
                        width={300}
                        height={375}
                        className="w-full aspect-[4/5] object-cover"
                        sizes="(max-width: 768px) 50vw, 16vw"
                      />
                    ) : (
                      <div className="w-full aspect-[4/5] bg-[#F5F4F2] flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#E8E6E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  {p.brand && (
                    <span className="text-[9px] tracking-widest uppercase text-[#C9A96E] block">{p.brand}</span>
                  )}
                  <h3 className="font-display text-xs font-light text-[#1A1A1A] group-hover:text-[#C9A96E] transition-colors line-clamp-2 mt-1">
                    {isCn ? (p.nameCn || p.name) : p.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
