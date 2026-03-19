'use client'

import { useCartStore } from '@/store/cartStore'

interface Props {
  producto: {
    id: number
    nombre: string
    precio: number
    slug: string
    stock: number
    imagenes: { url: string }[]
  }
}

export default function AddToCartButton({ producto }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = () => {
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      slug: producto.slug,
      stock: producto.stock,
      imagen: producto.imagenes[0]?.url || '',
    })
  }

  return (
    <button
      onClick={handleAdd}
      disabled={producto.stock === 0}
      className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {producto.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
    </button>
  )
}