import React, { useState } from 'react'
import { Input, Select, Textarea, Btn } from './UI'
import { TIPOS_CLIENTE } from '../utils/config'

const blank = { nombre: '', tel: '', mail: '', tipo: 'comprador', presupuesto: '', busca: '', notas: '' }

export default function ClienteForm({ initial, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(initial || blank)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.nombre.trim()) return alert('El nombre es obligatorio')
    setSaving(true)
    await onSave(form)
    setSaving(false)
    onClose()
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este cliente?')) return
    await onDelete(form.id)
    onClose()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input label="Nombre / Razón social" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Teléfono" type="tel" value={form.tel} onChange={e => set('tel', e.target.value)} />
        <Input label="Email" type="email" value={form.mail} onChange={e => set('mail', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Select label="Tipo" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
          {TIPOS_CLIENTE.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </Select>
        <Input label="Presupuesto (USD)" type="number" value={form.presupuesto} onChange={e => set('presupuesto', e.target.value)} />
      </div>
      <Textarea label="Qué busca" value={form.busca} onChange={e => set('busca', e.target.value)} placeholder="Tipo, zona, m², características clave..." />
      <Textarea label="Notas" value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Observaciones adicionales..." />

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        {initial?.id && <Btn variant="danger" onClick={handleDelete} style={{ flex: '0 0 auto' }}>Eliminar</Btn>}
        <Btn variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancelar</Btn>
        <Btn variant="primary" onClick={handleSave} disabled={saving} style={{ flex: 2 }}>
          {saving ? 'Guardando...' : initial?.id ? 'Guardar cambios' : 'Agregar cliente'}
        </Btn>
      </div>
    </div>
  )
}
