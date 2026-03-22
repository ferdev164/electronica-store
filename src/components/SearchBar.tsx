'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Sugerencia {
  id: number
  nombre: string
  slug: string
  //precio: number
  imagenes: { url: string }[]
  categoria: { nombre: string }
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([])
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (query.trim().length < 2) {
      setSugerencias([])
      setAbierto(false)
      return
    }

    setCargando(true)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/busqueda?q=' + encodeURIComponent(query.trim()) + '&limit=5')
        const data = await res.json()
        setSugerencias(data)
        setAbierto(true)
      } catch {
        setSugerencias([])
      } finally {
        setCargando(false)
      }
    }, 300)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setAbierto(false)
      router.push('/busqueda?q=' + encodeURIComponent(query.trim()))
    }
  }

  const handleSugerencia = (slug: string) => {
    setAbierto(false)
    setQuery('')
    router.push('/productos/' + slug)
  }

  return (
    <div ref={ref} className="relative flex-1 max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-gray-400 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => sugerencias.length > 0 && setAbierto(true)}
            placeholder="Buscar productos, referencias..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          {cargando && (
            <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin flex-shrink-0" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSugerencias([]); setAbierto(false) }}
              className="text-gray-300 hover:text-gray-500 flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </form>

      {abierto && sugerencias.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          {sugerencias.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSugerencia(s.slug)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
            >
              <div className="relative w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                {s.imagenes[0] ? (
                  <Image
                    src={s.imagenes[0].url}
                    alt={s.nombre}
                    fill
                    sizes="40px"
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{s.nombre}</p>
                <p className="text-xs text-gray-400">{s.categoria.nombre}</p>
              </div>
              {/*<p className="text-sm font-medium text-gray-900 flex-shrink-0">
                S/.{Number(s.precio).toFixed(2)}
              </p>*/}
            </button>
          ))}
          <button
            onClick={() => { setAbierto(false); router.push('/busqueda?q=' + encodeURIComponent(query.trim())) }}
            className="w-full px-4 py-3 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Ver todos los resultados para "{query}"
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}