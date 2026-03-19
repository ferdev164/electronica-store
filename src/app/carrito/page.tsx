'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'

import { generarMensajePedido, generarUrlWhatsApp } from '@/lib/whatsapp'

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 mb-4">Tu carrito esta vacio</p>
        <Link href="/productos" className="text-sm text-blue-600 hover:underline">
          Ver catalogo
        </Link>
      </div>
    )
  }

  const handleEnviarPedido = () => {
  const mensaje = generarMensajePedido(items)
  const url = generarUrlWhatsApp(mensaje)
  window.open(url, '_blank')
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Resumen del pedido</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl">
            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
              {item.imagen && (
                <Image
                  src={item.imagen}
                  alt={item.nombre}
                  fill
                  className="object-contain p-2"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.nombre}</p>
              <p className="text-sm text-gray-500 mt-1">S/.{item.precio.toFixed(2)} por unidad</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                  className="w-7 h-7 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-sm w-8 text-center">{item.cantidad}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                  className="w-7 h-7 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                S/.{(item.precio * item.cantidad).toFixed(2)}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-red-400 hover:text-red-600 mt-2"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total referencial</span>
          <span>S/.{total().toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-400">
          Precios sujetos a confirmacion de stock. El total final se acordara por WhatsApp.
        </p>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Vaciar carrito
          </button>
          <button
            onClick={handleEnviarPedido}
            className="flex-1 py-3 rounded-xl bg-green-500 text-white font-medium text-sm text-center hover:bg-green-600 transition-colors"
          >
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}