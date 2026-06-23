import { APPS_SCRIPT_URL, REVALIDATE_SECONDS } from './config';

export type Vehiculo = {
  ID:                 string;
  Marca:              string;
  Modelo:             string;
  Version:            string;
  Transmision:        string;
  Año:                number | null;
  KM:                 number;
  Precio_Publicacion: number;
  Link_Fotos:         string[];
};

export async function fetchCatalogo(): Promise<Vehiculo[]> {
  if (!APPS_SCRIPT_URL) {
    console.warn('NEXT_PUBLIC_APPS_SCRIPT_URL no configurada');
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
    console.error('fetchCatalogo error:', err);
    return [];
  }
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
