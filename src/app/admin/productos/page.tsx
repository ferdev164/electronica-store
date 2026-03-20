export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AdminProductosPage() {
  const productos = await prisma.producto.findMany({
    include: { categoria: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Nombre</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Categoria</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Precio</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Stock</th>
              <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.nombre}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.categoria.nombre}</td>
                <td className="px-4 py-3 text-sm text-gray-900">S/.{Number(p.precio).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <span className={p.stock <= 5 ? 'text-amber-500 font-medium' : ''}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={"/admin/productos/" + p.id}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}