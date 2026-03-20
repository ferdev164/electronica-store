'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from './ImageUploader'

interface Categoria {
  id: number
  nombre: string
}

interface ImagenSubida {
  url: string
  alt: string
}

interface ProductoFormData {
  nombre: string
  descripcion: string
  precio: string
  stock: string
  voltaje: string
  protocolo: string
  tipo_salida: string
  pdf_url: string
  categoriaId: string
  activo: boolean
  imagenes: ImagenSubida[]
}

interface Props {
  categorias: Categoria[]
  productoInicial?: Partial<ProductoFormData> & { id?: number }
}

const formInicial: ProductoFormData = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  voltaje: '',
  protocolo: '',
  tipo_salida: '',
  pdf_url: '',
  categoriaId: '',
  activo: true,
  imagenes: [],
}

export default function ProductoForm({ categorias, productoInicial }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<ProductoFormData>({
    ...formInicial,
    ...productoInicial,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const url = productoInicial?.id
      ? '/api/admin/productos/' + productoInicial.id
      : '/api/admin/productos'

    const method = productoInicial?.id ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        categoriaId: parseInt(form.categoriaId),
      }),
    })

    if (!res.ok) {
      setError('Error al guardar el producto')
      setLoading(false)
      return
    }

    router.push('/admin/productos')
    router.refresh()
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
  const labelClass = "block text-sm text-gray-600 mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Nombre del producto</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} required className={inputClass} placeholder="Sensor Ultrasonico HC-SR04" />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Descripcion</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} className={inputClass} placeholder="Descripcion tecnica del producto..." />
        </div>

        <div>
          <label className={labelClass}>Precio (S/.)</label>
          <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} required className={inputClass} placeholder="8.50" />
        </div>

        <div>
          <label className={labelClass}>Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} required className={inputClass} placeholder="50" />
        </div>

        <div>
          <label className={labelClass}>Categoria</label>
          <select name="categoriaId" value={form.categoriaId} onChange={handleChange} required className={inputClass}>
            <option value="">Seleccionar...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Voltaje</label>
          <input name="voltaje" value={form.voltaje} onChange={handleChange} className={inputClass} placeholder="5V / 3.3V-5V / 12V" />
        </div>

        <div>
          <label className={labelClass}>Protocolo</label>
          <input name="protocolo" value={form.protocolo} onChange={handleChange} className={inputClass} placeholder="I2C / SPI / UART / GPIO" />
        </div>

        <div>
          <label className={labelClass}>Tipo de salida</label>
          <input name="tipo_salida" value={form.tipo_salida} onChange={handleChange} className={inputClass} placeholder="Digital / Analogico / PWM" />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>URL Datasheet PDF (opcional)</label>
          <input name="pdf_url" value={form.pdf_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Imagenes</label>
          <ImageUploader
            imagenes={form.imagenes}
            onChange={(imagenes) => setForm((prev) => ({ ...prev, imagenes }))}
          />
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            name="activo"
            id="activo"
            checked={form.activo}
            onChange={handleChange}
            className="rounded"
          />
          <label htmlFor="activo" className="text-sm text-gray-600">Producto activo (visible en el catalogo)</label>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/productos')}
          className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
        >
          {loading ? 'Guardando...' : productoInicial?.id ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}