'use client'

import { useEffect, useState } from 'react' // 1. Importamos hooks
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
// 2. Definimos el estado 'mounted'
  const [mounted, setMounted] = useState(false)

  const { openCart, totalItems } = useCartStore()
  const count = totalItems()
  
  // 3. Este efecto se asegura de que solo se muestre el contador en el navegador
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-30">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 text-lg">
          Electronica Store
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/productos" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Catalogo
          </Link>
          <button
            onClick={openCart}
            className="relative flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Carrito
            {mounted && count > 0 && (
              <span className="absolute -top-2 -right-4 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}