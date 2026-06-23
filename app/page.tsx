import { fetchCatalogo } from '@/lib/api';
import CatalogClient from '@/components/CatalogClient';
import { COMPANY_NAME, COMPANY_CITY } from '@/lib/config';

// Server Component → SEO con HTML pre-renderizado
// ISR cada 5 min (revalidate en lib/config.ts)

export default async function Page() {
  const catalogo = await fetchCatalogo();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* HERO */}
      <section className="text-center mb-14">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          Autos seminuevos <span className="text-brand">garantizados</span>
        </h1>
        <p className="mt-4 text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
          {catalogo.length} vehículos disponibles con inspección técnica certificada en {COMPANY_CITY}
        </p>
      </section>

      {/* CATÁLOGO (Client Component para filtros) */}
      <CatalogClient inicial={catalogo} />
    </div>
  );
}
