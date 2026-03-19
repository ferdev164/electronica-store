import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  nombre: string
  precio: number
  imagen: string
  slug: string
  stock: number
  cantidad: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (producto: Omit<CartItem, 'cantidad'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, cantidad: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  totalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (producto) => {
        const items = get().items
        const existe = items.find((i) => i.id === producto.id)
        if (existe) {
          if (existe.cantidad >= existe.stock) return
          set({
            items: items.map((i) =>
              i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
            ),
            isOpen: true,
          })
        } else {
          set({ items: [...items, { ...producto, cantidad: 1 }], isOpen: true })
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, cantidad) => {
        if (cantidad < 1) return
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total: () => get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
    }),
    { name: 'carrito' }
  )
)