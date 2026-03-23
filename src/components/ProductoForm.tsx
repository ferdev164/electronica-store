'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from './ImageUploader'

interface Categoria {
  id: number
  nombre: string
  slug: string
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

const LINEAS_CATEGORIAS: Record<string, string[]> = {
  'Control Industrial': ['microcontroladores', 'drivers-controladores', 'sensores', 'modulos-rele', 'displays-pantallas'],
  'Electricidad': ['fuentes-alimentacion', 'cables-conectores', 'herramientas-accesorios'],
  'Redes Industriales & IoT': ['modulos-comunicacion', 'comunicacion'],
}

const VOLTAJES_COMUNES = ['3.3V', '5V', '12V', '24V', '3.3V-5V', '5V-12V', '12V-24V', '110V AC', '220V AC']
const PROTOCOLOS_COMUNES = ['GPIO', 'I2C', 'SPI', 'UART', 'WiFi', 'Bluetooth', 'LoRa', 'Modbus', 'Profibus', 'MQTT', 'RS485', 'CAN']
const SALIDAS_COMUNES = ['Digital', 'Analogico', 'PWM', 'Relay', 'NPN', 'PNP', 'Push-Pull']

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

const generarSlug = (texto: string) =>
  texto.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim()

export default function ProductoForm({ categorias, productoInicial }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<ProductoFormData>({
    ...formInicial,
    ...productoInicial,
  })
  const [lineaSeleccionada, setLineaSeleccionada] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [guardadoBorrador, setGuardadoBorrador] = useState(false)

  const categoriasFiltradas = lineaSeleccionada
    ? categorias.filter(cat =>
        LINEAS_CATEGORIAS[lineaSeleccionada]?.includes(cat.slug)
      )
    : categorias

  useEffect(() => {
    if (productoInicial?.categoriaId) {
      const cat = categorias.find(c => c.id === Number(productoInicial.categoriaId))
      if (cat) {
        const linea = Object.entries(LINEAS_CATEGORIAS).find(([, slugs]) =>
          slugs.includes(cat.slug)
        )
        if (linea) setLineaSeleccionada(linea[0])
      }
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nombre = e.target.value
    setForm((prev) => ({ ...prev, nombre }))
  }

  const handleLineaChange = (linea: string) => {
    setLineaSeleccionada(linea)
    setForm((prev) => ({ ...prev, categoriaId: '' }))
  }

  const handleGuardarBorrador = () => {
    localStorage.setItem('borrador_producto', JSON.stringify(form))
    setGuardadoBorrador(true)
    setTimeout(() => setGuardadoBorrador(false), 2000)
  }

  const handleCargarBorrador = () => {
    const borrador = localStorage.getItem('borrador_producto')
    if (borrador) {
      setForm(JSON.parse(borrador))
    }
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

    localStorage.removeItem('borrador_producto')
    router.push('/admin/productos')
    router.refresh()
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 transition-colors"
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide"

  const hasBorrador = typeof window !== 'undefined' && !!localStorage.getItem('borrador_producto')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Borrador */}
      {!productoInicial?.id && (
        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5">
          <p className="text-xs text-gray-400">Guarda un borrador para continuar despues</p>
          <div className="flex items-center gap-3">
            {hasBorrador && (
              <button type="button" onClick={handleCargarBorrador} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Cargar borrador
              </button>
            )}
            <button type="button" onClick={handleGuardarBorrador} className="text-xs text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1 rounded-md hover:bg-white transition-colors">
              {guardadoBorrador ? 'Guardado' : 'Guardar borrador'}
            </button>
          </div>
        </div>
      )}

      {/* Sección 1: Identificación */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4 pb-3 border-b border-gray-50">
          Informacion basica
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Nombre del producto</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleNombreChange}
              required
              className={inputClass}
              placeholder="Sensor Ultrasonico HC-SR04"
            />
            {form.nombre && (
              <p className="text-xs text-gray-400 mt-1">
                Slug: <span className="font-mono text-gray-600">{generarSlug(form.nombre)}</span>
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Descripcion tecnica</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className={inputClass}
              placeholder="Describe las caracteristicas tecnicas, aplicaciones y ventajas del producto..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Precio (S/.)</label>
              <input
                name="precio"
                type="number"
                step="0.01"
                min="0"
                value={form.precio}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelClass}>Stock inicial</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección 2: Clasificación */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4 pb-3 border-b border-gray-50">
          Clasificacion
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Linea de negocio</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(LINEAS_CATEGORIAS).map((linea) => (
                <button
                  key={linea}
                  type="button"
                  onClick={() => handleLineaChange(linea)}
                  className={
                    "px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left " +
                    (lineaSeleccionada === linea
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50')
                  }
                >
                  {linea}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Categoria</label>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              required
              className={inputClass}
              disabled={!lineaSeleccionada && !productoInicial?.id}
            >
              <option value="">
                {lineaSeleccionada ? 'Seleccionar categoria...' : 'Primero selecciona una linea'}
              </option>
              {categoriasFiltradas.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sección 3: Specs técnicas */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4 pb-3 border-b border-gray-50">
          Especificaciones tecnicas
          <span className="text-xs text-gray-400 font-normal ml-2">(opcional pero recomendado)</span>
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Voltaje</label>
            <select
              name="voltaje"
              value={form.voltaje}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Seleccionar...</option>
              {VOLTAJES_COMUNES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
              <option value="custom">Otro...</option>
            </select>
            {form.voltaje === 'custom' && (
              <input
                name="voltaje"
                onChange={handleChange}
                className={inputClass + " mt-2"}
                placeholder="Ej: 9V"
                autoFocus
              />
            )}
          </div>
          <div>
            <label className={labelClass}>Protocolo</label>
            <select
              name="protocolo"
              value={form.protocolo}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Seleccionar...</option>
              {PROTOCOLOS_COMUNES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="custom">Otro...</option>
            </select>
            {form.protocolo === 'custom' && (
              <input
                name="protocolo"
                onChange={handleChange}
                className={inputClass + " mt-2"}
                placeholder="Ej: OneWire"
                autoFocus
              />
            )}
          </div>
          <div>
            <label className={labelClass}>Tipo de salida</label>
            <select
              name="tipo_salida"
              value={form.tipo_salida}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Seleccionar...</option>
              {SALIDAS_COMUNES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="custom">Otro...</option>
            </select>
            {form.tipo_salida === 'custom' && (
              <input
                name="tipo_salida"
                onChange={handleChange}
                className={inputClass + " mt-2"}
                placeholder="Ej: 4-20mA"
                autoFocus
              />
            )}
          </div>
        </div>
      </div>

      {/* Sección 4: Recursos */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4 pb-3 border-b border-gray-50">
          Imagenes y recursos
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Imagenes del producto</label>
            <ImageUploader
              imagenes={form.imagenes}
              onChange={(imagenes) => setForm((prev) => ({ ...prev, imagenes }))}
            />
          </div>
          <div>
            <label className={labelClass}>URL Datasheet PDF</label>
            <input
              name="pdf_url"
              value={form.pdf_url}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://cloudinary.com/..."
            />
            <p className="text-xs text-gray-400 mt-1">Sube el PDF a Cloudinary y pega la URL aqui</p>
          </div>
        </div>
      </div>

      {/* Estado */}
      <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-5 py-4">
        <input
          type="checkbox"
          name="activo"
          id="activo"
          checked={form.activo}
          onChange={handleChange}
          className="w-4 h-4 rounded"
        />
        <div>
          <label htmlFor="activo" className="text-sm font-medium text-gray-900 cursor-pointer">
            Producto activo
          </label>
          <p className="text-xs text-gray-400">Visible en el catalogo para los clientes</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/productos')}
          className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-2 px-8 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
        >
          {loading ? 'Guardando...' : productoInicial?.id ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>

    </form>
  )
}