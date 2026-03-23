import { getProductos, getCategorias } from "@/lib/productos"
import ProductCard from "@/components/ProductCard"

interface Props {
  searchParams: Promise<{ categoria?: string; q?: string }>
}

export default async function CatalogoPage({ searchParams }: Props) {
  const { categoria, q } = await searchParams

  const [productos, categorias] = await Promise.all([
    getProductos({
      categoriaSlug: categoria,
      busqueda: q,
    }),
    getCategorias(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-gray-500 rounded"></div>
          <h1 className="text-2xl font-semibold text-gray-900">Catalogo</h1>
        </div>
        <p className="text-gray-500 text-sm">{productos.length} productos disponibles</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">

        <aside className="w-full md:w-44 flex-shrink-0">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Categorias
          </p>
          <ul className="flex flex-wrap gap-2 md:flex-col md:gap-0 md:space-y-1">
            <li>
              <a
                href="/productos"
                className={"inline-block md:block text-sm px-3 py-1.5 md:py-2 rounded-lg transition-colors " +
                  (!categoria ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50')}
              >
                Todos
              </a>
            </li>
            {categorias.map((cat) => (
              <li key={cat.id}>
                <a
                  href={"/productos?categoria=" + cat.slug}
                  className={"inline-block md:block text-sm px-3 py-1.5 md:py-2 rounded-lg transition-colors " +
                    (categoria === cat.slug ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50')}
                >
                  {cat.nombre}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 min-w-0">
          {productos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No se encontraron productos
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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