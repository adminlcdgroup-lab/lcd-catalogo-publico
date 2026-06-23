'use client';

export type FilterState = {
  marca:       string;
  anioMin:     string;
  transmision: string;
  busqueda:    string;
};

export default function Filters({
  state, onChange, marcasDisponibles, transmisionesDisponibles,
}: {
  state: FilterState;
  onChange: (s: FilterState) => void;
  marcasDisponibles: string[];
  transmisionesDisponibles: string[];
}) {
  const upd = (k: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...state, [k]: e.target.value });

  return (
    <div className="bg-carbon-800 border border-carbon-700 rounded-2xl p-4 mb-6 grid md:grid-cols-4 gap-3">
      <input
        type="text"
        placeholder="🔍 Buscar marca o modelo..."
        value={state.busqueda}
        onChange={upd('busqueda')}
        className="bg-carbon-900 border border-carbon-700 rounded-lg px-3 py-2 text-sm placeholder-zinc-600 focus:border-brand outline-none md:col-span-2"
      />
      <select
        value={state.marca}
        onChange={upd('marca')}
        className="bg-carbon-900 border border-carbon-700 rounded-lg px-3 py-2 text-sm focus:border-brand outline-none"
      >
        <option value="">Todas las marcas</option>
        {marcasDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select
        value={state.transmision}
        onChange={upd('transmision')}
        className="bg-carbon-900 border border-carbon-700 rounded-lg px-3 py-2 text-sm focus:border-brand outline-none"
      >
        <option value="">Todas las transmisiones</option>
        {transmisionesDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select
        value={state.anioMin}
        onChange={upd('anioMin')}
        className="bg-carbon-900 border border-carbon-700 rounded-lg px-3 py-2 text-sm focus:border-brand outline-none md:col-span-4"
      >
        <option value="">Cualquier año</option>
        {[2024, 2022, 2020, 2018, 2015].map(y =>
          <option key={y} value={y}>Desde {y}</option>
        )}
      </select>
    </div>
  );
}
