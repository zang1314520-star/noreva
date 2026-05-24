'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  currency: string
  image: string
  color?: string
  size?: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, change: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('noreva_cart_v2')
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch {}
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('noreva_cart_v2', JSON.stringify(items))
    }
  }, [items, loaded])

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingIdx = prev.findIndex(item =>
        item.id === newItem.id && item.color === newItem.color && item.size === newItem.size
      )
      if (existingIdx > -1) {
        const updated = [...prev]
        updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + 1 }
        return updated
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter((_, i) => String(i) !== id))
  }

  const updateQuantity = (id: string, change: number) => {
    setItems(prev => {
      const idx = parseInt(id)
      if (isNaN(idx) || idx < 0 || idx >= prev.length) return prev
      const updated = [...prev]
      const newQty = updated[idx].quantity + change
      if (newQty < 1) {
        return updated.filter((_, i) => i !== idx)
      }
      updated[idx] = { ...updated[idx], quantity: newQty }
      return updated
    })
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
