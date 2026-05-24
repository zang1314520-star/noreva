'use client'

import { type ReactNode } from 'react'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  )
}
