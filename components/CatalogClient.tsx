'use client';

import { useMemo, useState } from 'react';
import { Vehiculo } from '@/lib/api';
import VehicleCard from './VehicleCard';
import Filters, { FilterState } from './Filters';

export default function CatalogClient({ inicial }: { inicial: Vehiculo[] }) {
  const [filtros, setFiltros] = useState<FilterState>({
    marca: '', anioMin: '', transmision: '', busqueda: '',
  });

  const { marcas, transmisiones } = useMemo(() => {
    const m = new Set<string>(), t = new Set<string>();
    inicial.forEach(v => {
      if (v.Marca) m.add(v.Marca);
      if (v.Transmision) t.add(v.Transmision);
    });
    return {
      marcas:        Array.from(m).sort(),
      transmisiones: Array.from(t).sort(),
    };
  }, [inicial]);

  const filtrados = useMemo(() => {
    const q = filtros.busqueda.toLowerCase().trim();
    return inicial.filter(v => {
      if (filtros.marca && v.Marca !== filtros.marca) return false;
      if (filtros.transmision && v.Transmision !== filtros.transmision) return false;
      if (filtros.anioMin && Number(v.Año) < Number(filtros.anioMin)) return false;
      if (q && !`${v.Marca} ${v.Modelo} ${v.Version}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [inicial, filtros]);

  if (inicial.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        <div className="text-5xl mb-3">🚗</div>
        <p>Aún no hay vehículos publicados.</p>
      </div>
    );
  }

  return (
    <>
      <Filters
        state={filtros}
        onChange={setFiltros}
        marcasDisponibles={marcas}
        transmisionesDisponibles={transmisiones}
      />

      {filtrados.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p>Sin resultados para los filtros aplicados.</p>
          <button
            onClick={() => setFiltros({ marca:'', anioMin:'', transmision:'', busqueda:'' })}
            className="mt-3 text-brand hover:underline text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="text-sm text-zinc-500 mb-4">
            Mostrando <span className="text-zinc-300 font-semibold">{filtrados.length}</span> de {inicial.length} vehículos
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtrados.map(v => <VehicleCard key={v.ID} v={v} />)}
          </div>
        </>
      )}
    </>
  );
}
