export const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';
export const WHATSAPP        = process.env.NEXT_PUBLIC_WHATSAPP || '51999123456';
export const COMPANY_NAME    = process.env.NEXT_PUBLIC_COMPANY_NAME || 'LCD Group';
export const COMPANY_CITY    = process.env.NEXT_PUBLIC_COMPANY_CITY || 'Trujillo, Perú';

// Fase B4: el catálogo lee directo de Supabase (más rápido que pasar por
// Apps Script). Si estas dos NO están configuradas, fetchCatalogo() usa
// automáticamente el camino viejo (Apps Script) — no rompe nada.
export const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const REVALIDATE_SECONDS = 300; // 5 min — ISR de Next.js
