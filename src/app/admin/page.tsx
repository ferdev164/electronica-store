export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { prisma } from '@/lib/db'

export default async function AdminPage() {
  const session = await getServerSession()

  const [totalProductos, totalPedidos, stockBajo] = await Promise.all([
    prisma.producto.count(),
    prisma.pedido.count(),
    prisma.producto.count({ where: { stock: { lte: 5 } } }),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session?.user?.email}</span>
          <Link
            href="/api/auth/signout"
            className="text-sm text-red-500 hover:text-red-700"
          >
            Cerrar sesion
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Productos</p>
          <p className="text-3xl font-semibold text-gray-900">{totalProductos}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Pedidos recibidos</p>
          <p className="text-3xl font-semibold text-gray-900">{totalPedidos}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Stock bajo</p>
          <p className="text-3xl font-semibold text-gray-900">{stockBajo}</p>
          {stockBajo > 0 && (
            <p className="text-xs text-amber-500 mt-1">Revisar inventario</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/admin/productos"
          className="bg-white border border-gray-100 rounded-xl p-6 hover:border-gray-300 transition-colors"
        >
          <p className="font-medium text-gray-900 mb-1">Gestionar productos</p>
          <p className="text-sm text-gray-400">Crear, editar y activar productos</p>
        </Link>
        <Link
          href="/admin/pedidos"
          className="bg-white border border-gray-100 rounded-xl p-6 hover:border-gray-300 transition-colors"
        >
          <p className="font-medium text-gray-900 mb-1">Ver pedidos</p>
          <p className="text-sm text-gray-400">Pedidos recibidos por WhatsApp</p>
        </Link>
      </div>
    </div>
  )
}