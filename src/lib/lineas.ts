export const LINEAS = {
  control: {
    nombre: 'Automatizacion & Control',
    descripcion: 'PLCs, HMIs, variadores, sensores industriales y tableros de control',
    color: 'blue',
    slugs: ['microcontroladores', 'drivers-controladores', 'sensores', 'modulos-rele', 'displays-pantallas'],
  },
  electricidad: {
    nombre: 'Electricidad',
    descripcion: 'Fuentes industriales, contactores, reles, breakers y distribucion electrica',
    color: 'amber',
    slugs: ['fuentes-alimentacion', 'cables-conectores', 'herramientas-accesorios'],
  },
  redes: {
    nombre: 'Redes Industriales & IoT',
    descripcion: 'Equipos multiprotocolo, Modbus, Profibus, MQTT y monitoreo remoto',
    color: 'emerald',
    slugs: ['modulos-comunicacion'],
  },
} as const

export type LineaKey = keyof typeof LINEAS