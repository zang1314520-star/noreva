"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Minus, Plus, Trash2, Loader2, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

function formatMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, subtotal, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const currency = items[0]?.currency || "USD";

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const checkoutItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        image: item.image,
        price: item.price,
        currency: item.currency,
        quantity: item.quantity,
      }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`Checkout failed: ${data.error || "Unknown error"}`);
      }
    } catch {
      alert("Checkout failed. Please contact us on WhatsApp and we will help you finish the order.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-32 right-0 z-50 group"
        aria-label="Shopping bag"
      >
        <span className="absolute inset-0 rounded-full bg-[#1A1A1A]/10 scale-100 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
        <div className="relative translate-x-[22px] group-hover:translate-x-0 transition-all duration-300">
          {totalItems > 0 && (
            <span className="absolute -top-1 -left-1 bg-[#C9A96E] text-white text-xs min-w-[20px] h-[20px] rounded-full flex items-center justify-center font-bold z-10">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
          <div className="w-11 h-11 rounded-full bg-[#1A1A1A] flex items-center justify-center group-hover:bg-[#C9A96E] group-hover:shadow-lg shadow-[#1A1A1A]/10">
            <ShoppingBag className="w-5 h-5 text-white group-hover:text-[#1A1A1A] transition-colors duration-300" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="fixed inset-0 bg-black/30 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#E8E6E2]">
                <div>
                  <p className="label text-[#8A8A8A] mb-1">Secure checkout</p>
                  <h2 className="font-display text-2xl font-light text-[#1A1A1A]">
                    Your Bag ({totalItems})
                  </h2>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 hover:bg-[#F7F5F1] rounded-full" aria-label="Close cart">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 border-b border-[#E8E6E2] px-6 py-4 text-center">
                {["Free shipping", "30-day returns", "24-month warranty"].map((item) => (
                  <div key={item} className="rounded-xl bg-[#F7F5F1] px-2 py-3">
                    <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-[#C9A96E]" />
                    <p className="font-body text-[10px] leading-[1.35] text-[#1A1A1A]">{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex-1 overflow-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-20 text-[#8A8A8A]">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-25" />
                    <p className="font-display text-xl text-[#1A1A1A]">Your bag is empty</p>
                    <button onClick={() => setOpen(false)} className="mt-4 cta-link text-xs">
                      Continue shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex gap-4 rounded-[18px] bg-[#F7F5F1] p-4">
                        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-[#C9A96E]">{item.brand}</p>
                          <h4 className="font-body text-sm text-[#1A1A1A] line-clamp-2">{item.name}</h4>
                          <p className="font-body text-sm mt-1 text-[#1A1A1A]">{formatMoney(item.price, item.currency)}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <button onClick={() => updateQuantity(String(idx), -1)} className="p-1 hover:bg-white rounded" aria-label="Decrease quantity">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(String(idx), 1)} className="p-1 hover:bg-white rounded" aria-label="Increase quantity">
                              <Plus className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeItem(String(idx))} className="ml-auto p-1 hover:bg-red-50 text-red-400 rounded" aria-label="Remove item">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-[#E8E6E2] p-6">
                  <div className="flex justify-between text-lg mb-2">
                    <span className="font-body text-[#8A8A8A]">Subtotal</span>
                    <span className="font-body text-[#1A1A1A]">{formatMoney(subtotal, currency)}</span>
                  </div>
                  <p className="text-xs text-[#8A8A8A] mb-4">
                    Free shipping is applied at checkout where available. Duties and final delivery timing are confirmed before payment.
                  </p>
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full bg-[#1A1A1A] text-white py-4 font-body text-[11px] uppercase tracking-[0.2em] hover:bg-[#C9A96E] hover:text-[#1A1A1A] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    {checkingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : "Proceed to Checkout"}
                  </button>
                  <button onClick={clearCart} className="w-full text-[#8A8A8A] text-sm py-3 hover:text-red-500">
                    Clear bag
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
