'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ImagenProducto } from '@/types'

interface Props {
  imagenes: ImagenProducto[]
  nombreProducto: string
}

export default function ImageGallery({ imagenes, nombreProducto }: Props) {
  const [imagenActiva, setImagenActiva] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
  }

  if (imagenes.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
        Sin imagen
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-crosshair"
      >
        <Image
          src={imagenes[imagenActiva].url}
          alt={imagenes[imagenActiva].alt || nombreProducto}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          style={{
            objectFit: 'contain',
            padding: zoomed ? '0' : '24px',
            transform: zoomed ? 'scale(2.5)' : 'scale(1)',
            transformOrigin: pos.x + '% ' + pos.y + '%',
            transition: zoomed ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out',
          }}
        />
      </div>

      {imagenes.length > 1 && (
        <div className="flex gap-2">
          {imagenes.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setImagenActiva(index)}
              className={"relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 " + (imagenActiva === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300')}
            >
              <Image
                src={img.url}
                alt={img.alt || "Vista " + (index + 1)}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}