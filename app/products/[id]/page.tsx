"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
  image: string;
  images: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState("8618508036618");

  useEffect(() => {
    // Get site config for WhatsApp number
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setWhatsappNumber(data.whatsapp?.number || "8618508036618");
      });

    // Get product
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p: Product) => p.id === params.id);
        setProduct(found || null);
        setLoading(false);
      });
  }, [params.id]);

  const handleInquire = () => {
    const message = `I am interested in ${product?.name} by NOREVA. Price: €${product?.price}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Product not found</p>
        <Link href="/products" className="text-[#C9A96E] hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const allImages = [product.image, ...product.images].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white py-6 px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="font-display text-2xl tracking-wider">
            NOREVA
          </Link>
        </div>
      </header>

      {/* Product */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/products" className="text-sm text-gray-500 hover:text-gray-900 mb-8 inline-block">
            ← Back to Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gray-100 overflow-hidden mb-4">
                {allImages[activeImage] ? (
                  <img
                    src={allImages[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 border-2 ${
                        activeImage === index ? "border-[#C9A96E]" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <span className="label text-[#A8A4A0] block mb-2">{product.categoryName}</span>
              <h1 className="font-display text-3xl md:text-4xl font-light mb-2">
                {product.name}
              </h1>
              {product.nameCn && (
                <p className="text-gray-500 text-lg mb-6">{product.nameCn}</p>
              )}
              <p className="text-2xl text-[#C9A96E] mb-8">
                €{product.price.toLocaleString()}
              </p>

              <div className="border-t border-gray-200 pt-8 mb-8">
                <h2 className="label text-gray-600 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                {product.descriptionCn && (
                  <p className="text-gray-500 leading-relaxed">{product.descriptionCn}</p>
                )}
              </div>

              <button
                onClick={handleInquire}
                className="w-full bg-[#1A1A1A] text-white py-4 text-sm tracking-wider hover:bg-[#C9A96E] transition-colors"
              >
                INQUIRE VIA WHATSAPP
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Or contact us directly via the WhatsApp button below
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-8 px-8 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <Link href="/" className="font-display text-xl tracking-wider">
            NOREVA
          </Link>
          <p className="text-gray-500 text-sm mt-2">Quiet refinement. Timeless objects.</p>
        </div>
      </footer>
    </div>
  );
}
