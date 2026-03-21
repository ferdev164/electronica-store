import { notFound } from 'next/navigation'
import { getProductoBySlug, getProductosRelacionados } from '@/lib/productos'
import ImageGallery from '@/components/ImageGallery'
import AddToCartButton from '@/components/AddToCartButton'
import ConsultarWhatsApp from '@/components/ConsultarWhatsApp'
import DatasheetButton from '@/components/DatasheetButton'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params
  const producto = await getProductoBySlug(slug)

  if (!producto) notFound()

  const relacionados = await getProductosRelacionados(producto.id, producto.categoriaId)

  const specs = [
    { label: 'Voltaje', valor: producto.voltaje },
    { label: 'Protocolo', valor: producto.protocolo },
    { label: 'Tipo de salida', valor: producto.tipo_salida },
  ].filter((s) => s.valor)

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-gray-600">Catalogo</Link>
          <span>/</span>
          <Link href={"/productos?categoria=" + producto.categoria.slug} className="hover:text-gray-600">
            {producto.categoria.nombre}
          </Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-48">{producto.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Galeria */}
          <ImageGallery
            imagenes={producto.imagenes as any}
            nombreProducto={producto.nombre}
          />

          {/* Info */}
          <div className="space-y-5">
            <div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                {producto.categoria.nombre}
              </span>
              <h1 className="text-2xl font-semibold text-gray-900 mt-3 leading-tight">
                {producto.nombre}
              </h1>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              S/.{Number(producto.precio).toFixed(2)}
            </p>

            {producto.descripcion && (
              <p className="text-gray-500 leading-relaxed text-sm">{producto.descripcion}</p>
            )}

            {/* Specs */}
            {specs.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Especificaciones tecnicas
                </p>
                <div className="space-y-2">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-500">{spec.label}</span>
                      <span className="text-sm font-medium text-gray-900">{spec.valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={producto.stock > 0 ? "w-2 h-2 rounded-full bg-green-400" : "w-2 h-2 rounded-full bg-red-400"} />
              <span className="text-sm text-gray-500">
                {producto.stock > 0 ? producto.stock + " unidades disponibles" : "Sin stock"}
              </span>
            </div>

            {/* Acciones */}
            <div className="space-y-3 pt-2">
              <AddToCartButton producto={producto as any} />
              <ConsultarWhatsApp nombreProducto={producto.nombre} />
              {producto.pdf_url && (
                <DatasheetButton
                  url={producto.pdf_url}
                  nombreProducto={producto.nombre}
                />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relacionados.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50 py-12 mt-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Productos relacionados</h2>
                <p className="text-sm text-gray-400 mt-0.5">De la misma categoria</p>
              </div>
              <Link
                href={"/productos?categoria=" + producto.categoria.slug}
                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
              >
                Ver todos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relacionados.map((p) => (
                <ProductCard key={p.id} producto={p as any} />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}