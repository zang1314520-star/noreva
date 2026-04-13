"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface ProductSpec {
  id: string;
  color: string;
  size: string;
  image: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  category: string;
  categoryName: string;
  price: number;
  currency: string;
  description: string;
  descriptionCn?: string;
  mainImage: string;
  specs: ProductSpec[];
  detailImages: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [displayImage, setDisplayImage] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("8618508036618");

  useEffect(() => {
    fetch("/api/config").then((res) => res.json()).then((data) => {
      setWhatsappNumber(data.whatsapp?.number || "8618508036618");
    });

    fetch("/api/products").then((res) => res.json()).then((data) => {
      const found = data.find((p: Product) => p.id === params.id);
      setProduct(found || null);
      if (found) {
        setDisplayImage(found.mainImage || "");
        if (found.specs?.length > 0) {
          const firstSpec = found.specs[0];
          setSelectedColor(firstSpec.color);
          setSelectedSize(firstSpec.size);
        }
      }
      setLoading(false);
    });
  }, [params.id]);

  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const spec = product.specs?.find(s => s.color === selectedColor && s.size === selectedSize);
      if (spec?.image) {
        setDisplayImage(spec.image);
      } else {
        setDisplayImage(product.mainImage || "");
      }
    }
  }, [selectedColor, selectedSize, product]);

  const handleInquire = () => {
    if (!product) return;
    let message = "I am interested in " + product.name + " by NOREVA. Price: EUR" + product.price;
    if (selectedColor || selectedSize) {
      message += "\nOption: " + selectedColor + " " + selectedSize;
    }
    window.open("https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message), "_blank");
  };

  if (loading) {
    return (
      <main className="relative bg-[#FAFAFA] min-h-screen">
        <Navigation />
        <div className="pt-32 flex items-center justify-center min-h-[60vh]">
          <p className="font-body text-[#8A8A8A]">Loading...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="relative bg-[#FAFAFA] min-h-screen">
        <Navigation />
        <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="font-body text-[#8A8A8A] mb-4">Product not found</p>
          <Link href="/products" className="text-[#C9A96E] hover:underline">Back to Products</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const colors = [...new Set(product.specs?.map(s => s.color) || [])];
  const sizes = [...new Set(product.specs?.map(s => s.size) || [])];

  return (
    <main className="relative bg-[#FAFAFA] min-h-screen">
      <Navigation />
      <section className="pt-24 pb-6 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <Link href="/products" className="font-body text-xs text-[#8A8A8A] hover:text-[#1A1A1A] transition-colors tracking-wider uppercase">
            Back to Collection
          </Link>
        </div>
      </section>
      <section className="px-8 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div className="aspect-[4/5] overflow-hidden bg-[#F0EFED] mb-6">
                {displayImage ? (
                  <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-body text-[#8A8A8A]">No Image</span>
                  </div>
                )}
              </div>
              {product.specs && product.specs.length > 0 && (
                <div className="mb-4">
                  <span className="label text-[#8A8A8A] block mb-3">Specifications</span>
                  <div className="flex gap-3 flex-wrap">
                    {product.specs.map((spec, idx) => (
                      <button
                        key={spec.id || idx}
                        onClick={() => {
                          setSelectedColor(spec.color);
                          setSelectedSize(spec.size);
                          setDisplayImage(spec.image || product.mainImage);
                        }}
                        className={"p-3 border transition-all duration-200 " + (
                          selectedColor === spec.color && selectedSize === spec.size
                            ? "border-[#C9A96E] bg-[#C9A96E]/5"
                            : "border-[#E8E6E2] hover:border-[#C9A96E]"
                        )}
                      >
                        {spec.image && (
                          <img src={spec.image} alt={spec.color} className="w-20 h-20 object-cover mb-2" />
                        )}
                        <div className="text-center">
                          <span className="font-body text-xs text-[#1A1A1A] block">{spec.color}</span>
                          <span className="font-body text-xs text-[#8A8A8A]">{spec.size}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:py-8">
              <span className="label text-[#A8A4A0] block mb-4">{product.categoryName}</span>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-[#1A1A1A] mb-2">{product.name}</h1>
              {product.nameCn && <p className="font-body text-lg text-[#8A8A8A] mb-6">{product.nameCn}</p>}
              <p className="font-display text-2xl text-[#C9A96E] mb-8 tracking-wide">EUR{product.price.toLocaleString()}</p>
              <p className="font-body text-[#8A8A8A] leading-relaxed mb-10">
                {product.description}
                {product.descriptionCn && <><br /><span className="text-[#A8A4A0]">{product.descriptionCn}</span></>}
              </p>
              {colors.length > 0 && (
                <div className="mb-6">
                  <span className="label text-[#8A8A8A] block mb-3">Color {selectedColor && <span className="text-[#1A1A1A] normal-case tracking-normal"> - {selectedColor}</span>}</span>
                  <div className="flex gap-3">
                    {colors.map(color => (
                      <button key={color} onClick={() => setSelectedColor(color)} className={"px-4 py-2 border " + (selectedColor === color ? "border-[#C9A96E] bg-[#C9A96E]/5" : "border-[#E8E6E2] hover:border-[#C9A96E]")}>{color}</button>
                    ))}
                  </div>
                </div>
              )}
              {sizes.length > 0 && (
                <div className="mb-10">
                  <span className="label text-[#8A8A8A] block mb-3">Size {selectedSize && <span className="text-[#1A1A1A] normal-case tracking-normal"> - {selectedSize}</span>}</span>
                  <div className="flex gap-3">
                    {sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={"px-4 py-2 border " + (selectedSize === size ? "border-[#C9A96E] bg-[#C9A96E]/5" : "border-[#E8E6E2] hover:border-[#C9A96E]")}>{size}</button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={handleInquire} className="w-full py-4 bg-[#1A1A1A] text-white font-body text-sm tracking-[0.2em] uppercase hover:bg-[#C9A96E] transition-colors duration-300">INQUIRE VIA WHATSAPP</button>
              <div className="mt-12 border-t border-[#E8E6E2] pt-8">
                <h3 className="font-display text-lg text-[#1A1A1A] mb-4">Details</h3>
                <p className="font-body text-sm text-[#8A8A8A] leading-relaxed">{product.description}{product.descriptionCn && <span className="block mt-1 text-[#A8A4A0]">{product.descriptionCn}</span>}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-8 md:px-16 py-20 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display text-2xl md:text-3xl text-[#1A1A1A] italic leading-relaxed">"Each piece begins with a conversation."</p>
          <p className="font-body text-[#8A8A8A] text-sm mt-6 tracking-widest uppercase">- Maison NOREVA</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}