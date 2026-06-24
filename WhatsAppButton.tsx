import { Vehiculo } from '@/lib/api';
import { WHATSAPP } from '@/lib/config';

export default function WhatsAppButton({
  vehiculo,
  className = '',
}: { vehiculo: Vehiculo; className?: string }) {
  const msg = encodeURIComponent(
    `Hola LCD Group, me interesa el *${vehiculo.Marca} ${vehiculo.Modelo} ${vehiculo.Año || ''}* (Ref: ${vehiculo.ID}). ¿Podría coordinar una visita para verlo?`
  );
  const href = `https://wa.me/${WHATSAPP}?text=${msg}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-carbon-900 font-bold text-sm px-4 py-2.5 rounded-lg transition ${className}`}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 4.99L2 22l5.2-1.37c1.46.8 3.11 1.22 4.79 1.22h.05c5.5 0 9.96-4.46 9.96-9.96s-4.46-9.96-9.96-9.85zm5.84 14.07c-.25.7-1.46 1.34-2.04 1.42-.55.08-1.24.12-2-.13-.46-.15-1.06-.34-1.82-.67-3.2-1.38-5.29-4.6-5.45-4.82-.16-.21-1.31-1.74-1.31-3.32 0-1.58.83-2.36 1.12-2.68.29-.32.64-.4.85-.4.21 0 .43.01.61.01.2 0 .46-.08.72.55.27.65.91 2.23.99 2.39.08.16.14.35.03.56-.12.21-.18.34-.35.52-.18.18-.37.4-.53.54-.18.18-.37.37-.16.72.21.36.94 1.55 2.02 2.51 1.39 1.24 2.56 1.62 2.91 1.81.35.18.55.15.76-.09.21-.24.87-1.02 1.1-1.37.23-.35.46-.29.77-.18.32.12 2.02.95 2.37 1.13.35.18.58.27.67.42.09.16.09.91-.16 1.61z"/>
      </svg>
      Contactar por WhatsApp
    </a>
  );
}
