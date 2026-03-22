import { getProductos } from '@/lib/productos'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function BusquedaPage({ searchParams }: Props) {
  const { q } = await searchParams
  const termino = q?.trim() || ''

  const productos = termino
    ? await getProductos({ busqueda: termino })
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        {termino ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Resultados para "{termino}"
            </h1>
            <p className="text-sm text-gray-400">
              {productos.length === 0
                ? 'No se encontraron productos'
                : productos.length + ' producto' + (productos.length !== 1 ? 's' : '') + ' encontrado' + (productos.length !== 1 ? 's' : '')}
            </p>
          </>
        ) : (
          <h1 className="text-2xl font-semibold text-gray-900">Buscar productos</h1>
        )}
      </div>

      {productos.length === 0 && termino && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <p className="text-gray-400 mb-2">No encontramos productos para "{termino}"</p>
          <p className="text-sm text-gray-300 mb-6">Intenta con otro termino o revisa el catalogo completo</p>
          <Link
            href="/productos"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-800 border border-emerald-200 px-6 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Ver catalogo completo
          </Link>
        </div>
      )}

      {productos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto as any} />
          ))}
        </div>
      )}
    </div>
  )
}