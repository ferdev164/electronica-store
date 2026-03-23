'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

import SearchBar from './SearchBar'

export default function Navbar() {
  const { openCart, totalItems } = useCartStore()
  const count = totalItems()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-10">
        <div className="h-16 flex items-center gap-6">

          <Link href="/" className="font-semibold text-gray-900 text-lg whitespace-nowrap">
            Electronica Store
          </Link>

          {/* Buscador — oculto en móvil pequeño */}
          <div className="hidden sm:flex flex-1">
            <SearchBar />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <Link href="/productos" className="hidden sm:block cursor-pointer hover:text-emerald-600 transition-colors">
              Catálogo
            </Link>
            
            <button
              onClick={openCart}
              className="cursor-pointer relative flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            {/* Botón hamburguesa — solo móvil */}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden flex flex-col gap-1.5 p-1"
            >
              <span className={"w-5 h-0.5 bg-gray-600 transition-all " + (menuAbierto ? "rotate-45 translate-y-2" : "")} />
              <span className={"w-5 h-0.5 bg-gray-600 transition-all " + (menuAbierto ? "opacity-0" : "")} />
              <span className={"w-5 h-0.5 bg-gray-600 transition-all " + (menuAbierto ? "-rotate-45 -translate-y-2" : "")} />
            </button>
            
          </div>
        </div>
        {/* Buscador móvil */}
        <div className="sm:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Barra de líneas — desktop */}
      <div className="hidden md:block bg-slate-900 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            <Link href="/control" className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-slate-800 text-xs px-4 py-3 transition-colors border-r border-slate-800">
              <svg width="17" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M7 8h4M7 11h2"/><rect x="14" y="7" width="4" height="5" rx="1"/>
              </svg>
              Control Industrial
            </Link>
            <Link href="/electricidad" className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-slate-800 text-xs px-4 py-3 transition-colors border-r border-slate-800">
              <svg width="17" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Electricidad
            </Link>
            <Link href="/redes" className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-slate-800 text-xs px-4 py-3 transition-colors border-r border-slate-800">
              <svg width="17" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Redes Industriales & IoT
            </Link>
            <Link href="/productos" className="text-gray-400 hover:text-white hover:bg-slate-800 text-xs px-4 py-3 transition-colors border-r border-slate-800">
              Catálogo
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


      {/* Menú móvil desplegable */}
            {menuAbierto && (
              <div className="md:hidden bg-slate-900 border-t border-slate-800">
                <div className="px-4 py-2 space-y-0">
                  <Link
                    href="/control"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 text-gray-300 hover:text-white py-3 border-b border-slate-800 text-sm"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M7 8h4M7 11h2"/>
                    </svg>
                    Control Industrial
                  </Link>
                  <Link
                    href="/electricidad"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 text-gray-300 hover:text-white py-3 border-b border-slate-800 text-sm"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    Electricidad
                  </Link>
                  <Link
                    href="/redes"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 text-gray-300 hover:text-white py-3 border-b border-slate-800 text-sm"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    Redes & IoT
                  </Link>
                  <Link
                    href="/productos"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 text-gray-300 hover:text-white py-3 border-b border-slate-800 text-sm"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3h18M3 9h18M3 15h18M3 21h18"/>
                    </svg>
                    Catálogo completo
                  </Link>
                  <a
                    href={"https://wa.me/" + process.env.NEXT_PUBLIC_WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hola, quisiera cotizar un proyecto.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 text-emerald-400 py-3 text-sm font-medium"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Cotizar proyecto
                  </a>
                </div>
              </div>
            )}

          </header>
        )
      }