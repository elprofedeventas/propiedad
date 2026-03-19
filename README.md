# PROPIEDAD WAP

WAP (Workflow de Agente Profesional) para agentes inmobiliarios.  
Stack: **React + Vite → Vercel** (frontend) + **Google Apps Script → Google Sheets** (backend).

---

## Despliegue paso a paso

### 1 · Google Apps Script (backend)

1. Ve a [script.google.com](https://script.google.com) → **Nuevo proyecto**
2. Pega el contenido completo de `gas/Codigo.gs` (reemplaza todo lo que hay)
3. **Implementar → Nueva implementación**
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo mismo**
   - Quién puede acceder: **Cualquier usuario**
4. Autoriza los permisos que pide Google
5. Copia la **URL de la aplicación web** → la necesitas en el paso 3

> El script crea automáticamente la Google Sheet "PROPIEDAD WAP" en tu Drive
> la primera vez que recibe una request. No tienes que hacer nada más.

### 2 · GitHub

```bash
cd propiedad
git init
git add .
git commit -m "feat: PROPIEDAD WAP v1.0"
git remote add origin https://github.com/TU_USUARIO/propiedad-wap.git
git push -u origin main
```

### 3 · Vercel

1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Importa tu repositorio de GitHub
3. En **Environment Variables** agrega:
   - **Name:** `VITE_GAS_URL`
   - **Value:** la URL del paso 1
4. **Deploy**

---

## Desarrollo local

```bash
npm install
cp .env.example .env.local
# Edita .env.local → pon tu VITE_GAS_URL
npm run dev
```

> Sin `VITE_GAS_URL`, la app corre en **modo demo** con datos de ejemplo.
> Útil para mostrar clientes sin tocar nada.

---

## Personalización rápida

Edita `src/utils/config.js`:
- `AGENT_NAME` → tu nombre
- `MONEDA_SIMBOLO` → símbolo de moneda si cambias de USD

---

## Estructura

```
propiedad/
├── api/gas.js              ← Proxy Vercel (resuelve CORS)
├── gas/Codigo.gs           ← Backend GAS (pegar en script.google.com)
├── src/
│   ├── components/         ← UI.jsx, PropiedadForm, ClienteForm, OperacionForm
│   ├── hooks/useData.js    ← Estado + llamadas a API + demo fallback
│   ├── pages/              ← Dashboard, Cartera, Clientes, Operaciones
│   └── utils/              ← api.js, config.js, helpers.js
├── .env.example
├── vercel.json
└── vite.config.js
```
