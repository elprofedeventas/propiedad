import { useState, useEffect, useCallback } from 'react'
import {
  apiGetPropiedades, apiSavePropiedad, apiDeletePropiedad,
  apiGetClientes,    apiSaveCliente,   apiDeleteCliente,
  apiGetOperaciones, apiSaveOperacion, apiDeleteOperacion,
} from '../utils/api'
import { genId, today } from '../utils/helpers'

// ── DEMO DATA ─────────────────────────────────────────────────────────────────
// Se usa cuando no hay conexión a Sheets o la URL no está configurada.
const DEMO_PROPIEDADES = [
  { id: 'p1', tipo: 'departamento', direccion: 'Av. Libertador 4520, 8B', barrio: 'Palermo', sup: 72, hab: 2, op: 'alquiler', precio: 1200, estado: 'disponible', propietario: 'Carlos Méndez', propietarioTel: '0991234567', comision: 3, fotoUrl: '', fechaCaptacion: '2025-02-15', notas: 'Luminoso, cochera incluida' },
  { id: 'p2', tipo: 'casa',         direccion: 'Thames 1234',             barrio: 'Almagro',  sup: 180, hab: 4, op: 'venta',    precio: 195000, estado: 'reservada', propietario: 'Lucía Torres', propietarioTel: '0987654321', comision: 3, fotoUrl: '', fechaCaptacion: '2025-01-20', notas: 'Terreno 8x22, jardín' },
  { id: 'p3', tipo: 'local',        direccion: 'Corrientes 5678, PB',     barrio: 'Centro',   sup: 45,  hab: 0, op: 'alquiler', precio: 800, estado: 'disponible', propietario: 'Inversiones XYZ', propietarioTel: '0976543210', comision: 5, fotoUrl: '', fechaCaptacion: '2025-03-01', notas: '' },
  { id: 'p4', tipo: 'departamento', direccion: 'Cabello 3200, 3A',        barrio: 'Palermo',  sup: 55,  hab: 2, op: 'venta',    precio: 115000, estado: 'disponible', propietario: 'Roberto Gómez', propietarioTel: '0965432109', comision: 3, fotoUrl: '', fechaCaptacion: '2025-03-05', notas: 'Reciclado 2023' },
  { id: 'p5', tipo: 'terreno',      direccion: 'Los Álamos 200',          barrio: 'Norte',    sup: 500, hab: 0, op: 'venta',    precio: 60000, estado: 'captada', propietario: 'Ana Suárez', propietarioTel: '0954321098', comision: 4, fotoUrl: '', fechaCaptacion: '2025-02-28', notas: 'Escritura lista' },
]

const DEMO_CLIENTES = [
  { id: 'c1', nombre: 'Roberto Sánchez', tel: '0991111111', mail: 'rsanchez@mail.com', tipo: 'comprador', presupuesto: 150000, busca: 'Departamento 3 amb Palermo/Belgrano', notas: 'Urgente, viaja en 2 meses' },
  { id: 'c2', nombre: 'Ana González',    tel: '0992222222', mail: 'agonzalez@corp.com', tipo: 'inquilino', presupuesto: 1500, busca: '2 amb zona norte, acepta mascotas', notas: '' },
  { id: 'c3', nombre: 'Martina López',   tel: '0993333333', mail: 'martina@gmail.com',  tipo: 'inquilino', presupuesto: 1000, busca: 'PH o casa chica con patio', notas: 'Solo fin de semana' },
  { id: 'c4', nombre: 'Inv. Sur SA',     tel: '0994444444', mail: 'info@invsur.com',    tipo: 'inversor',  presupuesto: 500000, busca: 'Local o galpón logístico', notas: 'Empresa' },
]

const DEMO_OPERACIONES = [
  { id: 'o1', propId: 'p1', clienteId: 'c2', etapa: 'negociacion', tipo: 'alquiler', monto: 1100, fecha: '2025-03-10', notas: 'Contraoferta enviada' },
  { id: 'o2', propId: 'p2', clienteId: 'c4', etapa: 'reserva',     tipo: 'venta',    monto: 188000, fecha: '2025-03-05', notas: 'Seña recibida' },
  { id: 'o3', propId: 'p4', clienteId: 'c1', etapa: 'activa',      tipo: 'venta',    monto: 115000, fecha: '2025-03-12', notas: 'Visita 15/3' },
  { id: 'o4', propId: 'p3', clienteId: 'c3', etapa: 'cerrada',     tipo: 'alquiler', monto: 800, fecha: '2025-02-20', notas: 'Contrato firmado' },
]

// ── HOOK ──────────────────────────────────────────────────────────────────────
const USE_DEMO = !import.meta.env.VITE_GAS_URL

export function useData() {
  const [propiedades,  setPropiedades]  = useState([])
  const [clientes,     setClientes]     = useState([])
  const [operaciones,  setOperaciones]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [isDemo,       setIsDemo]       = useState(false)

  // ── Load ──
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    if (USE_DEMO) {
      setPropiedades(DEMO_PROPIEDADES)
      setClientes(DEMO_CLIENTES)
      setOperaciones(DEMO_OPERACIONES)
      setIsDemo(true)
      setLoading(false)
      return
    }
    try {
      const [p, c, o] = await Promise.all([
        apiGetPropiedades(),
        apiGetClientes(),
        apiGetOperaciones(),
      ])
      setPropiedades(p.data || [])
      setClientes(c.data || [])
      setOperaciones(o.data || [])
    } catch (e) {
      setError(e.message)
      // fallback a demo
      setPropiedades(DEMO_PROPIEDADES)
      setClientes(DEMO_CLIENTES)
      setOperaciones(DEMO_OPERACIONES)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // ── Propiedades ──
  const savePropiedad = async (form) => {
    const isNew = !form.id
    const item  = isNew ? { ...form, id: genId(), fechaCaptacion: form.fechaCaptacion || today() } : form
    setPropiedades(prev => isNew ? [...prev, item] : prev.map(p => p.id === item.id ? item : p))
    if (!USE_DEMO && !isDemo) {
      try { await apiSavePropiedad(item) } catch (e) { console.error(e) }
    }
    return item
  }

  const deletePropiedad = async (id) => {
    setPropiedades(prev => prev.filter(p => p.id !== id))
    if (!USE_DEMO && !isDemo) {
      try { await apiDeletePropiedad(id) } catch (e) { console.error(e) }
    }
  }

  // ── Clientes ──
  const saveCliente = async (form) => {
    const isNew = !form.id
    const item  = isNew ? { ...form, id: genId() } : form
    setClientes(prev => isNew ? [...prev, item] : prev.map(c => c.id === item.id ? item : c))
    if (!USE_DEMO && !isDemo) {
      try { await apiSaveCliente(item) } catch (e) { console.error(e) }
    }
    return item
  }

  const deleteCliente = async (id) => {
    setClientes(prev => prev.filter(c => c.id !== id))
    if (!USE_DEMO && !isDemo) {
      try { await apiDeleteCliente(id) } catch (e) { console.error(e) }
    }
  }

  // ── Operaciones ──
  const saveOperacion = async (form) => {
    const isNew = !form.id
    const item  = isNew ? { ...form, id: genId(), fecha: form.fecha || today() } : form
    setOperaciones(prev => isNew ? [...prev, item] : prev.map(o => o.id === item.id ? item : o))
    if (!USE_DEMO && !isDemo) {
      try { await apiSaveOperacion(item) } catch (e) { console.error(e) }
    }
    return item
  }

  const deleteOperacion = async (id) => {
    setOperaciones(prev => prev.filter(o => o.id !== id))
    if (!USE_DEMO && !isDemo) {
      try { await apiDeleteOperacion(id) } catch (e) { console.error(e) }
    }
  }

  return {
    propiedades, clientes, operaciones,
    loading, error, isDemo, reload: load,
    savePropiedad,   deletePropiedad,
    saveCliente,     deleteCliente,
    saveOperacion,   deleteOperacion,
  }
}
