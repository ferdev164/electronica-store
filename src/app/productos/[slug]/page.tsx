import { notFound } from 'next/navigation'
import { getProductoBySlug } from '@/lib/productos'
import ImageGallery from '@/components/ImageGallery'

import AddToCartButton from '@/components/AddToCartButton' // boton
interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params
  const producto = await getProductoBySlug(slug)

  if (!producto) notFound()

  const specs = [
    { label: 'Voltaje', valor: producto.voltaje },
    { label: 'Protocolo', valor: producto.protocolo },
    { label: 'Tipo de salida', valor: producto.tipo_salida },
  ].filter((s) => s.valor)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ImageGallery
          imagenes={producto.imagenes as any}
          nombreProducto={producto.nombre}
        />
        <div className="space-y-6">
          <div>
            <p className="text-sm text-blue-600 mb-1">{producto.categoria.nombre}</p>
            <h1 className="text-2xl font-semibold text-gray-900">{producto.nombre}</h1>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            S/.{Number(producto.precio).toFixed(2)}
          </p>
          {producto.descripcion && (
            <p className="text-gray-600 leading-relaxed">{producto.descripcion}</p>
          )}
          {specs.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Especificaciones
              </p>
              <div className="space-y-2">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">{spec.label}</span>
                    <span className="text-sm font-medium text-gray-900">{spec.valor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className={producto.stock > 0 ? "w-2 h-2 rounded-full bg-green-400" : "w-2 h-2 rounded-full bg-red-400"} />
            <span className="text-sm text-gray-600">
              {producto.stock > 0 ? producto.stock + " unidades disponibles" : "Sin stock"}
            </span>
          </div>
          <AddToCartButton producto={producto as any} />
        </div>
      </div>
    </div>
  )
}