import type { Metadata } from 'next';
import { COMPANY_NAME, COMPANY_CITY } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${COMPANY_NAME} | Autos seminuevos garantizados`,
    template: `%s | ${COMPANY_NAME}`,
  },
  description: `Catálogo de vehículos seminuevos garantizados en ${COMPANY_CITY}. Inspección técnica, financiación y entrega rápida.`,
  keywords: ['autos seminuevos', 'venta de autos', COMPANY_CITY, 'concesionaria', 'autos usados garantizados'],
  openGraph: {
    title: COMPANY_NAME,
    description: 'Autos seminuevos con inspección técnica y garantía',
    type: 'website',
    locale: 'es_PE',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <header className="border-b border-carbon-700 bg-carbon-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-carbon-800 flex items-center justify-center font-black text-brand">
                LCD
              </div>
              <div>
                <div className="font-black text-base leading-none">{COMPANY_NAME}</div>
                <div className="text-[10px] text-brand uppercase tracking-widest mt-0.5">Automotriz</div>
              </div>
            </div>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`}
               className="bg-brand hover:bg-brand-light text-carbon-900 font-bold text-sm px-4 py-2 rounded-lg transition">
              💬 WhatsApp
            </a>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-carbon-700 mt-20 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} {COMPANY_NAME} · {COMPANY_CITY}
          </div>
        </footer>
      </body>
    </html>
  );
}
