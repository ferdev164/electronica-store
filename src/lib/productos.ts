import { prisma } from './db'

import { Prisma } from '@prisma/client'

export async function getProductos(params?: {
  categoriaSlug?: string
  busqueda?: string
}) {
  if (params?.busqueda) {
    const termino = params.busqueda.trim()
    const productos = await prisma.$queryRaw`
      SELECT p.*, 
        similarity(p.nombre, ${termino}) as sim_nombre,
        similarity(COALESCE(p.descripcion, ''), ${termino}) as sim_desc
      FROM "Producto" p
      INNER JOIN "Categoria" c ON p."categoriaId" = c.id
      WHERE p.activo = true
        AND (
          p.nombre ILIKE ${'%' + termino + '%'}
          OR COALESCE(p.descripcion, '') ILIKE ${'%' + termino + '%'}
          OR similarity(p.nombre, ${termino}) > 0.1
          OR similarity(COALESCE(p.descripcion, ''), ${termino}) > 0.1
        )
        ${params.categoriaSlug ? Prisma.sql`AND c.slug = ${params.categoriaSlug}` : Prisma.empty}
      ORDER BY sim_nombre DESC, sim_desc DESC
      LIMIT 50
    `

    const ids = (productos as any[]).map((p) => p.id)
    if (ids.length === 0) return []

    return prisma.producto.findMany({
      where: { id: { in: ids }, activo: true },
      include: {
        categoria: true,
        imagenes: { orderBy: { orden: 'asc' } },
      },
    })
  }

  return prisma.producto.findMany({
    where: {
      activo: true,
      ...(params?.categoriaSlug && {
        categoria: { slug: params.categoriaSlug },
      }),
    },
    include: {
      categoria: true,
      imagenes: { orderBy: { orden: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProductoBySlug(slug: string) {
  return prisma.producto.findUnique({
    where: { slug },
    include: {
      categoria: true,
      imagenes: { orderBy: { orden: 'asc' } },
    },
  })
}

export async function getCategorias() {
  return prisma.categoria.findMany({
    where: {
      productos: {
        some: {
          activo: true,
        },
      },
    },
    orderBy: { nombre: 'asc' },
  })
}
// Catalogo de por cada linea
export async function getProductosPorLinea(slugsCategorias: string[], params?: {
  busqueda?: string
}) {
  return prisma.producto.findMany({
    where: {
      activo: true,
      categoria: {
        slug: { in: slugsCategorias },
      },
      ...(params?.busqueda && {
        OR: [
          { nombre: { contains: params.busqueda, mode: 'insensitive' } },
          { descripcion: { contains: params.busqueda, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      categoria: true,
      imagenes: { orderBy: { orden: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getCategoriasPorLinea(slugsCategorias: string[]) {
  return prisma.categoria.findMany({
    where: {
      slug: { in: slugsCategorias },
      productos: { some: { activo: true } },
    },
    orderBy: { nombre: 'asc' },
  })
}

// 
export async function getProductosRelacionados(productoId: number, categoriaId: number) {
  return prisma.producto.findMany({
    where: {
      activo: true,
      categoriaId,
      id: { not: productoId },
    },
    include: {
      categoria: true,
      imagenes: { orderBy: { orden: 'asc' } },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })
}