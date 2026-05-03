"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

const WHATSAPP_NUMBER = "8618508036618";

const shimmer = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQIRAxEAPwBc3dLitjuFLSUtPQsdDHRsjYxkbQGta1rQjyoiri7ucTioiq5/2Q==";

const content: Record<string, { description: string; materials: string; inquiry: string; brand: string; back: string }> = {
  en: { description: "Description", materials: "Materials & Care", inquiry: "Make an Inquiry via WhatsApp", brand: "Brand", back: "Back to Collection" },
  zh: { description: "产品描述", materials: "材质与保养", inquiry: "通过WhatsApp咨询", brand: "品牌", back: "返回产品列表" },
  fr: { description: "Description", materials: "Matières & Entretien", inquiry: "Faire une demande via WhatsApp", brand: "Marque", back: "Retour à la collection" },
  it: { description: "Descrizione", materials: "Materiali & Cura", inquiry: "Fai una richiesta via WhatsApp", brand: "Marca", back: "Torna alla collezione" },
  de: { description: "Beschreibung", materials: "Materialien & Pflege", inquiry: "Anfrage über WhatsApp", brand: "Marke", back: "Zurück zur Kollektion" },
  es: { description: "Descripción", materials: "Materiales y cuidado", inquiry: "Consultar por WhatsApp", brand: "Marca", back: "Volver a la colección" },
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

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { lang } = useLanguage();
  const c = content[lang] || content.en;
  const isCn = lang === "zh";

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/products?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) setProduct(data);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) return <main className="bg-white min-h-screen"><Navigation /><div className="pt-32 flex justify-center"><div className="animate-spin h-8 w-8 border-2 border-[#C9A96E] border-t-transparent rounded-full" /></div></main>;
  if (!product) return <main className="bg-white min-h-screen"><Navigation /><div className="pt-32 text-center"><p className="text-2xl mb-4">Product not found</p><a href="/products" className="cta-link">Back to collection</a></div></main>;

  const allImages = [product.mainImage, ...(product.detailImages || product.images || [])].filter(Boolean);
  const displayName = isCn ? (product.nameCn || product.name) : product.name;
  const displayDesc = isCn ? (product.descriptionCn || product.description) : product.description;
  const whatsappMessage = encodeURIComponent(`Hello, I am interested in ${product.brand ? product.brand + " " : ""}${product.name}. Could you provide more information?`);

  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      <div className="pt-24 pb-6 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <a href="/products" className="font-body text-xs text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors">← {c.back}</a>
        </div>
      </div>

      <section className="px-8 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              {allImages.length > 0 ? (
                <>
                  <div className="aspect-[4/5] overflow-hidden bg-[#F5F4F2] relative">
                    <Image src={allImages[selectedImage]} alt={displayName} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" placeholder="blur" blurDataURL={shimmer} priority />
                  </div>
                  {allImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto">
                      {allImages.map((img, index) => (
                        <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-24 flex-shrink-0 overflow-hidden transition-all duration-200 ${selectedImage === index ? "ring-2 ring-[#C9A96E]" : "opacity-60 hover:opacity-100"}`}>
                          <Image src={img} alt="" width={80} height={96} className="w-full h-full object-cover" placeholder="blur" blurDataURL={shimmer} />
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
                {c.inquiry} →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
