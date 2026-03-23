import { getProductosPorLinea, getCategoriasPorLinea } from '@/lib/productos'
import { LINEAS } from '@/lib/lineas'
import ProductCard from '@/components/ProductCard'

import FiltrosCatalogo from '@/components/FiltrosCatalogo'

interface Props {
  searchParams: Promise<{ categoria?: string; q?: string }>
}

export default async function ElectricidadPage({ searchParams }: Props) {
  const { categoria, q } = await searchParams
  const linea = LINEAS.electricidad

  const slugsFiltrados = categoria
    ? [categoria]
    : linea.slugs as unknown as string[]

  const [productos, categorias] = await Promise.all([
    getProductosPorLinea(slugsFiltrados, { busqueda: q }),
    getCategoriasPorLinea(linea.slugs as unknown as string[]),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-amber-500 rounded"></div>
          <h1 className="text-2xl font-semibold text-gray-900">{linea.nombre}</h1>
        </div>
        <p className="text-gray-500 text-sm">{linea.descripcion}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <FiltrosCatalogo
        categorias={categorias}
        baseUrl="/electricidad"
        color="amber"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-400 mb-4">{productos.length} productos disponibles</p>
          {productos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No se encontraron productos en esta linea
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}