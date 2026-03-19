import React, { useState, useMemo } from 'react'
import { Card, Badge, BottomSheet, Chips, Btn, Empty, Spinner, Row } from '../components/UI'
import OperacionForm from '../components/OperacionForm'
import { ETAPAS, TIPOS_OPERACION } from '../utils/config'
import { tipoIcon, fmtMoney, fmtDateShort } from '../utils/helpers'

const ETAPA_COLOR = { prospecto: '#5A5248', activa: '#3B82B4', negociacion: '#B8960C', reserva: '#C4622D', cerrada: '#3D7A5E' }
const OP_FILTROS  = [{ id: '', label: 'Todas' }, ...TIPOS_OPERACION]
const ET_FILTROS  = [{ id: '', label: 'Todas etapas' }, ...ETAPAS]

export default function Operaciones({ operaciones, propiedades, clientes, onSave, onDelete, loading }) {
  const [filtroOp, setFiltroOp] = useState('')
  const [filtroEt, setFiltroEt] = useState('')
  const [selected, setSelected] = useState(null)
  const [detalle,  setDetalle]  = useState(null)
  const [view,     setView]     = useState('pipeline')  // pipeline | lista

  const filtered = useMemo(() => operaciones.filter(o => {
    if (filtroOp && o.tipo  !== filtroOp) return false
    if (filtroEt && o.etapa !== filtroEt) return false
    return true
  }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)), [operaciones, filtroOp, filtroEt])

  const getP = (id) => propiedades.find(p => p.id === id)
  const getC = (id) => clientes.find(c => c.id === id)

  if (loading) return <Spinner />

  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>Operaciones</h2>
        <Btn size="sm" onClick={() => setSelected('new')}>+ Nueva</Btn>
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', background: 'var(--stone)', borderRadius: 10, padding: 3, marginBottom: 14 }}>
        {['pipeline','lista'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
            background: view === v ? 'var(--white)' : 'transparent',
            color: view === v ? 'var(--ink)' : 'var(--ink-soft)',
            boxShadow: view === v ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s',
          }}>
            {v === 'pipeline' ? 'Pipeline' : 'Lista'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 8 }}><Chips options={OP_FILTROS} value={filtroOp} onChange={setFiltroOp} /></div>
      <div style={{ marginBottom: 16 }}><Chips options={ET_FILTROS} value={filtroEt} onChange={setFiltroEt} /></div>

      {filtered.length === 0 && (
        <Empty icon="⇄" text="No hay operaciones" action={<Btn size="sm" onClick={() => setSelected('new')}>Crear operación</Btn>} />
      )}

      {/* PIPELINE VIEW */}
      {view === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ETAPAS.map(e => {
            const ops = filtered.filter(o => o.etapa === e.id)
            if (filtroEt && filtroEt !== e.id) return null
            return (
              <div key={e.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ETAPA_COLOR[e.id] }} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ETAPA_COLOR[e.id] }}>{e.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-soft)', marginLeft: 'auto' }}>{ops.length}</span>
                </div>
                {ops.length === 0 && !filtroEt && (
                  <div style={{ padding: '12px 16px', fontSize: 12, color: 'var(--ink-soft)', background: 'var(--stone)', borderRadius: 10, textAlign: 'center' }}>Sin operaciones en esta etapa</div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ops.map(op => {
                    const prop    = getP(op.propId)
                    const cliente = getC(op.clienteId)
                    return (
                      <Card key={op.id} onClick={() => setDetalle(op)} style={{ padding: '12px 14px', borderLeft: `3px solid ${ETAPA_COLOR[op.etapa]}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{prop ? `${tipoIcon(prop.tipo)} ${prop.direccion}` : 'Prop. eliminada'}</div>
                          <Badge color={op.tipo === 'alquiler' ? '#3B82B4' : '#B8960C'} style={{ fontSize: 10, padding: '2px 8px' }}>
                            {op.tipo === 'alquiler' ? 'Alq.' : 'Vta.'}
                          </Badge>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>👤 {cliente?.nombre || '—'}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--terra)' }}>{op.monto ? fmtMoney(op.monto) : '—'}</span>
                          <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{fmtDateShort(op.fecha)}</span>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* LISTA VIEW */}
      {view === 'lista' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(op => {
            const prop    = getP(op.propId)
            const cliente = getC(op.clienteId)
            return (
              <Card key={op.id} onClick={() => setDetalle(op)} style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 3, borderRadius: 2, background: ETAPA_COLOR[op.etapa], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{prop ? `${tipoIcon(prop.tipo)} ${prop.direccion}` : '—'}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--terra)' }}>{op.monto ? fmtMoney(op.monto) : '—'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{cliente?.nombre || '—'}</span>
                      <Badge color={ETAPA_COLOR[op.etapa]} style={{ fontSize: 10 }}>{ETAPAS.find(e => e.id === op.etapa)?.label}</Badge>
                      <span style={{ fontSize: 11, color: 'var(--ink-soft)', marginLeft: 'auto' }}>{fmtDateShort(op.fecha)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Detalle sheet */}
      <BottomSheet open={!!detalle} onClose={() => setDetalle(null)} title="Operación">
        {detalle && (() => {
          const prop    = getP(detalle.propId)
          const cliente = getC(detalle.clienteId)
          return (
            <div>
              <Badge color={ETAPA_COLOR[detalle.etapa]}>{ETAPAS.find(e => e.id === detalle.etapa)?.label}</Badge>
              <div style={{ marginTop: 16 }}>
                {[
                  ['Propiedad', prop ? `${tipoIcon(prop.tipo)} ${prop.direccion}` : '—'],
                  ['Cliente',   cliente?.nombre],
                  ['Tipo',      detalle.tipo === 'alquiler' ? 'Alquiler' : 'Venta'],
                  ['Monto',     detalle.monto ? fmtMoney(detalle.monto) : null],
                  ['Fecha',     fmtDateShort(detalle.fecha)],
                  ['Notas',     detalle.notas],
                ].filter(r => r[1]).map(([l, v]) => <Row key={l} label={l} value={v} />)}
              </div>
              {cliente?.tel && (
                <a href={`https://wa.me/${cliente.tel.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginTop: 16 }}>
                  <Btn variant="outline" style={{ width: '100%' }}>💬 WhatsApp {cliente.nombre.split(' ')[0]}</Btn>
                </a>
              )}
              <Btn style={{ marginTop: 10, width: '100%' }} onClick={() => { setDetalle(null); setSelected(detalle) }}>
                ✏️ Editar operación
              </Btn>
            </div>
          )
        })()}
      </BottomSheet>

      {/* Form sheet */}
      <BottomSheet open={!!selected} onClose={() => setSelected(null)} title={selected === 'new' ? 'Nueva operación' : 'Editar operación'}>
        {selected && (
          <OperacionForm
            initial={selected === 'new' ? null : selected}
            propiedades={propiedades}
            clientes={clientes}
            onSave={onSave}
            onDelete={onDelete}
            onClose={() => setSelected(null)}
          />
        )}
      </BottomSheet>
    </div>
  )
}
