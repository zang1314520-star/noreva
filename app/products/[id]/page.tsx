"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { useWishlist, useRecentlyViewed } from "@/lib/useWishlist";
import { useCart } from "@/context/CartContext";
import { SITE_NAME, SITE_URL, WHATSAPP_NUMBER } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const shimmer =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQIRAxEAPwBc3dLitjuFLSUtPQsdDHRsjYxkbQGta1rQjyoiri7ucTioiq5/2Q==";

type Copy = {
  description: string;
  materials: string;
  inquiry: string;
  back: string;
  related: string;
  share: string;
  notFound: string;
  highlights: string;
  techSpecs: string;
  available: string;
  byRequest: string;
  packFinder: string;
  packFinderText: string;
  delivery: string;
  deliveryText: string;
  returns: string;
  returnsText: string;
  addToBag: string;
  saved: string;
  save: string;
  linkCopied: string;
};

const content: Record<"en" | "zh", Copy> = {
  en: {
    description: "Description",
    materials: "Materials & Care",
    inquiry: "Make an Inquiry via WhatsApp",
    back: "Back to Collection",
    related: "You May Also Like",
    share: "Share",
    notFound: "Product not found",
    highlights: "Product Highlights",
    techSpecs: "Technical Specs",
    available: "Available to inquire",
    byRequest: "Available by request",
    packFinder: "Pack finder",
    packFinderText: "Capacity and laptop-fit support by WhatsApp.",
    delivery: "Worldwide delivery",
    deliveryText: "Shipping options confirmed before payment.",
    returns: "30-day returns",
    returnsText: "24-month warranty included.",
    addToBag: "Add to Bag",
    saved: "Saved",
    save: "Save",
    linkCopied: "Link copied!",
  },
  zh: {
    description: "产品描述",
    materials: "材质与保养",
    inquiry: "通过 WhatsApp 咨询",
    back: "返回产品列表",
    related: "你可能也喜欢",
    share: "分享",
    notFound: "未找到该产品",
    highlights: "核心亮点",
    techSpecs: "技术参数",
    available: "可咨询购买",
    byRequest: "支持预订咨询",
    packFinder: "背包推荐",
    packFinderText: "通过 WhatsApp 获取容量和电脑尺寸建议。",
    delivery: "全球配送",
    deliveryText: "下单前会确认发货地区与物流方案。",
    returns: "30 天退货",
    returnsText: "默认含 24 个月质保服务。",
    addToBag: "加入购物车",
    saved: "已收藏",
    save: "收藏",
    linkCopied: "链接已复制",
  },
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
  price?: number;
  currency?: string;
  materials?: string;
  highlights?: string[];
  techSpecs?: Record<string, string>;
  warranty?: string;
  mainImage: string;
  images?: string[];
  detailImages?: string[];
  specs?: Array<{ id: string; color: string; size: string; image?: string; stock: number }>;
}

function cdnThumb(url: string, width: number): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`);
}

function ImageWithZoom({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="relative">
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
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>

      {isHovering && (
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

function Lightbox({
  images,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev]
  );

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
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-10 transition-colors">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute top-6 left-6 text-white/50 text-sm font-body">
        {index + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="relative w-full h-full max-w-5xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
        <Image src={images[index]} alt="" fill className="object-contain" sizes="100vw" priority />
      </div>

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

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
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-[#F5F4F2] animate-pulse rounded" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-24 bg-[#F5F4F2] animate-pulse rounded flex-shrink-0" />
                ))}
              </div>
            </div>
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

function ProductJsonLd({ product, images }: { product: Product; images: string[] }) {
  const productUrl = `${SITE_URL}/products/${product.id}`;
  const totalStock = product.specs?.reduce((sum, spec) => sum + (Number(spec.stock) || 0), 0) ?? 0;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    category: product.categoryName || product.category,
    description: product.description,
    image: images.map((image) => (image.startsWith("http") ? image : `${SITE_URL}${image}`)),
    sku: product.id,
    url: productUrl,
    offers: product.price
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: product.currency || "USD",
          availability: totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
          url: productUrl,
          seller: { "@type": "Organization", name: SITE_NAME },
        }
      : undefined,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
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
  const isCn = lang === "zh";
  const c: Copy = isCn ? content.zh : content.en;

  useEffect(() => {
    params.then(({ id }) => {
      Promise.all([fetch(`/api/products?id=${id}`).then((r) => r.json()), fetch("/api/products").then((r) => r.json())]).then(([detail, all]) => {
        if (detail.id) {
          setProduct(detail);
          recentlyViewed.add(detail.id);
          trackEvent("view_product", {
            product_id: detail.id,
            brand: detail.brand,
            category: detail.category,
            value: detail.price || 0,
            currency: detail.currency || "USD",
          });
        }
        setAllProducts(all || []);
        setLoading(false);
      });
    });
  }, [params, recentlyViewed]);

  if (loading) return <DetailSkeleton />;

  if (!product) {
    return (
      <main className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-32 text-center">
          <p className="font-display text-2xl mb-4">{c.notFound}</p>
          <a href="/products" className="cta-link">
            {c.back}
          </a>
        </div>
      </main>
    );
  }

  const allImages = Array.from(new Set([product.mainImage, ...(product.detailImages || product.images || [])].filter(Boolean)));
  const displayName = isCn ? product.nameCn || product.name : product.name;
  const displayDesc = isCn ? product.descriptionCn || product.description : product.description;
  const displayCategory = isCn ? product.categoryNameCn || product.categoryName : product.categoryName;
  const totalStock = product.specs?.reduce((sum, spec) => sum + (Number(spec.stock) || 0), 0) ?? 0;
  const hasStock = totalStock > 0;
  const formattedPrice = product.price
    ? new Intl.NumberFormat(isCn ? "zh-CN" : "en-US", {
        style: "currency",
        currency: product.currency || "USD",
        maximumFractionDigits: 0,
      }).format(product.price)
    : null;

  const whatsappMessage = encodeURIComponent(
    isCn
      ? `您好，我对这款 ${product.brand ? `${product.brand} ` : ""}${product.nameCn || product.name} 很感兴趣，想了解更多信息。\n产品链接：${typeof window !== "undefined" ? window.location.href : ""}`
      : `Hello, I am interested in ${product.brand ? `${product.brand} ` : ""}${product.name}. Could you provide more information?\nProduct: ${typeof window !== "undefined" ? window.location.href : ""}`
  );

  const related = allProducts
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aScore = (a.brand === product.brand ? 2 : 0) + (a.category === product.category ? 1 : 0);
      const bScore = (b.brand === product.brand ? 2 : 0) + (b.category === product.category ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, 6);

  return (
    <main className="bg-white min-h-screen">
      <ProductJsonLd product={product} images={allImages} />
      <Navigation />

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
          <a href="/products" className="font-body text-xs text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors">
            &larr; {c.back}
          </a>
        </div>
      </div>

      <section className="px-8 md:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-4">
              {allImages.length > 0 ? (
                <>
                  <ImageWithZoom src={allImages[selectedImage]} alt={displayName} onClick={() => setLightboxOpen(true)} />
                  {allImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {allImages.map((img, index) => (
                        <button
                          key={`${img}-${index}`}
                          onClick={() => setSelectedImage(index)}
                          className={`w-20 h-24 flex-shrink-0 overflow-hidden transition-all duration-200 ${selectedImage === index ? "ring-2 ring-[#C9A96E]" : "opacity-60 hover:opacity-100"}`}
                        >
                          <Image src={cdnThumb(img, 160)} alt="" width={80} height={96} className="w-full h-full object-cover" placeholder="blur" blurDataURL={shimmer} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/5] bg-[#F5F4F2] flex items-center justify-center">
                  <svg className="w-20 h-20 text-[#E8E6E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="lg:pt-8">
              <div className="mb-8">
                {product.brand && <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A96E] block mb-3">{product.brand}</span>}
                <span className="label text-[#A8A4A0] block mb-3">{displayCategory}</span>
                <h1 className="font-display text-3xl md:text-4xl font-light text-[#1A1A1A] mb-2">{displayName}</h1>
                {product.nameCn && product.name && isCn && <p className="font-body text-sm text-[#A8A4A0] mb-4">{product.name}</p>}
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  {formattedPrice ? <p className="font-body text-xl text-[#1A1A1A]">{formattedPrice}</p> : null}
                  <span className={`font-body text-xs tracking-[0.12em] uppercase ${hasStock ? "text-[#5F7A52]" : "text-[#C9A96E]"}`}>{hasStock ? c.available : c.byRequest}</span>
                </div>
              </div>

              <div className="mb-10">
                <span className="gold-rule mb-6 block" />
                <h3 className="label text-[#8A8A8A] mb-4">{c.description}</h3>
                <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9] whitespace-pre-line">{displayDesc}</p>
              </div>

              {product.highlights?.length ? (
                <div className="mb-10">
                  <h3 className="label text-[#8A8A8A] mb-4">{c.highlights}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.highlights.map((item) => (
                      <div key={item} className="bg-[#F7F5F1] px-4 py-3">
                        <p className="font-body text-[12px] uppercase tracking-[0.12em] text-[#1A1A1A]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.techSpecs ? (
                <div className="mb-10">
                  <h3 className="label text-[#8A8A8A] mb-4">{c.techSpecs}</h3>
                  <div className="divide-y divide-[#E8E6E2] border-y border-[#E8E6E2]">
                    {Object.entries(product.techSpecs).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between gap-6 py-3">
                        <span className="font-body text-[13px] text-[#8A8A8A]">{key}</span>
                        <span className="font-body text-[13px] text-[#1A1A1A] text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.materials ? (
                <div className="mb-10">
                  <h3 className="label text-[#8A8A8A] mb-4">{c.materials}</h3>
                  <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9]">{product.materials}</p>
                </div>
              ) : null}

              <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 border-y border-[#E8E6E2] py-5">
                <div>
                  <p className="label text-[#1A1A1A] mb-1">{c.packFinder}</p>
                  <p className="font-body text-xs leading-[1.7] text-[#8A8A8A]">{c.packFinderText}</p>
                </div>
                <div>
                  <p className="label text-[#1A1A1A] mb-1">{c.delivery}</p>
                  <p className="font-body text-xs leading-[1.7] text-[#8A8A8A]">{c.deliveryText}</p>
                </div>
                <div>
                  <p className="label text-[#1A1A1A] mb-1">{c.returns}</p>
                  <p className="font-body text-xs leading-[1.7] text-[#8A8A8A]">{product.warranty || c.returnsText}</p>
                </div>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_product_inquiry", { product_id: product.id, brand: product.brand, category: product.category })}
                className="block w-full bg-[#1A1A1A] text-white text-center py-4 font-body text-[11px] tracking-[0.22em] uppercase hover:bg-[#C9A96E] transition-colors duration-300"
              >
                {c.inquiry} &rarr;
              </a>

              <button
                onClick={() => {
                  cart.addItem({
                    id: product.id,
                    name: displayName,
                    brand: product.brand || "",
                    price: product.price || 0,
                    currency: product.currency || "USD",
                    image: product.mainImage || "",
                  });
                  trackEvent("add_to_bag", {
                    product_id: product.id,
                    brand: product.brand,
                    value: product.price || 0,
                    currency: product.currency || "USD",
                  });
                }}
                className="mt-3 block w-full bg-[#C9A96E] text-white text-center py-4 font-body text-[11px] tracking-[0.22em] uppercase hover:bg-amber-700 transition-colors duration-300"
              >
                <ShoppingBag className="w-4 h-4 inline-block mr-2" />
                {c.addToBag}
              </button>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => wishlist.toggle(product.id)}
                  className={`flex items-center justify-center gap-2 py-3 border transition-colors font-body text-[11px] tracking-[0.15em] uppercase ${
                    wishlist.has(product.id) ? "border-[#C9A96E] text-[#C9A96E]" : "border-[#E8E6E2] text-[#8A8A8A] hover:text-[#1A1A1A] hover:border-[#1A1A1A]"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={wishlist.has(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {wishlist.has(product.id) ? c.saved : c.save}
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: displayName, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert(c.linkCopied);
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 border border-[#E8E6E2] text-[#8A8A8A] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors font-body text-[11px] tracking-[0.15em] uppercase"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {c.share}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                      <Image src={cdnThumb(p.mainImage, 400)} alt={p.name || ""} width={300} height={375} className="w-full aspect-[4/5] object-cover" sizes="(max-width: 768px) 50vw, 16vw" />
                    ) : (
                      <div className="w-full aspect-[4/5] bg-[#F5F4F2] flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#E8E6E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {p.brand && <span className="text-[9px] tracking-widest uppercase text-[#C9A96E] block">{p.brand}</span>}
                  <h3 className="font-display text-xs font-light text-[#1A1A1A] group-hover:text-[#C9A96E] transition-colors line-clamp-2 mt-1">{isCn ? p.nameCn || p.name : p.name}</h3>
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
