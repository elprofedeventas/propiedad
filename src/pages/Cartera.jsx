import React, { useState, useMemo } from 'react'
import { Card, EstadoBadge, Badge, BottomSheet, SearchBar, Chips, Btn, Empty, Spinner } from '../components/UI'
import PropiedadForm from '../components/PropiedadForm'
import { TIPOS_OPERACION, ESTADOS_PROPIEDAD } from '../utils/config'
import { tipoIcon, tipoLabel, fmtMoney, fmtDateShort, estadoColor } from '../utils/helpers'

const OP_FILTROS   = [{ id: '', label: 'Todo' }, ...TIPOS_OPERACION]
const ESTADO_FILTROS = [{ id: '', label: 'Todos' }, ...ESTADOS_PROPIEDAD.map(e => ({ id: e.id, label: e.label }))]

export default function Cartera({ propiedades, onSave, onDelete, loading }) {
  const [search,     setSearch]     = useState('')
  const [filtroOp,   setFiltroOp]   = useState('')
  const [filtroEst,  setFiltroEst]  = useState('')
  const [selected,   setSelected]   = useState(null)  // null | prop | 'new'
  const [detalle,    setDetalle]    = useState(null)

  const filtered = useMemo(() => propiedades.filter(p => {
    if (filtroOp  && p.op     !== filtroOp)  return false
    if (filtroEst && p.estado !== filtroEst) return false
    if (search) {
      const q = search.toLowerCase()
      if (!`${p.direccion} ${p.barrio} ${tipoLabel(p.tipo)}`.toLowerCase().includes(q)) return false
    }
    return true
  }), [propiedades, filtroOp, filtroEst, search])

  if (loading) return <Spinner />

  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>Cartera</h2>
        <Btn size="sm" onClick={() => setSelected('new')}>+ Nueva</Btn>
      </div>

      <div style={{ marginBottom: 12 }}><SearchBar value={search} onChange={setSearch} placeholder="Buscar propiedad..." /></div>

      <div style={{ marginBottom: 8 }}><Chips options={OP_FILTROS}    value={filtroOp}  onChange={setFiltroOp}  /></div>
      <div style={{ marginBottom: 16 }}><Chips options={ESTADO_FILTROS} value={filtroEst} onChange={setFiltroEst} /></div>

      {filtered.length === 0 && (
        <Empty icon="🏠" text="No hay propiedades con ese filtro"
          action={<Btn size="sm" onClick={() => setSelected('new')}>Agregar propiedad</Btn>}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="stagger">
        {filtered.map(p => (
          <Card key={p.id} onClick={() => setDetalle(p)} style={{ overflow: 'hidden' }}>
            {/* Foto */}
            {p.fotoUrl && (
              <div style={{ height: 160, background: `url(${p.fotoUrl}) center/cover`, borderRadius: '14px 14px 0 0' }} />
            )}
            {!p.fotoUrl && (
              <div style={{ height: 80, background: 'linear-gradient(135deg, var(--stone) 0%, var(--cream) 100%)', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                {tipoIcon(p.tipo)}
              </div>
            )}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{tipoLabel(p.tipo)}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{p.direccion}</div>
                  {p.barrio && <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{p.barrio}</div>}
                </div>
                <EstadoBadge estado={p.estado} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: 'var(--terra)' }}>
                  {p.precio ? fmtMoney(p.precio) : '—'}
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: 'var(--ink-soft)', fontWeight: 400 }}>
                    {p.op === 'alquiler' ? ' /mes' : ''}
                  </span>
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {p.sup && <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{p.sup} m²</span>}
                  {p.hab > 0 && <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>🛏 {p.hab}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <Badge color={p.op === 'alquiler' ? '#3B82B4' : '#B8960C'}>
                  {p.op === 'alquiler' ? 'Alquiler' : 'Venta'}
                </Badge>
                {p.fechaCaptacion && <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Captada {fmtDateShort(p.fechaCaptacion)}</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detalle sheet */}
      <BottomSheet open={!!detalle} onClose={() => setDetalle(null)} title={detalle ? tipoLabel(detalle.tipo) : ''}>
        {detalle && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {detalle.fotoUrl && <img src={detalle.fotoUrl} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} onError={e => e.target.style.display = 'none'} />}
            <div style={{ fontSize: 20, fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>{detalle.direccion}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 16 }}>{detalle.barrio}</div>
            <EstadoBadge estado={detalle.estado} />
            <div style={{ marginTop: 16 }}>
              {[
                ['Operación',   detalle.op === 'alquiler' ? 'Alquiler' : 'Venta'],
                ['Precio',      fmtMoney(detalle.precio) + (detalle.op === 'alquiler' ? ' /mes' : '')],
                ['Superficie',  detalle.sup ? `${detalle.sup} m²` : null],
                ['Habitaciones',detalle.hab > 0 ? detalle.hab : null],
                ['Propietario', detalle.propietario],
                ['Tel. propietario', detalle.propietarioTel],
                ['Comisión',    detalle.comision ? `${detalle.comision}%` : null],
                ['Captación',   fmtDateShort(detalle.fechaCaptacion)],
                ['Notas',       detalle.notas],
              ].filter(r => r[1]).map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                </div>
              ))}
            </div>
            {detalle.propietarioTel && (
              <a href={`https://wa.me/${detalle.propietarioTel.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', marginTop: 16 }}>
                <Btn variant="outline" style={{ width: '100%' }}>💬 WhatsApp propietario</Btn>
              </a>
            )}
            <Btn style={{ marginTop: 10, width: '100%' }} onClick={() => { setDetalle(null); setSelected(detalle) }}>
              ✏️ Editar propiedad
            </Btn>
          </div>
        )}
      </BottomSheet>

      {/* Form sheet */}
      <BottomSheet open={!!selected} onClose={() => setSelected(null)} title={selected === 'new' ? 'Nueva propiedad' : 'Editar propiedad'}>
        {selected && (
          <PropiedadForm
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
