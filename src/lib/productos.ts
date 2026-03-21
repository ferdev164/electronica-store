import { prisma } from './db'

export async function getProductos(params?: {
  categoriaSlug?: string
  busqueda?: string
}) {
  return prisma.producto.findMany({
    where: {
      activo: true,
      ...(params?.categoriaSlug && {
        categoria: { slug: params.categoriaSlug },
      }),
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