import { prisma } from './db'
import { Prisma } from '@prisma/client'

export async function getProductos(params?: {
  categoriaSlug?: string
  busqueda?: string
}) {
  if (params?.busqueda) {
    const termino = params.busqueda.trim()
    const palabras = termino.split(/\s+/).filter(Boolean)

    try {
      const ids = await prisma.$queryRaw<{ id: number }[]>`
        SELECT DISTINCT p.id
        FROM "Producto" p
        INNER JOIN "Categoria" c ON p."categoriaId" = c.id
        WHERE p.activo = true
        AND (
          ${Prisma.join(
            palabras.map(palabra => Prisma.sql`(
              unaccent(lower(p.nombre)) ILIKE unaccent(lower(${'%' + palabra + '%'}))
              OR unaccent(lower(COALESCE(p.descripcion,''))) ILIKE unaccent(lower(${'%' + palabra + '%'}))
              OR unaccent(lower(COALESCE(p.voltaje,''))) ILIKE unaccent(lower(${'%' + palabra + '%'}))
              OR unaccent(lower(COALESCE(p.protocolo,''))) ILIKE unaccent(lower(${'%' + palabra + '%'}))
            )`),
            ' AND '
          )}
        )
        AND (${params.categoriaSlug
          ? Prisma.sql`c.slug = ${params.categoriaSlug}`
          : Prisma.sql`1=1`
        })
        LIMIT 50
      `

      if (ids.length === 0) return []

      return prisma.producto.findMany({
        where: { id: { in: ids.map(p => p.id) } },
        include: {
          categoria: true,
          imagenes: { orderBy: { orden: 'asc' } },
        },
      })
    } catch (error) {
      console.error('Error busqueda productos:', error)
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
    where: { productos: { some: { activo: true } } },
    orderBy: { nombre: 'asc' },
  })
}

export async function getProductosPorLinea(slugsCategorias: string[], params?: {
  busqueda?: string
}) {
  return prisma.producto.findMany({
    where: {
      activo: true,
      categoria: { slug: { in: slugsCategorias } },
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