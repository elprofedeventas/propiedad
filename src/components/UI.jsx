// ─── COMPONENTES UI COMPARTIDOS ───────────────────────────────────────────────
import React from 'react'
import { estadoColor, estadoLabel } from '../utils/helpers'

// ── Badge ─────────────────────────────────────────────────────────────────────
export const Badge = ({ children, color, style = {} }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 600,
    background: `${color}18`, color,
    ...style
  }}>
    <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
    {children}
  </span>
)

export const EstadoBadge = ({ estado }) => (
  <Badge color={estadoColor(estado)}>{estadoLabel(estado)}</Badge>
)

// ── Botones ───────────────────────────────────────────────────────────────────
const btnBase = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: 6, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
  cursor: 'pointer', border: 'none', outline: 'none',
  transition: 'all 0.15s', userSelect: 'none', whiteSpace: 'nowrap',
}

export const Btn = ({ children, variant = 'primary', size = 'md', onClick, disabled, style = {}, type = 'button' }) => {
  const sizes = {
    sm: { padding: '7px 14px', fontSize: 12, borderRadius: 8 },
    md: { padding: '11px 20px', fontSize: 14, borderRadius: 10 },
    lg: { padding: '14px 28px', fontSize: 15, borderRadius: 12 },
  }
  const variants = {
    primary:  { background: 'var(--terra)',  color: '#fff', boxShadow: '0 2px 8px rgba(196,98,45,0.3)' },
    secondary:{ background: 'var(--stone)',  color: 'var(--ink)', boxShadow: 'none' },
    ghost:    { background: 'transparent',   color: 'var(--ink-soft)', boxShadow: 'none' },
    danger:   { background: 'rgba(196,45,45,0.1)', color: '#C42D2D', boxShadow: 'none' },
    outline:  { background: 'transparent', color: 'var(--terra)', border: '1.5px solid var(--terra)', boxShadow: 'none' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...btnBase, ...sizes[size], ...variants[variant],
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
      ...style
    }}>
      {children}
    </button>
  )
}

// ── Inputs ────────────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid var(--border)', borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
  background: 'var(--white)', color: 'var(--ink)',
  outline: 'none', transition: 'border-color 0.15s',
  appearance: 'none', WebkitAppearance: 'none',
}

export const Input = ({ label, error, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    {label && <Label>{label}</Label>}
    <input style={inputStyle}
      onFocus={e => e.target.style.borderColor = 'var(--terra)'}
      onBlur={e  => e.target.style.borderColor = 'var(--border)'}
      {...props}
    />
    {error && <span style={{ fontSize: 11, color: '#C42D2D' }}>{error}</span>}
  </div>
)

export const Select = ({ label, children, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    {label && <Label>{label}</Label>}
    <div style={{ position: 'relative' }}>
      <select style={{ ...inputStyle, paddingRight: 36, cursor: 'pointer' }}
        onFocus={e => e.target.style.borderColor = 'var(--terra)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border)'}
        {...props}
      >
        {children}
      </select>
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink-soft)', fontSize: 12 }}>▾</span>
    </div>
  </div>
)

export const Textarea = ({ label, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    {label && <Label>{label}</Label>}
    <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
      onFocus={e => e.target.style.borderColor = 'var(--terra)'}
      onBlur={e  => e.target.style.borderColor = 'var(--border)'}
      {...props}
    />
  </div>
)

export const Label = ({ children }) => (
  <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
    {children}
  </label>
)

// ── Card ──────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: 'var(--white)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
    ...(onClick ? { cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.15s' } : {}),
    ...style
  }}
    onMouseEnter={onClick ? e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(-1px)' } : undefined}
    onMouseLeave={onClick ? e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none' } : undefined}
  >
    {children}
  </div>
)

// ── Stat Card ─────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, sub, accentColor = 'var(--terra)' }) => (
  <Card style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: accentColor, borderRadius: '14px 0 0 14px' }} />
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, lineHeight: 1, color: 'var(--ink)' }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>{sub}</div>}
  </Card>
)

// ── Bottom Sheet Modal ────────────────────────────────────────────────────────
export const BottomSheet = ({ open, onClose, title, children, height = '92dvh' }) => {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,22,18,0.5)', backdropFilter: 'blur(2px)' }}
        onClick={onClose} className="fade-in" />
      <div className="slide-up" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--white)', borderRadius: '20px 20px 0 0',
        maxHeight: height, overflowY: 'auto',
        boxShadow: '0 -4px 40px rgba(26,22,18,0.15)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600 }}>{title}</span>
          <button onClick={onClose} style={{ background: 'var(--stone)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
        <div style={{ padding: '0 20px 40px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Alert / Toast ─────────────────────────────────────────────────────────────
export const DemoBanner = () => (
  <div style={{
    background: 'rgba(184,150,12,0.12)', border: '1px solid rgba(184,150,12,0.3)',
    borderRadius: 10, padding: '10px 16px', marginBottom: 16,
    fontSize: 12, color: '#8A6E08', display: 'flex', alignItems: 'center', gap: 8
  }}>
    <span>⚡</span>
    <span>Modo demo — los datos no se guardan. Configura <strong>VITE_GAS_URL</strong> para activar Google Sheets.</span>
  </div>
)

// ── Empty State ───────────────────────────────────────────────────────────────
export const Empty = ({ icon = '📭', text = 'Sin resultados', action }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--ink-soft)' }}>
    <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>{icon}</div>
    <div style={{ fontSize: 14 }}>{text}</div>
    {action && <div style={{ marginTop: 16 }}>{action}</div>}
  </div>
)

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
    <div style={{
      width: 28, height: 28, border: '2.5px solid var(--border)',
      borderTopColor: 'var(--terra)', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite'
    }} />
  </div>
)

// ── Search Bar ────────────────────────────────────────────────────────────────
export const SearchBar = ({ value, onChange, placeholder = 'Buscar...' }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--stone)', borderRadius: 12,
    padding: '10px 14px',
  }}>
    <span style={{ fontSize: 15, opacity: 0.5 }}>🔍</span>
    <input value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ border: 'none', background: 'transparent', fontSize: 14, color: 'var(--ink)', outline: 'none', width: '100%' }}
    />
    {value && <button onClick={() => onChange('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontSize: 14, padding: 0 }}>✕</button>}
  </div>
)

// ── Chips ─────────────────────────────────────────────────────────────────────
export const Chips = ({ options, value, onChange }) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    {options.map(o => {
      const active = value === o.id
      return (
        <button key={o.id} onClick={() => onChange(active ? '' : o.id)} style={{
          padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          cursor: 'pointer', border: active ? '1.5px solid var(--terra)' : '1.5px solid var(--border)',
          background: active ? 'var(--terra-dim)' : 'var(--white)',
          color: active ? 'var(--terra)' : 'var(--ink-soft)',
          transition: 'all 0.15s',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {o.label}
        </button>
      )
    })}
  </div>
)

// ── Section Title ─────────────────────────────────────────────────────────────
export const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, marginBottom: 16, color: 'var(--ink)' }}>
    {children}
  </h2>
)

// ── Divider ───────────────────────────────────────────────────────────────────
export const Divider = () => <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

// ── Row ───────────────────────────────────────────────────────────────────────
export const Row = ({ label, value, style = {} }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid var(--border)', ...style }}>
    <span style={{ fontSize: 12, color: 'var(--ink-soft)', flexShrink: 0, paddingRight: 12 }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'right' }}>{value || '—'}</span>
  </div>
)
