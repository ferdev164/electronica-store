import Image from 'next/image'
import Link from 'next/link'
import { Producto } from '@/types'

interface Props {
  producto: Producto
}

export default function ProductCard({ producto }: Props) {
  const imagenPrincipal = producto.imagenes[0]

  return (
    <Link href={"/productos/" + producto.slug} className="group block">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
        
        <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-t-xl">
          {imagenPrincipal ? (
            <Image
              src={imagenPrincipal.url}
              alt={imagenPrincipal.alt || producto.nombre}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-4 transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
              Sin imagen
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">{producto.categoria.nombre}</p>
          <h3 className="text-sm font-medium text-gray-900 leading-tight mb-2 line-clamp-2">
            {producto.nombre}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">
              S/.{Number(producto.precio).toFixed(2)}
            </span>
            {producto.voltaje && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {producto.voltaje}
              </span>
            )}
          </div>
        </div>

      </div>
    </Link>
  )
}