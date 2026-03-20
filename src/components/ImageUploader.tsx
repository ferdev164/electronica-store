'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImagenSubida {
  url: string
  alt: string
}

interface Props {
  imagenes: ImagenSubida[]
  onChange: (imagenes: ImagenSubida[]) => void
}

export default function ImageUploader({ imagenes, onChange }: Props) {
  const [subiendo, setSubiendo] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setSubiendo(true)

    const nuevasImagenes: ImagenSubida[] = []

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '')

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/' +
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
          '/image/upload',
        { method: 'POST', body: formData }
      )

      const data = await res.json()
      nuevasImagenes.push({ url: data.secure_url, alt: file.name.replace(/\.[^.]+$/, '') })
    }

    onChange([...imagenes, ...nuevasImagenes])
    setSubiendo(false)
  }

  const handleRemove = (index: number) => {
    onChange(imagenes.filter((_, i) => i !== index))
  }

  const handleAltChange = (index: number, alt: string) => {
    onChange(imagenes.map((img, i) => (i === index ? { ...img, alt } : img)))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {imagenes.map((img, index) => (
          <div key={index} className="relative group">
            <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-contain p-1"
              />
            </div>
            <input
              type="text"
              value={img.alt}
              onChange={(e) => handleAltChange(index, e.target.value)}
              placeholder="Descripcion"
              className="w-24 mt-1 text-xs border border-gray-200 rounded px-1 py-0.5 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              x
            </button>
          </div>
        ))}

        <label className={`w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${subiendo ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <span className="text-2xl text-gray-300">+</span>
          <span className="text-xs text-gray-400 mt-1">
            {subiendo ? 'Subiendo...' : 'Agregar'}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={subiendo}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )
}