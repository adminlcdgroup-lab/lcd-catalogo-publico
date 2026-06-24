'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function VehicleGallery({
  fotos,
  alt,
}: {
  fotos: string[];
  alt: string;
}) {
  const [activeIdx, setActiveIdx]   = useState(0);
  const [lightbox,  setLightbox]    = useState(false);

  if (!fotos || fotos.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-carbon-800 flex items-center justify-center text-zinc-700">
        Sin imágenes
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Foto principal grande */}
      <div
        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-carbon-900 cursor-zoom-in group"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={fotos[activeIdx]}
          alt={`${alt} foto ${activeIdx + 1}`}
          fill
          className="object-cover"
          unoptimized
          priority={activeIdx === 0}
        />
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {activeIdx + 1} / {fotos.length}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-carbon-900 text-xs font-bold px-3 py-1.5 rounded-full">
            🔍 Click para ampliar
          </span>
        </div>
      </div>

      {/* Thumbnails — scroll horizontal en mobile, grid en desktop */}
      {fotos.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {fotos.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative aspect-square rounded-lg overflow-hidden bg-carbon-900 transition-all ${
                i === activeIdx
                  ? 'ring-2 ring-brand scale-95'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`Ver foto ${i + 1}`}
            >
              <Image
                src={f}
                alt={`${alt} thumb ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox al hacer click en la principal */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 text-2xl flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
            aria-label="Cerrar"
          >
            ✕
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center">
            <Image
              src={fotos[activeIdx]}
              alt={`${alt} foto ${activeIdx + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          {fotos.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 text-2xl flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((activeIdx - 1 + fotos.length) % fotos.length);
                }}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 text-2xl flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((activeIdx + 1) % fotos.length);
                }}
                aria-label="Siguiente"
              >
                ›
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full">
                {activeIdx + 1} / {fotos.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
