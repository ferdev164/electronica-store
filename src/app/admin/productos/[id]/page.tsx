import { prisma } from '@/lib/db'
import ProductoForm from '@/components/ProductoForm'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params

  const [producto, categorias] = await Promise.all([
    prisma.producto.findUnique({
      where: { id: Number(id) },
      include: { imagenes: true, categoria: true },
    }),
    prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
      select: { id: true, nombre: true, slug: true },
    }),
  ])

  if (!producto) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Editar producto</h1>
      <ProductoForm
        categorias={categorias}
        productoInicial={{
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion || '',
          precio: Number(producto.precio).toString(),
          stock: producto.stock.toString(),
          voltaje: producto.voltaje || '',
          protocolo: producto.protocolo || '',
          tipo_salida: producto.tipo_salida || '',
          pdf_url: producto.pdf_url || '',
          categoriaId: producto.categoriaId.toString(),
          activo: producto.activo,
          imagenes: producto.imagenes.map((img) => ({
            url: img.url,
            alt: img.alt || '',
          })),
        }}
      />
    </div>
  )
}