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
        <h1 className="text-2xl font-semibold text-gray-900">Catalogo</h1>
        <p className="text-gray-500 mt-1">{productos.length} productos disponibles</p>
      </div>
      <div className="flex gap-8">
        <aside className="w-48 flex-shrink-0">
          <ul className="space-y-1">
            <li>
              <a href="/productos" className="block text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                Todos
              </a>
            </li>
            {categorias.map((cat) => (
              <li key={cat.id}>
                <a href={"/productos?categoria=" + cat.slug} className="block text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                  {cat.nombre}
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto as any} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}