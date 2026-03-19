export interface Producto {
  id: number
  nombre: string
  slug: string
  descripcion: string | null
  precio: number
  stock: number
  voltaje: string | null
  protocolo: string | null
  tipo_salida: string | null
  pdf_url: string | null
  activo: boolean
  categoria: Categoria
  imagenes: ImagenProducto[]
}

export interface Categoria {
  id: number
  nombre: string
  slug: string
}

export interface ImagenProducto {
  id: number
  url: string
  alt: string | null
  orden: number
}

export interface CartItem {
  producto: Producto
  cantidad: number
}