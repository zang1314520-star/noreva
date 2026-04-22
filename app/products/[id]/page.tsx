"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

const WHATSAPP_NUMBER = "8618508036618";

const shimmer = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDAwUAAAAAAAAAAAAAAQACAwQFEQYSIQcTMUGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAPEAXN3S4rY7hS0lLT0LHQx0bI2MZG0BrWta0I8qIq4u7nE4qIquf/2Q==";

const content = {
  en: { description: "Description", materials: "Materials & Care", inquiry: "Make an Inquiry" },
  zh: { description: "描述", materials: "材质与保养", inquiry: "咨询" },
  fr: { description: "Description", materials: "Matières & Entretien", inquiry: "Faire une demande" },
  it: { description: "Descrizione", materials: "Materiali & Cura", inquiry: "Fai una richiesta" },
  de: { description: "Beschreibung", materials: "Materialien & Pflege", inquiry: "Anfrage stellen" },
  es: { description: "Descripción", materials: "Materiales y cuidado", inquiry: "Hacer una consulta" },
};

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  category: string;
  categoryName: string;
  price: number;
  currency: string;
  description: string;
  materials?: string;
  mainImage: string;
  images?: string[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

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

  if (loading) return <main className="bg-white min-h-screen"><Navigation /><div className="pt-32 flex justify-center"><p className="text-[#8A8A8A]">Loading...</p></div></main>;
  if (!product) return <main className="bg-white min-h-screen"><Navigation /><div className="pt-32 text-center"><p className="text-2xl mb-4">Product not found</p><a href="/products" className="cta-link">Back to collection</a></div></main>;

  const allImages = [product.mainImage, ...(product.images || [])];
  const whatsappMessage = encodeURIComponent(`Hello, I am interested in ${product.name}. Could you provide more information?`);

  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-6 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <a href="/products" className="font-body text-xs text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors">← Back to Collection</a>
        </div>
      </div>

      <section className="px-8 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/5] overflow-hidden bg-[#F5F4F2] relative">
                <Image src={allImages[selectedImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" placeholder="blur" blurDataURL={shimmer} priority />
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
            </div>

            {/* Product Info */}
            <div className="lg:pt-8">
              <div className="mb-8">
                <span className="label text-[#A8A4A0] block mb-3">{product.categoryName}</span>
                <h1 className="font-display text-3xl md:text-4xl font-light text-[#1A1A1A] mb-2">{product.name}</h1>
                {product.nameCn && <p className="font-body text-lg text-[#8A8A8A] mb-4">{product.nameCn}</p>}
                <p className="font-display text-2xl text-[#C9A96E]">€{product.price.toLocaleString()}</p>
              </div>

              <div className="mb-10">
                <span className="gold-rule mb-6 block" />
                <h3 className="label text-[#8A8A8A] mb-4">{c.description}</h3>
                <p className="font-body text-[15px] text-[#8A8A8A] leading-[1.9]">{product.description}</p>
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
