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
    orderBy: { nombre: 'asc' },
  })
}