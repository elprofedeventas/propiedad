import React, { useState } from 'react'
import { useData } from './hooks/useData'
import Dashboard   from './pages/Dashboard'
import Cartera     from './pages/Cartera'
import Clientes    from './pages/Clientes'
import Operaciones from './pages/Operaciones'

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',   label: 'Inicio',      icon: DashIcon   },
  { id: 'cartera',     label: 'Cartera',      icon: HomeIcon   },
  { id: 'clientes',    label: 'Clientes',     icon: UserIcon   },
  { id: 'operaciones', label: 'Operaciones',  icon: SwapIcon   },
]

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const {
    propiedades, clientes, operaciones, loading, isDemo,
    savePropiedad, deletePropiedad,
    saveCliente,   deleteCliente,
    saveOperacion, deleteOperacion,
  } = useData()

  const badges = {
    cartera:     propiedades.filter(p => p.estado === 'disponible').length,
    operaciones: operaciones.filter(o => ['negociacion','reserva'].includes(o.etapa)).length,
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--ink)', color: 'var(--cream)',
        padding: '0 16px',
        height: 'var(--header-h)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(26,22,18,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--terra)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: 'white' }}>P</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, letterSpacing: '0.02em' }}>PROPIEDAD</span>
        </div>
        {isDemo && <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', background: 'rgba(184,150,12,0.2)', color: '#E8C84A', padding: '3px 8px', borderRadius: 6 }}>DEMO</span>}
      </header>

      {/* Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'dashboard'   && <Dashboard   propiedades={propiedades} clientes={clientes} operaciones={operaciones} isDemo={isDemo} onGoTo={setTab} />}
        {tab === 'cartera'     && <Cartera     propiedades={propiedades} onSave={savePropiedad}  onDelete={deletePropiedad}  loading={loading} />}
        {tab === 'clientes'    && <Clientes    clientes={clientes}       onSave={saveCliente}    onDelete={deleteCliente}    loading={loading} />}
        {tab === 'operaciones' && <Operaciones operaciones={operaciones} propiedades={propiedades} clientes={clientes} onSave={saveOperacion} onDelete={deleteOperacion} loading={loading} />}
      </main>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--white)', borderTop: '1px solid var(--border)',
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 20px rgba(26,22,18,0.08)',
      }}>
        {NAV.map(n => {
          const active  = tab === n.id
          const badge   = badges[n.id]
          const Icon    = n.icon
          return (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '10px 4px 10px', border: 'none', background: 'none',
              cursor: 'pointer', position: 'relative',
              transition: 'all 0.15s',
            }}>
              {/* Active indicator */}
              {active && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 24, height: 2.5, borderRadius: '0 0 3px 3px', background: 'var(--terra)' }} />}
              {/* Badge */}
              {badge > 0 && !active && (
                <div style={{ position: 'absolute', top: 7, right: '50%', transform: 'translateX(8px)', background: 'var(--terra)', color: 'white', fontSize: 9, fontWeight: 700, width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</div>
              )}
              <Icon size={22} active={active} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? 'var(--terra)' : 'var(--ink-soft)', marginTop: 3 }}>{n.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

// ─── NAV ICONS ────────────────────────────────────────────────────────────────
function DashIcon({ size = 22, active }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="2" fill={active ? 'var(--terra)' : 'none'} stroke={active ? 'var(--terra)' : 'var(--ink-soft)'} strokeWidth="1.8"/>
    <rect x="13" y="3" width="8" height="8" rx="2" fill="none" stroke={active ? 'var(--terra)' : 'var(--ink-soft)'} strokeWidth="1.8"/>
    <rect x="3" y="13" width="8" height="8" rx="2" fill="none" stroke={active ? 'var(--terra)' : 'var(--ink-soft)'} strokeWidth="1.8"/>
    <rect x="13" y="13" width="8" height="8" rx="2" fill="none" stroke={active ? 'var(--terra)' : 'var(--ink-soft)'} strokeWidth="1.8"/>
  </svg>
}

function HomeIcon({ size = 22, active }) {
  const c = active ? 'var(--terra)' : 'var(--ink-soft)'
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V16H9V21H4C3.45 21 3 20.55 3 20V10.5Z" stroke={c} strokeWidth="1.8" fill={active ? `${c}20` : 'none'} strokeLinejoin="round"/>
  </svg>
}

function UserIcon({ size = 22, active }) {
  const c = active ? 'var(--terra)' : 'var(--ink-soft)'
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8" fill={active ? `${c}20` : 'none'} />
    <path d="M4 20C4 17 7.6 15 12 15C16.4 15 20 17 20 20" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
}

function SwapIcon({ size = 22, active }) {
  const c = active ? 'var(--terra)' : 'var(--ink-soft)'
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 4L3 8L7 12" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 8H15C17.2 8 19 9.8 19 12V13" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M17 20L21 16L17 12" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 16H9C6.8 16 5 14.2 5 12V11" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
}
