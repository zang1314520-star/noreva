"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
  const [activeImage, setActiveImage] = useState(0);
  const [currentImage, setCurrentImage] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("8618508036618");

  useEffect(() => {
    fetch("/api/config").then((res) => res.json()).then((data) => {
      setWhatsappNumber(data.whatsapp?.number || "8618508036618");
    });

    fetch("/api/products").then((res) => res.json()).then((data) => {
      const found = data.find((p: Product) => p.id === params.id);
      setProduct(found || null);
      if (found) {
        setCurrentImage(found.mainImage || "");
        // Auto-select first color/size if available
        if (found.specs?.length > 0) {
          const firstSpec = found.specs[0];
          setSelectedColor(firstSpec.color);
          setSelectedSize(firstSpec.size);
          setCurrentImage(firstSpec.image || found.mainImage || "");
        }
      }
      setLoading(false);
    });
  }, [params.id]);

  // Update image when color/size changes
  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const spec = product.specs?.find(s => s.color === selectedColor && s.size === selectedSize);
      if (spec?.image) {
        setCurrentImage(spec.image);
        setActiveImage(-1); // Use spec image
      }
    }
  }, [selectedColor, selectedSize, product]);

  const handleInquire = () => {
    if (!product) return;
    let message = `I am interested in ${product.name} by NOREVA. Price: €${product.price}`;
    if (selectedColor || selectedSize) {
      message += `\nOption: ${selectedColor} ${selectedSize}`.trim();
    }
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  }

  if (!product) {
    return <div className="min-h-screen flex flex-col items-center justify-center"><p className="text-gray-500 mb-4">Product not found</p><Link href="/products" className="text-[#C9A96E] hover:underline">Back to Products</Link></div>;
  }

  // Get unique colors and sizes from specs
  const colors = [...new Set(product.specs?.map(s => s.color) || [])];
  const sizes = [...new Set(product.specs?.map(s => s.size) || [])];

  // All images to display
  const mainDisplayImage = activeImage === -1 ? currentImage : (activeImage === 0 ? product.mainImage : "");
  const allDetailImages = product.detailImages || [];
  const displayImages = [mainDisplayImage, ...allDetailImages].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white py-6 px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="font-display text-2xl tracking-wider">NOREVA</Link>
        </div>
      </header>

      {/* Product */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/products" className="text-sm text-gray-500 hover:text-gray-900 mb-8 inline-block">← Back to Products</Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 overflow-hidden mb-4">
                {displayImages[activeImage] ? (
                  <img src={displayImages[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              <div className="flex gap-2 flex-wrap">
                {/* Main/spec image */}
                {displayImages[0] && (
                  <button onClick={() => setActiveImage(0)} className={`w-20 h-20 border-2 ${activeImage === 0 ? "border-[#C9A96E]" : "border-gray-200"}`}>
                    <img src={displayImages[0]} alt="" className="w-full h-full object-cover" />
                  </button>
                )}
                {/* Detail images */}
                {allDetailImages.map((img, index) => (
                  <button key={index + 1} onClick={() => setActiveImage(index + 1)} className={`w-20 h-20 border-2 ${activeImage === index + 1 ? "border-[#C9A96E]" : "border-gray-200"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <span className="label text-[#A8A4A0] block mb-2">{product.categoryName}</span>
              <h1 className="font-display text-3xl md:text-4xl font-light mb-2">{product.name}</h1>
              {product.nameCn && <p className="text-gray-500 text-lg mb-6">{product.nameCn}</p>}
              <p className="text-2xl text-[#C9A96E] mb-8">€{product.price.toLocaleString()}</p>

              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="label text-gray-600 mb-3">Color: {selectedColor}</h3>
                  <div className="flex gap-2">
                    {colors.map(color => (
                      <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 border rounded-lg ${selectedColor === color ? "border-[#C9A96E] bg-[#C9A96E]/10" : "border-gray-200"}`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="label text-gray-600 mb-3">Size: {selectedSize}</h3>
                  <div className="flex gap-2">
                    {sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-lg ${selectedSize === size ? "border-[#C9A96E] bg-[#C9A96E]/10" : "border-gray-200"}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="label text-gray-600 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Inquire Button */}
              <button onClick={handleInquire} className="w-full bg-[#1A1A1A] text-white py-4 text-sm tracking-wider hover:bg-[#C9A96E] transition">
                INQUIRE VIA WHATSAPP
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
