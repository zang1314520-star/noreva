'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X, Minus, Plus, Trash2, Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, subtotal, clearCart } = useCart()
  const [open, setOpen] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      const checkoutItems = items.map(item => ({
        name: item.name,
        brand: item.brand,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }))
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: checkoutItems }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Checkout failed: ' + (data.error || 'Unknown error'))
      }
    } catch {
      alert('Checkout failed')
    } finally {
      setCheckingOut(false)
    }
  }

  const currencySymbol = items[0]?.currency === 'CNY' ? '¥' : '€'

  return (
    <>
      {/* Floating button - positioned above WhatsApp to avoid overlap */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-[#C9A96E] text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition-colors"
        aria-label="Shopping bag"
      >
        <ShoppingBag className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-serif font-bold">
                  Your Bag ({totalItems})
                </h2>
                <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Your bag is empty</p>
                    <button onClick={() => setOpen(false)} className="mt-4 text-sm text-[#C9A96E]">Continue shopping</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#C9A96E]">{item.brand}</p>
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          {item.color && <p className="text-xs text-gray-500">{item.color}</p>}
                          {item.size && <p className="text-xs text-gray-500">{item.size}</p>}
                          <p className="font-medium mt-1">{currencySymbol}{item.price.toFixed(0)}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <button onClick={() => updateQuantity(String(idx), -1)} className="p-1 hover:bg-gray-200 rounded">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(String(idx), 1)} className="p-1 hover:bg-gray-200 rounded">
                              <Plus className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeItem(String(idx))} className="ml-auto p-1 hover:bg-red-50 text-red-400 rounded">
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
                <div className="border-t p-6">
                  <div className="flex justify-between text-lg mb-2">
                    <span>Subtotal</span>
                    <span className="font-bold">{currencySymbol}{subtotal.toFixed(0)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Shipping calculated at checkout</p>
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full bg-[#C9A96E] text-white py-3 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {checkingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Proceed to Checkout'}
                  </button>
                  <button onClick={clearCart} className="w-full text-gray-400 text-sm py-2 hover:text-red-500">
                    Clear bag
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
