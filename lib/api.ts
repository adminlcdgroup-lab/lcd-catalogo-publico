import { APPS_SCRIPT_URL, REVALIDATE_SECONDS, SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export type Vehiculo = {
  ID:                  string;
  Marca:               string;
  Modelo:              string;
  Version:             string;
  Transmision:         string;
  Traccion?:           string;
  Motor?:              string;
  Color?:              string;
  Combustible?:        string;
  Pasajeros?:          number | null;
  Pantalla?:           string;
  Año:                 number | null;
  KM:                  number;
  Precio_Publicacion:  number;
  Consultar_Precio?:   boolean;
  Descripcion_Publica?: string;
  Link_Fotos:          string[];
};

// Fila cruda de la vista `catalogo_publico` en Supabase (snake_case).
type FilaCatalogoSupabase = {
  id: string;
  marca: string | null;
  modelo: string | null;
  version: string | null;
  transmision: string | null;
  traccion: string | null;
  motor: string | null;
  color: string | null;
  combustible: string | null;
  pasajeros: number | null;
  pantalla: string | null;
  anio: number | null;
  km: number | null;
  precio_publicacion: number | null;
  descripcion_publica: string | null;
  fotos: string[] | null;
};

function mapFilaSupabaseAVehiculo(r: FilaCatalogoSupabase): Vehiculo {
  const precio = Number(r.precio_publicacion) || 0;
  return {
    ID: r.id,
    Marca: r.marca || '',
    Modelo: r.modelo || '',
    Version: r.version || '',
    Transmision: r.transmision || '',
    Traccion: r.traccion || '',
    Motor: r.motor || '',
    Color: r.color || '',
    Combustible: r.combustible || '',
    Pasajeros: r.pasajeros ?? null,
    Pantalla: r.pantalla || '',
    Año: r.anio ?? null,
    KM: Number(r.km) || 0,
    Precio_Publicacion: precio,
    Consultar_Precio: precio <= 0,
    Descripcion_Publica: r.descripcion_publica || '',
    Link_Fotos: Array.isArray(r.fotos) ? r.fotos : [],
  };
}

// Lee el catálogo directo de Supabase (vista pública `catalogo_publico`,
// protegida por RLS: solo columnas seguras, solo vehículos publicados).
// Mucho más rápido que pasar por Apps Script. Devuelve null si no está
// configurado o si la petición falla, para que el caller pueda usar el
// camino anterior como respaldo.
async function fetchCatalogoSupabase(): Promise<Vehiculo[] | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const url = `${SUPABASE_URL}/rest/v1/catalogo_publico?select=*`;
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as FilaCatalogoSupabase[];
    if (!Array.isArray(data)) return null;
    return data.map(mapFilaSupabaseAVehiculo);
  } catch (err) {
    console.error('fetchCatalogoSupabase error:', err);
    return null;
  }
}

// Camino anterior (Apps Script). Se conserva como respaldo automático:
// si Supabase no está configurado o falla, el catálogo sigue funcionando.
async function fetchCatalogoAppsScript(): Promise<Vehiculo[]> {
  if (!APPS_SCRIPT_URL) {
    console.warn('Ni Supabase ni NEXT_PUBLIC_APPS_SCRIPT_URL están configurados');
    return [];
  }
  const url = `${APPS_SCRIPT_URL}?action=catalogoPublico&t=${Date.now()}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data as Vehiculo[];
    return [];
  } catch (err) {
    console.error('fetchCatalogoAppsScript error:', err);
    return [];
  }
}

export async function fetchCatalogo(): Promise<Vehiculo[]> {
  const deSupabase = await fetchCatalogoSupabase();
  if (deSupabase !== null) return deSupabase;
  return fetchCatalogoAppsScript();
}

export function findVehiculo(catalog: Vehiculo[], id: string): Vehiculo | undefined {
  return catalog.find(v => v.ID === id);
}

export function formatPrecio(n: number): string {
  if (!n || n <= 0) return 'Consultar';
  return `$ ${n.toLocaleString('en-US')}`;
}

export function formatKM(n: number): string {
  return `${(n || 0).toLocaleString('en-US')} km`;
}

/** Convierte URL de Drive (uc?export=view&id=XXX) a thumbnail más optimizado */
export function driveUrlToThumbnail(url: string, size = 800): string {
  if (!url) return '';
  const m1 = url.match(/[?&]id=([^&]+)/);
  const m2 = url.match(/\/d\/([^/]+)/);
  const id = m1 ? m1[1] : (m2 ? m2[1] : null);
  if (!id) return url;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
}
