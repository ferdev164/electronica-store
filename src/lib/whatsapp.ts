import { CartItem } from '@/store/cartStore'

export function generarMensajePedido(items: CartItem[]): string {
  const lineas = items.map(
    (item) =>
      item.cantidad +
      'x ' +
      item.nombre +
      ' — S/.' +
      (item.precio * item.cantidad).toFixed(2)
  )

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

  const mensaje =
    'Hola! Te envio mi pedido desde la tienda:\n\n' +
    lineas.join('\n') +
    '\n\nTotal referencial: S/.' +
    total.toFixed(2) +
    '\n\nQuedo a la espera de confirmacion de stock y precio final. Gracias :")!'

  return mensaje
}

export function generarUrlWhatsApp(mensaje: string): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensaje)
}