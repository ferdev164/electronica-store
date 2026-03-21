'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { openCart, totalItems } = useCartStore()
  const count = totalItems()
  const [busqueda, setBusqueda] = useState('')
  const router = useRouter()

  const handleBusqueda = (e: React.FormEvent) => {
    e.preventDefault()
    if (busqueda.trim()) {
      router.push('/productos?q=' + encodeURIComponent(busqueda.trim()))
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-10">
        <div className="h-16 flex items-center gap-6">
          <Link href="/" className="font-semibold text-gray-900 text-lg whitespace-nowrap">
            Electronica Store
          </Link>
          <form onSubmit={handleBusqueda} className="flex-1 max-w-xl">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos, referencias..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </form>
          <div className="flex items-center gap-6 ml-auto">
            <Link href="/productos" className="cursor-pointer hover:text-emerald-600 transition-colors">
              Catalogo
            </Link>
            <button
              onClick={openCart}
              className="cursor-pointer hover:text-emerald-600 transition-colors"
            >
              Carrito
              {count > 0 && (
                <span className="absolute -top-2 -right-4 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            <Link href="/control" className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-slate-800 text-xs px-4 py-3 transition-colors border-r border-slate-800">
              <svg width="20" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M7 8h4M7 11h2"/><rect x="14" y="7" width="4" height="5" rx="1"/>
              </svg>
              Control Industrial
            </Link>
            <Link href="/electricidad" className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-slate-800 text-xs px-4 py-3 transition-colors border-r border-slate-800">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Electricidad
            </Link>
            <Link href="/redes" className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-slate-800 text-xs px-4 py-3 transition-colors border-r border-slate-800">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Redes Industriales & IoT
            </Link>
            <Link href="/productos" className="text-gray-400 hover:text-white hover:bg-slate-800 text-xs px-4 py-3 transition-colors border-r border-slate-800">
              Catalogo
            </Link>
            <a
              href={"https://wa.me/" + process.env.NEXT_PUBLIC_WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hola, quisiera cotizar un proyecto.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 text-xs px-4 py-3 transition-colors ml-auto font-medium"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Cotizar proyecto
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}