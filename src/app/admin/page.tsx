export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export default async function AdminPage() {
  const session = await getServerSession()

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const [
    totalProductos,
    totalPedidos,
    pedidosHoy,
    stockBajoProductos,
    valorCatalogo,
    ultimosPedidos,
  ] = await Promise.all([
    prisma.producto.count({ where: { activo: true } }),
    prisma.pedido.count(),
    prisma.pedido.count({ where: { createdAt: { gte: hoy } } }),
    prisma.producto.findMany({
      where: { activo: true, stock: { lte: 5 } },
      orderBy: { stock: 'asc' },
      include: { categoria: true },
      take: 5,
    }),
    prisma.producto.findMany({
      where: { activo: true },
      select: { precio: true, stock: true },
    }),
    prisma.pedido.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const valorTotal = valorCatalogo.reduce(
    (acc, p) => acc + Number(p.precio) * p.stock,
    0
  )

  const tiempoRelativo = (fecha: Date) => {
    const diff = Date.now() - new Date(fecha).getTime()
    const min = Math.floor(diff / 60000)
    const hrs = Math.floor(diff / 3600000)
    const dias = Math.floor(diff / 86400000)
    if (min < 60) return 'hace ' + min + 'min'
    if (hrs < 24) return 'hace ' + hrs + 'h'
    if (dias === 1) return 'ayer'
    return 'hace ' + dias + ' dias'
  }

  const fecha = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5 capitalize">{fecha}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{session?.user?.email}</span>
          <Link
            href="/admin/productos/nuevo"
            className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + Nuevo producto
          </Link>
          <Link href="/api/auth/signout" className="text-sm text-red-400 hover:text-red-600">
            Salir
          </Link>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
              </svg>
            </div>
            <p className="text-xs text-gray-400">Productos activos</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{totalProductos}</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <p className="text-xs text-gray-400">Pedidos hoy</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{pedidosHoy}</p>
          <p className="text-xs text-gray-400 mt-1">{totalPedidos} en total</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <p className="text-xs text-gray-400">Stock bajo</p>
          </div>
          <p className="text-3xl font-semibold text-amber-500">{stockBajoProductos.length}</p>
          {stockBajoProductos.length > 0 && (
            <p className="text-xs text-amber-400 mt-1">Requieren reposicion</p>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <p className="text-xs text-gray-400">Valor catalogo</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900">S/.{valorTotal.toFixed(0)}</p>
          <p className="text-xs text-gray-400 mt-1">Stock x precio</p>
        </div>
      </div>

      {/* Tablas */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* Stock bajo */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900">Stock bajo</h2>
            <Link href="/admin/productos" className="text-xs text-emerald-600 hover:text-emerald-800">
              Ver todos →
            </Link>
          </div>
          {stockBajoProductos.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Todo el stock esta bien</p>
          ) : (
            <div className="space-y-0">
              {stockBajoProductos.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.nombre}</p>
                    <p className="text-xs text-gray-400">{p.categoria.nombre}</p>
                  </div>
                  <span className={
                    "text-xs font-semibold px-2 py-0.5 rounded-full " +
                    (p.stock <= 2 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600")
                  }>
                    {p.stock} uds
                  </span>
                  <Link
                    href={"/admin/productos/" + p.id}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimos pedidos */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900">Ultimos pedidos</h2>
            <Link href="/admin/pedidos" className="text-xs text-emerald-600 hover:text-emerald-800">
              Ver todos →
            </Link>
          </div>
          {ultimosPedidos.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Sin pedidos aun</p>
          ) : (
            <div className="space-y-0">
              {ultimosPedidos.map((pedido) => {
                const items = pedido.items as any[]
                return (
                  <div key={pedido.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Pedido #{pedido.id}</p>
                      <p className="text-xs text-gray-400">
                        {Array.isArray(items) ? items.length + ' producto' + (items.length !== 1 ? 's' : '') : ''}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      S/.{Number(pedido.total).toFixed(2)}
                    </p>
                    <span className={
                      "text-xs px-2 py-0.5 rounded-full font-medium " +
                      (pedido.estado === 'consultado' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600")
                    }>
                      {pedido.estado}
                    </span>
                    <p className="text-xs text-gray-400">{tiempoRelativo(pedido.createdAt)}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Acciones rápidas */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Acciones rapidas</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { href: "/admin/productos/nuevo", icon: "M12 5v14M5 12h14", bg: "bg-blue-50", stroke: "#2563EB", label: "Nuevo producto", sub: "Agregar al catalogo" },
            { href: "/admin/productos", icon: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", bg: "bg-amber-50", stroke: "#D97706", label: "Gestionar stock", sub: stockBajoProductos.length + " productos bajos" },
            { href: "/admin/pedidos", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", bg: "bg-emerald-50", stroke: "#059669", label: "Ver pedidos", sub: pedidosHoy + " pedidos hoy" },
            { href: "/", icon: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3", bg: "bg-purple-50", stroke: "#7C3AED", label: "Ver tienda", sub: "Abrir en nueva tab" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.label === "Ver tienda" ? "_blank" : undefined}
              className="flex flex-col items-center text-center p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all"
            >
              <div className={"w-10 h-10 rounded-xl flex items-center justify-center mb-2 " + item.bg}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.stroke} strokeWidth="2">
                  <path d={item.icon}/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}