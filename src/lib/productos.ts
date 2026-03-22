import { prisma } from './db'

import { Prisma } from '@prisma/client'

export async function getProductos(params?: {
  categoriaSlug?: string
  busqueda?: string
}) {
  if (params?.busqueda) {
    const termino = params.busqueda.trim()
    const terminoLike = '%' + termino + '%'

    try {
      const palabras = termino.split(/\s+/).filter(Boolean)
      const terminoLike = '%' + termino + '%'

      const ids = await prisma.$queryRaw<{ id: number }[]>`
        SELECT DISTINCT p.id,
          GREATEST(
            similarity(p.nombre, ${termino}),
            CASE WHEN p.nombre ILIKE ${terminoLike} THEN 1.0 ELSE 0 END
          ) as relevancia
        FROM "Producto" p
        INNER JOIN "Categoria" c ON p."categoriaId" = c.id
        WHERE p.activo = true
          AND (
            p.nombre ILIKE ${terminoLike}
            OR COALESCE(p.descripcion, '') ILIKE ${terminoLike}
            OR COALESCE(p.voltaje, '') ILIKE ${terminoLike}
            OR COALESCE(p.protocolo, '') ILIKE ${terminoLike}
            OR similarity(p.nombre, ${termino}) > 0.1
          )
          AND (${params.categoriaSlug
            ? Prisma.sql`c.slug = ${params.categoriaSlug}`
            : Prisma.sql`1=1`
          })
        ORDER BY relevancia DESC
        LIMIT 50
      `

      const idsSimples = ids.map((p) => p.id)

      const porPalabras = await prisma.producto.findMany({
        where: {
          activo: true,
          AND: palabras.map((palabra) => ({
            OR: [
              { nombre: { contains: palabra, mode: 'insensitive' as const } },
              { descripcion: { contains: palabra, mode: 'insensitive' as const } },
              { voltaje: { contains: palabra, mode: 'insensitive' as const } },
              { protocolo: { contains: palabra, mode: 'insensitive' as const } },
            ],
          })),
          ...(params.categoriaSlug && {
            categoria: { slug: params.categoriaSlug },
          }),
        },
        select: { id: true },
      })

      const todoIds = [...new Set([...idsSimples, ...porPalabras.map(p => p.id)])]
      if (todoIds.length === 0) return []

      return prisma.producto.findMany({
        where: { id: { in: todoIds } },
        include: {
          categoria: true,
          imagenes: { orderBy: { orden: 'asc' } },
        },
      })
    } catch {
      return prisma.producto.findMany({
        where: {
          activo: true,
          ...(params.categoriaSlug && {
            categoria: { slug: params.categoriaSlug },
          }),
          OR: [
            { nombre: { contains: termino, mode: 'insensitive' } },
            { descripcion: { contains: termino, mode: 'insensitive' } },
            { voltaje: { contains: termino, mode: 'insensitive' } },
            { protocolo: { contains: termino, mode: 'insensitive' } },
          ],
        },
        include: {
          categoria: true,
          imagenes: { orderBy: { orden: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      })
    }
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