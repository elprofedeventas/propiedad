import React, { useState } from 'react'
import { Input, Select, Textarea, Btn, Divider } from './UI'
import { TIPOS_PROPIEDAD, ESTADOS_PROPIEDAD, TIPOS_OPERACION } from '../utils/config'
import { today } from '../utils/helpers'

const blank = {
  tipo: 'departamento', direccion: '', barrio: '', sup: '', hab: '',
  op: 'alquiler', precio: '', estado: 'disponible',
  propietario: '', propietarioTel: '', comision: 3,
  fotoUrl: '', fechaCaptacion: today(), notas: ''
}

export default function PropiedadForm({ initial, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(initial || blank)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.direccion.trim()) return alert('La dirección es obligatoria')
    setSaving(true)
    await onSave(form)
    setSaving(false)
    onClose()
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta propiedad?')) return
    await onDelete(form.id)
    onClose()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Tipo + Operación */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Select label="Tipo" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
          {TIPOS_PROPIEDAD.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
        </Select>
        <Select label="Operación" value={form.op} onChange={e => set('op', e.target.value)}>
          {TIPOS_OPERACION.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </Select>
      </div>

      <Input label="Dirección completa" value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Calle 1234, Piso/Dpto" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Barrio / Zona" value={form.barrio} onChange={e => set('barrio', e.target.value)} />
        <Select label="Estado" value={form.estado} onChange={e => set('estado', e.target.value)}>
          {ESTADOS_PROPIEDAD.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </Select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Input label="Precio (USD)" type="number" value={form.precio} onChange={e => set('precio', e.target.value)} />
        <Input label="Sup. m²" type="number" value={form.sup} onChange={e => set('sup', e.target.value)} />
        <Input label="Hab." type="number" value={form.hab} onChange={e => set('hab', e.target.value)} />
      </div>

      <Divider />

      <Input label="Propietario / Contacto" value={form.propietario} onChange={e => set('propietario', e.target.value)} />
      <Input label="Teléfono propietario" type="tel" value={form.propietarioTel} onChange={e => set('propietarioTel', e.target.value)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Comisión (%)" type="number" value={form.comision} onChange={e => set('comision', e.target.value)} />
        <Input label="Fecha captación" type="date" value={form.fechaCaptacion} onChange={e => set('fechaCaptacion', e.target.value)} />
      </div>

      <Input label="URL de foto" value={form.fotoUrl} onChange={e => set('fotoUrl', e.target.value)} placeholder="https://..." />

      <Textarea label="Notas" value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Características, observaciones..." />

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        {initial?.id && <Btn variant="danger" onClick={handleDelete} style={{ flex: '0 0 auto' }}>Eliminar</Btn>}
        <Btn variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancelar</Btn>
        <Btn variant="primary" onClick={handleSave} disabled={saving} style={{ flex: 2 }}>
          {saving ? 'Guardando...' : initial?.id ? 'Guardar cambios' : 'Agregar propiedad'}
        </Btn>
      </div>
    </div>
  )
}
