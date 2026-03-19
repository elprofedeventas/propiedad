import { TIPOS_PROPIEDAD, ESTADOS_PROPIEDAD } from './config'

export const fmtMoney = (v, symbol = '$') => {
  if (!v && v !== 0) return '—'
  return `${symbol} ${Number(v).toLocaleString('es-EC')}`
}

export const fmtMoneyK = (v, symbol = '$') => {
  if (!v && v !== 0) return '—'
  const n = Number(v)
  if (n >= 1000000) return `${symbol} ${(n / 1000000).toFixed(1)}M`
  if (n >= 1000)    return `${symbol} ${(n / 1000).toFixed(0)}K`
  return `${symbol} ${n.toLocaleString('es-EC')}`
}

export const fmtDate = (d) => {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const fmtDateShort = (d) => {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })
}

export const tipoIcon  = (t) => TIPOS_PROPIEDAD.find(x => x.id === t)?.icon  || '🏠'
export const tipoLabel = (t) => TIPOS_PROPIEDAD.find(x => x.id === t)?.label || t

export const estadoColor = (e) => ESTADOS_PROPIEDAD.find(x => x.id === e)?.color || '#5A5248'
export const estadoLabel = (e) => ESTADOS_PROPIEDAD.find(x => x.id === e)?.label || e

export const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

export const today = () => new Date().toISOString().slice(0, 10)

// WhatsApp link
export const waLink = (tel, msg = '') => {
  const num = tel.replace(/\D/g, '')
  const encoded = encodeURIComponent(msg)
  return `https://wa.me/${num}${msg ? `?text=${encoded}` : ''}`
}
