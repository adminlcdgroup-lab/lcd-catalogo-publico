# LCD Group — Catálogo Público

Frontend público SEO-friendly del inventario de vehículos. Consume el endpoint
`?action=catalogoPublico` del backend Apps Script.

## Arquitectura

```
Browser (Google)
   │
   ▼
Next.js 14 (SSG + ISR cada 5 min)  ← desplegado en Vercel
   │
   ▼ fetch (revalidate: 300)
Apps Script Web App (?action=catalogoPublico)
   │
   ▼
Google Sheets · Inventario_Stock + Vehiculos_Fotos
```

## Setup local (desarrollo)

```bash
cd catalogo-publico
npm install
cp .env.local.example .env.local
# Editar .env.local con la URL de tu Apps Script Web App

npm run dev
# → http://localhost:3000
```

## Despliegue a Vercel (recomendado)

1. Subir esta carpeta a un repo nuevo de GitHub (separado del CRM privado)
2. Ir a [vercel.com/new](https://vercel.com/new) → importar el repo
3. En *Environment Variables* configurar:
   - `NEXT_PUBLIC_APPS_SCRIPT_URL` = URL del Web App (termina en `/exec`)
   - `NEXT_PUBLIC_WHATSAPP` = número (ej. `51999123456`)
   - `NEXT_PUBLIC_COMPANY_NAME` = `LCD Group Automotriz`
   - `NEXT_PUBLIC_COMPANY_CITY` = `Trujillo, Perú`
4. Deploy → Vercel reconstruye automáticamente con cada push a `main`

### Dominio personalizado (opcional)

En Vercel → Settings → Domains → agregar `autos.lcdgroup.com` o similar.

## Estructura

```
app/
├── layout.tsx                  ← Header/footer global, meta tags SEO
├── page.tsx                    ← Home: server component que fetchea catálogo
├── globals.css                 ← Tailwind base
└── vehiculo/[id]/page.tsx      ← Ficha individual (1 página por vehículo, ISR)

components/
├── CatalogClient.tsx           ← Client component con filtros (useState)
├── VehicleCard.tsx             ← Tarjeta individual
├── Filters.tsx                 ← Marca · Año · Transmisión · Búsqueda
└── WhatsAppButton.tsx          ← CTA con mensaje pre-armado

lib/
├── api.ts                      ← fetchCatalogo() + tipos + helpers
└── config.ts                   ← Constants (URL, WhatsApp, revalidate)
```

## Seguridad

✅ Solo se exponen 9 campos públicos (Marca, Modelo, Versión, Transmisión, Año, KM, Precio, ID anónimo, Fotos)
✅ NO se expone: placa real, costos, gastos, utilidad, comentarios internos, SOAT, revisión técnica, prenda
✅ ID público es un hash anónimo derivado de la placa — los clientes contactan por este ID, no por placa

## Performance

- **SSG + ISR**: HTML pre-renderizado, ideal para Google indexing
- **revalidate: 300s**: catálogo se refresca máximo cada 5 minutos sin re-deploy
- **Imágenes**: usan el endpoint `drive.google.com/thumbnail?sz=w800` que es CDN-cached por Google

## Actualización inmediata (opcional)

Si quieres que el catálogo se actualice instantáneamente al cambiar el sheet, agrega un trigger en Apps Script que llame al endpoint de revalidación de Vercel:

```javascript
// En tu .gs:
function notificarVercel() {
  UrlFetchApp.fetch('https://catalogo.tudominio.com/api/revalidate?token=XXX', {
    method: 'POST'
  });
}
```

Y crea un endpoint `app/api/revalidate/route.ts` que llame a `revalidatePath('/')`.
