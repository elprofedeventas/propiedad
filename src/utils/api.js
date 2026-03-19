// ─── CAPA DE API ──────────────────────────────────────────────────────────────
// En producción apunta al proxy de Vercel (/api/gas)
// En desarrollo usa VITE_GAS_URL directo (sin proxy, CORS cubierto por GAS con doGet)

const BASE = '/api/gas'

async function request(params) {
  const url = new URL(BASE, window.location.origin)
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data
}

async function post(body) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data
}

// ── Propiedades ───────────────────────────────────────────────────────────────
export const apiGetPropiedades  = ()      => request({ action: 'getPropiedades' })
export const apiSavePropiedad   = (data)  => post({ action: 'savePropiedad',  data })
export const apiDeletePropiedad = (id)    => post({ action: 'deletePropiedad', id  })

// ── Clientes ──────────────────────────────────────────────────────────────────
export const apiGetClientes  = ()     => request({ action: 'getClientes' })
export const apiSaveCliente  = (data) => post({ action: 'saveCliente',  data })
export const apiDeleteCliente= (id)   => post({ action: 'deleteCliente', id  })

// ── Operaciones ───────────────────────────────────────────────────────────────
export const apiGetOperaciones  = ()     => request({ action: 'getOperaciones' })
export const apiSaveOperacion   = (data) => post({ action: 'saveOperacion',  data })
export const apiDeleteOperacion = (id)   => post({ action: 'deleteOperacion', id  })
