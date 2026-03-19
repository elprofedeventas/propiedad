import React, { useState, useMemo } from 'react'
import { Card, Badge, BottomSheet, SearchBar, Chips, Btn, Empty, Spinner, Row } from '../components/UI'
import ClienteForm from '../components/ClienteForm'
import { TIPOS_CLIENTE } from '../utils/config'
import { fmtMoney, waLink } from '../utils/helpers'

const TIPO_FILTROS = [{ id: '', label: 'Todos' }, ...TIPOS_CLIENTE]
const TIPO_COLOR   = { comprador: '#B8960C', inquilino: '#3B82B4', inversor: '#3D7A5E' }

export default function Clientes({ clientes, onSave, onDelete, loading }) {
  const [search,   setSearch]   = useState('')
  const [filtro,   setFiltro]   = useState('')
  const [selected, setSelected] = useState(null)
  const [detalle,  setDetalle]  = useState(null)

  const filtered = useMemo(() => clientes.filter(c => {
    if (filtro && c.tipo !== filtro) return false
    if (search) {
      const q = search.toLowerCase()
      if (!`${c.nombre} ${c.mail} ${c.busca}`.toLowerCase().includes(q)) return false
    }
    return true
  }), [clientes, filtro, search])

  if (loading) return <Spinner />

  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>Clientes</h2>
        <Btn size="sm" onClick={() => setSelected('new')}>+ Nuevo</Btn>
      </div>

      <div style={{ marginBottom: 12 }}><SearchBar value={search} onChange={setSearch} placeholder="Buscar cliente..." /></div>
      <div style={{ marginBottom: 16 }}><Chips options={TIPO_FILTROS} value={filtro} onChange={setFiltro} /></div>

      {filtered.length === 0 && (
        <Empty icon="👤" text="No hay clientes con ese filtro"
          action={<Btn size="sm" onClick={() => setSelected('new')}>Agregar cliente</Btn>}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="stagger">
        {filtered.map(c => (
          <Card key={c.id} onClick={() => setDetalle(c)} style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {/* Avatar */}
              <div style={{
                width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                background: `${TIPO_COLOR[c.tipo]}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: TIPO_COLOR[c.tipo],
                fontFamily: "'Playfair Display', serif"
              }}>
                {c.nombre.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.nombre}</div>
                {c.tel && <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{c.tel}</div>}
                {c.busca && <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.busca}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <Badge color={TIPO_COLOR[c.tipo] || 'var(--ink-soft)'}>{TIPOS_CLIENTE.find(t => t.id === c.tipo)?.label || c.tipo}</Badge>
                {c.presupuesto && <span style={{ fontSize: 11, color: 'var(--terra)', fontWeight: 600 }}>{fmtMoney(c.presupuesto)}</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detalle */}
      <BottomSheet open={!!detalle} onClose={() => setDetalle(null)} title={detalle?.nombre || ''}>
        {detalle && (
          <div>
            <Badge color={TIPO_COLOR[detalle.tipo] || 'var(--ink-soft)'}>{TIPOS_CLIENTE.find(t => t.id === detalle.tipo)?.label}</Badge>
            <div style={{ marginTop: 16 }}>
              {[
                ['Teléfono',    detalle.tel],
                ['Email',       detalle.mail],
                ['Presupuesto', detalle.presupuesto ? fmtMoney(detalle.presupuesto) : null],
                ['Qué busca',   detalle.busca],
                ['Notas',       detalle.notas],
              ].filter(r => r[1]).map(([l, v]) => (
                <Row key={l} label={l} value={v} />
              ))}
            </div>
            {detalle.tel && (
              <a href={waLink(detalle.tel, `Hola ${detalle.nombre.split(' ')[0]}, te contacto respecto a propiedades que tenemos disponibles.`)}
                target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginTop: 16 }}>
                <Btn variant="outline" style={{ width: '100%' }}>💬 WhatsApp</Btn>
              </a>
            )}
            {detalle.mail && (
              <a href={`mailto:${detalle.mail}`} style={{ textDecoration: 'none', display: 'block', marginTop: 10 }}>
                <Btn variant="secondary" style={{ width: '100%' }}>✉️ Enviar email</Btn>
              </a>
            )}
            <Btn style={{ marginTop: 10, width: '100%' }} onClick={() => { setDetalle(null); setSelected(detalle) }}>
              ✏️ Editar cliente
            </Btn>
          </div>
        )}
      </BottomSheet>

      {/* Form */}
      <BottomSheet open={!!selected} onClose={() => setSelected(null)} title={selected === 'new' ? 'Nuevo cliente' : 'Editar cliente'}>
        {selected && (
          <ClienteForm
            initial={selected === 'new' ? null : selected}
            onSave={onSave}
            onDelete={onDelete}
            onClose={() => setSelected(null)}
          />
        )}
      </BottomSheet>
    </div>
  )
}
