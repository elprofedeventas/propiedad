// ─── VERCEL PROXY → GOOGLE APPS SCRIPT ───────────────────────────────────────
// Este archivo vive en /api/gas.js y actúa como proxy para evitar CORS.
// Vercel reenvía las requests a la URL del Web App de GAS configurada en
// la variable de entorno VITE_GAS_URL.

export default async function handler(req, res) {
  const GAS_URL = process.env.VITE_GAS_URL

  if (!GAS_URL) {
    return res.status(500).json({ error: 'VITE_GAS_URL no configurada en Vercel' })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const params = new URLSearchParams(req.query).toString()
      const url    = `${GAS_URL}${params ? '?' + params : ''}`
      const r      = await fetch(url)
      const data   = await r.json()
      return res.status(200).json(data)
    }

    if (req.method === 'POST') {
      const r = await fetch(GAS_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(req.body),
      })
      const data = await r.json()
      return res.status(200).json(data)
    }

    return res.status(405).json({ error: 'Método no permitido' })

  } catch (err) {
    console.error('[proxy] Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
