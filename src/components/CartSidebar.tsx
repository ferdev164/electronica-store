'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, totalItems } =
    useCartStore()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.3)' }}
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white z-50 shadow-xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Carrito ({totalItems()})
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-600 text-xl font-light"
          >
            x
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-16">Tu carrito esta vacio</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                  {item.imagen && (
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      className="object-contain p-1"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.nombre}</p>
                  <p className="text-sm text-gray-500">S/.{item.precio.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      className="w-6 h-6 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm w-6 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      className="w-6 h-6 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-xs text-red-400 hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total referencial</span>
              <span>S/.{total().toFixed(2)}</span>
            </div>
            <Link
              href="/carrito"
              onClick={closeCart}
              className="block w-full bg-gray-900 text-white py-3 rounded-xl font-medium text-center hover:bg-gray-700 transition-colors"
            >
              Ver resumen
            </Link>
          </div>
        )}
      </div>
    </>
  )
}