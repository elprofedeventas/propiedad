// ─── CONFIGURACIÓN CENTRAL ───────────────────────────────────────────────────
// Cambia SHEET_URL con la URL de tu Web App de Google Apps Script desplegada.
// Formato: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

export const CONFIG = {
  APP_NAME: 'PROPIEDAD',
  AGENT_NAME: 'Agente',           // Cambia por tu nombre
  MONEDA: 'USD',
  MONEDA_SIMBOLO: '$',
  SHEET_URL: import.meta.env.VITE_GAS_URL || '',
}

export const TIPOS_PROPIEDAD = [
  { id: 'departamento', label: 'Departamento',      icon: '🏢' },
  { id: 'casa',         label: 'Casa',              icon: '🏡' },
  { id: 'ph',           label: 'PH',                icon: '🏠' },
  { id: 'local',        label: 'Local comercial',   icon: '🏪' },
  { id: 'oficina',      label: 'Oficina',           icon: '🏛️' },
  { id: 'galpon',       label: 'Galpón / Industrial',icon: '🏭' },
  { id: 'terreno',      label: 'Terreno',           icon: '🌿' },
  { id: 'cochera',      label: 'Cochera',           icon: '🚗' },
]

export const ESTADOS_PROPIEDAD = [
  { id: 'captada',     label: 'Captada',    color: '#5A5248' },
  { id: 'disponible',  label: 'Disponible', color: '#3D7A5E' },
  { id: 'reservada',   label: 'Reservada',  color: '#B8960C' },
  { id: 'alquilada',   label: 'Alquilada',  color: '#3B82B4' },
  { id: 'vendida',     label: 'Vendida',    color: '#1A1612' },
]

export const TIPOS_OPERACION = [
  { id: 'alquiler', label: 'Alquiler' },
  { id: 'venta',    label: 'Venta'    },
]

export const ETAPAS = [
  { id: 'prospecto',   label: 'Prospecto'   },
  { id: 'activa',      label: 'Activa'      },
  { id: 'negociacion', label: 'Negociación' },
  { id: 'reserva',     label: 'Reserva'     },
  { id: 'cerrada',     label: 'Cerrada'     },
]

export const TIPOS_CLIENTE = [
  { id: 'comprador', label: 'Comprador' },
  { id: 'inquilino', label: 'Inquilino' },
  { id: 'inversor',  label: 'Inversor'  },
]
