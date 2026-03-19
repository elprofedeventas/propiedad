import React, { useState } from 'react'
import { Input, Select, Textarea, Btn } from './UI'
import { ETAPAS, TIPOS_OPERACION } from '../utils/config'
import { tipoIcon, today } from '../utils/helpers'

const blank = { propId: '', clienteId: '', etapa: 'prospecto', tipo: 'alquiler', monto: '', fecha: today(), notas: '' }

export default function OperacionForm({ initial, propiedades, clientes, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(initial || { ...blank, propId: propiedades[0]?.id || '', clienteId: clientes[0]?.id || '' })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.propId || !form.clienteId) return alert('Selecciona propiedad y cliente')
    setSaving(true)
    await onSave(form)
    setSaving(false)
    onClose()
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta operación?')) return
    await onDelete(form.id)
    onClose()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Select label="Propiedad" value={form.propId} onChange={e => set('propId', e.target.value)}>
        <option value="">— Seleccionar —</option>
        {propiedades.map(p => <option key={p.id} value={p.id}>{tipoIcon(p.tipo)} {p.direccion}</option>)}
      </Select>

      <Select label="Cliente" value={form.clienteId} onChange={e => set('clienteId', e.target.value)}>
        <option value="">— Seleccionar —</option>
        {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
      </Select>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Select label="Tipo" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
          {TIPOS_OPERACION.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </Select>
        <Select label="Etapa" value={form.etapa} onChange={e => set('etapa', e.target.value)}>
          {ETAPAS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
        </Select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Monto acordado (USD)" type="number" value={form.monto} onChange={e => set('monto', e.target.value)} />
        <Input label="Fecha" type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} />
      </div>

      <Textarea label="Notas" value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Estado de la negociación..." />

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        {initial?.id && <Btn variant="danger" onClick={handleDelete} style={{ flex: '0 0 auto' }}>Eliminar</Btn>}
        <Btn variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancelar</Btn>
        <Btn variant="primary" onClick={handleSave} disabled={saving} style={{ flex: 2 }}>
          {saving ? 'Guardando...' : initial?.id ? 'Guardar cambios' : 'Crear operación'}
        </Btn>
      </div>
    </div>
  )
}
