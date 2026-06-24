import { fetchCatalogo, formatPrecio, formatKM, driveUrlToThumbnail } from '@/lib/api';
import WhatsAppButton from '@/components/WhatsAppButton';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

// SSG por vehículo — Google indexa cada ficha
export async function generateStaticParams() {
  const cat = await fetchCatalogo();
  return cat.map(v => ({ id: v.ID }));
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const cat = await fetchCatalogo();
  const v   = cat.find(x => x.ID === params.id);
  if (!v) return { title: 'Vehículo no encontrado' };

  const title       = `${v.Marca} ${v.Modelo} ${v.Año || ''} ${v.Version || ''}`.trim();
  const description = `${title} · ${formatKM(v.KM)} · ${v.Transmision} · ${formatPrecio(v.Precio_Publicacion)}. Inspección técnica certificada.`;

  return {
    title,
    description,
    openGraph: {
      title, description,
      images: v.Link_Fotos?.[0] ? [driveUrlToThumbnail(v.Link_Fotos[0], 1200)] : [],
    },
  };
}

export default async function VehiculoDetalle({ params }: { params: { id: string } }) {
  const cat = await fetchCatalogo();
  const v   = cat.find(x => x.ID === params.id);
  if (!v) notFound();

  const fotos = (v.Link_Fotos || []).map(u => driveUrlToThumbnail(u, 1200));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <a href="/" className="text-sm text-zinc-500 hover:text-brand">← Volver al catálogo</a>

      <div className="grid lg:grid-cols-2 gap-8 mt-6">
        {/* Galería */}
        <div className="space-y-3">
          {fotos.length > 0 ? (
            <>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-carbon-900">
                <Image src={fotos[0]} alt={`${v.Marca} ${v.Modelo}`} fill className="object-cover" unoptimized />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {fotos.slice(1, 4).map((f, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-carbon-900">
                    <Image src={f} alt={`${v.Marca} ${v.Modelo} foto ${i+2}`} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="aspect-[4/3] rounded-2xl bg-carbon-800 flex items-center justify-center text-zinc-700">
              Sin imágenes
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">{v.Marca}</div>
          <h1 className="text-5xl font-black mt-1">{v.Modelo}</h1>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-black text-brand">{v.Año}</span>
            <span className="text-lg text-zinc-400 font-semibold">{v.Version}</span>
          </div>

          <div className="mt-6 text-5xl font-black text-brand">
            {formatPrecio(v.Precio_Publicacion)}
          </div>

          {/* Ficha técnica COMPLETA */}
          <div className="mt-8">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3">Ficha técnica</h3>
            <div className="grid grid-cols-2 gap-3">
              {([
                ['Kilometraje',  formatKM(v.KM)],
                ['Transmisión',  v.Transmision],
                ['Combustible',  v.Combustible],
                ['Motor',        v.Motor],
                ['Tracción',     v.Traccion],
                ['Color',        v.Color],
                ['Pasajeros',    v.Pasajeros ? String(v.Pasajeros) : null],
                ['Pantalla',     v.Pantalla],
                ['Año',          v.Año ? String(v.Año) : null],
                ['Referencia',   v.ID],
              ] as [string, string | null | undefined][])
                .filter(([_, val]) => val && String(val).trim() !== '' && String(val).trim() !== '—')
                .map(([k, val]) => (
                  <div key={k} className="bg-carbon-800 border border-carbon-700 rounded-xl p-4">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500">{k}</div>
                    <div className="text-base font-bold mt-1">{val}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Descripción pública del vendedor */}
          {v.Descripcion_Publica && (
            <div className="mt-6 bg-carbon-800 border border-carbon-700 rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-widest text-brand font-bold mb-3">📝 Sobre este vehículo</h3>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {v.Descripcion_Publica}
              </p>
            </div>
          )}

          <WhatsAppButton vehiculo={v} className="mt-6 w-full !py-4 !text-base" />

          <p className="mt-6 text-xs text-zinc-500 leading-relaxed">
            ✅ Inspección técnica certificada · 💳 Facilidades de pago · 🔧 Garantía mecánica
          </p>
        </div>
      </div>
    </div>
  );
}
