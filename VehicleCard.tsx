import Image from 'next/image';
import Link from 'next/link';
import { Vehiculo, formatPrecio, formatKM, driveUrlToThumbnail } from '@/lib/api';
import WhatsAppButton from './WhatsAppButton';

export default function VehicleCard({ v }: { v: Vehiculo }) {
  const portada = v.Link_Fotos?.[0] ? driveUrlToThumbnail(v.Link_Fotos[0], 800) : null;

  return (
    <article className="group bg-carbon-800 border border-carbon-700 rounded-2xl overflow-hidden hover:border-brand transition-colors">
      <Link href={`/vehiculo/${v.ID}`} className="block">
        <div className="relative aspect-[4/3] bg-carbon-900 overflow-hidden">
          {portada ? (
            <Image
              src={portada}
              alt={`${v.Marca} ${v.Modelo} ${v.Año}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          )}
          <div className="absolute top-3 left-3 bg-brand text-carbon-900 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
            {v.Año}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{v.Marca}</div>
        <Link href={`/vehiculo/${v.ID}`}>
          <h3 className="text-xl font-black mt-1 hover:text-brand transition-colors">
            {v.Modelo}
          </h3>
        </Link>
        <div className="text-sm text-zinc-400 mt-0.5">{v.Version || '—'}</div>

        <div className="mt-4 text-3xl font-black text-brand">
          {formatPrecio(v.Precio_Publicacion)}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          <span className="text-[11px] bg-carbon-700 text-zinc-300 px-2 py-1 rounded">
            🛣 {formatKM(v.KM)}
          </span>
          {v.Transmision && (
            <span className="text-[11px] bg-carbon-700 text-zinc-300 px-2 py-1 rounded">
              ⚙ {v.Transmision}
            </span>
          )}
          {v.Combustible && (
            <span className="text-[11px] bg-carbon-700 text-zinc-300 px-2 py-1 rounded">
              ⛽ {v.Combustible}
            </span>
          )}
          {v.Traccion && (
            <span className="text-[11px] bg-carbon-700 text-zinc-300 px-2 py-1 rounded">
              🚙 {v.Traccion}
            </span>
          )}
          {v.Motor && (
            <span className="text-[11px] bg-carbon-700 text-zinc-300 px-2 py-1 rounded">
              🔧 {v.Motor}
            </span>
          )}
        </div>

        {v.Descripcion_Publica && (
          <p className="mt-3 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {v.Descripcion_Publica}
          </p>
        )}

        <WhatsAppButton vehiculo={v} className="mt-5 w-full" />
      </div>
    </article>
  );
}
