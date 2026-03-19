import React from 'react'
import { StatCard, Card, DemoBanner, SectionTitle } from '../components/UI'
import { ETAPAS } from '../utils/config'
import { fmtMoneyK, tipoIcon, tipoLabel, fmtDateShort } from '../utils/helpers'

export default function Dashboard({ propiedades, clientes, operaciones, isDemo, onGoTo }) {
  const disponibles    = propiedades.filter(p => p.estado === 'disponible').length
  const enPipeline     = operaciones.filter(o => ['negociacion','reserva'].includes(o.etapa)).length
  const cerradas       = operaciones.filter(o => o.etapa === 'cerrada')
  const comisionTotal  = cerradas.reduce((acc, o) => {
    const p = propiedades.find(p => p.id === o.propId)
    const com = p?.comision || 3
    return acc + (Number(o.monto) * com / 100)
  }, 0)

  const recientes = operaciones
    .slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 4)

  const etapaColor = { prospecto: '#5A5248', activa: '#3B82B4', negociacion: '#B8960C', reserva: '#C4622D', cerrada: '#3D7A5E' }

  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <SectionTitle>Dashboard</SectionTitle>
      {isDemo && <DemoBanner />}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }} className="stagger">
        <StatCard label="Cartera activa" value={disponibles} sub={`de ${propiedades.length} props.`} accentColor="var(--terra)" />
        <StatCard label="Clientes" value={clientes.length} sub={`${clientes.filter(c=>c.tipo==='comprador').length} compradores`} accentColor="#3B82B4" />
        <StatCard label="En negociación" value={enPipeline} sub="operaciones calientes" accentColor="#B8960C" />
        <StatCard label="Comisiones cerradas" value={fmtMoneyK(comisionTotal)} sub={`${cerradas.length} ops cerradas`} accentColor="#3D7A5E" />
      </div>

      {/* Pipeline rápido */}
      <Card style={{ padding: '18px 18px 8px', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Pipeline</div>
        {ETAPAS.map(e => {
          const cnt = operaciones.filter(o => o.etapa === e.id).length
          const pct = operaciones.length ? (cnt / operaciones.length) * 100 : 0
          return (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)', width: 90, flexShrink: 0 }}>{e.label}</span>
              <div style={{ flex: 1, height: 6, background: 'var(--stone)', borderRadius: 3 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: etapaColor[e.id], borderRadius: 3, transition: 'width 0.6s' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, width: 20, textAlign: 'right' }}>{cnt}</span>
            </div>
          )
        })}
      </Card>

      {/* Actividad reciente */}
      <Card style={{ padding: '18px 18px 4px' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Operaciones recientes</div>
        {recientes.length === 0 && <div style={{ fontSize: 13, color: 'var(--ink-soft)', paddingBottom: 14 }}>Sin operaciones aún</div>}
        {recientes.map(op => {
          const prop    = propiedades.find(p => p.id === op.propId)
          const cliente = clientes.find(c => c.id === op.clienteId)
          const etq     = ETAPAS.find(e => e.id === op.etapa)
          return (
            <div key={op.id} style={{ display: 'flex', gap: 12, paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: etapaColor[op.etapa] || 'var(--terra)', marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{prop ? `${tipoIcon(prop.tipo)} ${prop.direccion}` : 'Propiedad eliminada'}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{cliente?.nombre || '—'} · {etq?.label}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', flexShrink: 0 }}>{fmtDateShort(op.fecha)}</div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
