'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImagenProducto } from '@/types'

interface Props {
  imagenes: ImagenProducto[]
  nombreProducto: string
}

export default function ImageGallery({ imagenes, nombreProducto }: Props) {
  const [imagenActiva, setImagenActiva] = useState(0)

  if (imagenes.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
        Sin imagen
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
        <Image
          src={imagenes[imagenActiva].url}
          alt={imagenes[imagenActiva].alt || nombreProducto}
          fill
          className="object-contain p-6"
          priority
        />
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="flex gap-2">
          {imagenes.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setImagenActiva(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                imagenActiva === index
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `Vista ${index + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}