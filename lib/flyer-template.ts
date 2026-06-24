// ════════════════════════════════════════════════════════════════
// FLYER HTML TEMPLATE — renderizado por Chrome headless en Vercel
// 1080x1920 (Stories format) · Diseño LCD Group AUTOMOTRIZ
// ════════════════════════════════════════════════════════════════

export type FlyerData = {
  marca:          string;
  modelo:         string;
  version:        string;
  anio:           number | string;
  km:             string;       // ej. "120,000 km"
  transmision:    string;       // ej. "AT" o "MECANICA"
  motor:          string;       // ej. "1.5T"
  traccion:       string;       // ej. "4X2"
  combustible:    string;       // ej. "GASOLINA"
  pasajeros:      number | string;
  precio:         string;       // ej. "16,500" (sin USD)
  placa:          string;
  tagOferta:      string;       // ej. "OFERTA" / "GARANTIA DE TIENDA" / "NUEVO INGRESO"
  fotoPrincipal:  string;       // URL pública (Drive thumbnail)
  galeria:        string[];     // hasta 3 URLs
  whatsapp:       string;       // ej. "+51 949 129 466"
  email:          string;       // ej. "lcdgroupsac@gmail.com"
  instagram:      string;       // ej. "@lcdgroup.automotriz"
  brandName:      string;       // ej. "LCD GROUP"
  brandTagline:   string;       // ej. "AUTOMOTRIZ"
  logoUrl:        string;       // URL pública del logo LCD
};

// Convierte URL de Drive a thumbnail estable
function drive(url: string, size = 1200): string {
  if (!url) return '';
  const m1 = url.match(/[?&]id=([^&]+)/);
  const m2 = url.match(/\/d\/([^/]+)/);
  const id = m1 ? m1[1] : (m2 ? m2[1] : null);
  if (!id) return url;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
}

function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderFlyerHTML(d: FlyerData): string {
  const e = escapeHtml;
  const fotoP = drive(d.fotoPrincipal, 1200);
  const g1    = drive(d.galeria?.[0] || '', 600);
  const g2    = drive(d.galeria?.[1] || '', 600);
  const g3    = drive(d.galeria?.[2] || '', 600);
  const logo  = d.logoUrl || 'https://drive.google.com/thumbnail?id=19FylJ0QVp0DwCqmMVgrjKcBP-VkRE0Jc&sz=w400';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 1080px; height: 1920px;
    background: #0a0a0a;
    font-family: 'Montserrat', sans-serif;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  /* ════ CANVAS ════ */
  .canvas {
    width: 1080px; height: 1920px;
    position: relative;
    background: #0a0a0a;
    overflow: hidden;
  }

  /* ════ TOP BAR (logo + badge) ════ */
  .top-fade {
    position: absolute; top: 0; left: 0; right: 0; height: 220px;
    z-index: 5; pointer-events: none;
    background: linear-gradient(180deg, rgba(0,0,0,.85), rgba(0,0,0,.5) 40%, transparent 100%);
  }
  .top-bar {
    position: absolute; top: 30px; left: 50px; right: 50px; height: 80px;
    z-index: 10; display: flex; align-items: center; justify-content: space-between;
  }
  .top-logo {
    height: 80px;
    background: rgba(0,0,0,.55);
    border-radius: 14px;
    padding: 0 22px;
    box-shadow: 0 4px 20px rgba(0,0,0,.5);
    display: flex; align-items: center;
  }
  .top-logo img { height: 60px; width: auto; max-width: 240px; object-fit: contain; }
  .badge-oferta {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #fff; padding: 14px 28px; border-radius: 999px;
    font-weight: 900; font-size: 22px; letter-spacing: 3px;
    box-shadow: 5px 5px 0 rgba(0,0,0,.45),
                0 12px 25px rgba(0,0,0,.55),
                0 0 40px rgba(239,68,68,.45);
    transform: rotate(-6deg);
    text-shadow: 0 2px 4px rgba(0,0,0,.45);
    white-space: nowrap;
  }

  /* ════ MAIN PHOTO (0-1050) ════ */
  .main-photo {
    position: absolute; top: 0; left: 0; width: 1080px; height: 1050px;
    overflow: hidden; z-index: 1;
  }
  .main-photo img {
    width: 100%; height: 100%; object-fit: cover; object-position: center;
  }
  .main-photo .empty {
    width: 100%; height: 100%;
    background: #161616;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,.2); font-size: 22px;
  }
  .main-fade {
    position: absolute; top: 850px; left: 0; right: 0; height: 200px;
    z-index: 3; pointer-events: none;
    background: linear-gradient(180deg, transparent 0%, rgba(10,10,10,.6) 60%, rgba(10,10,10,.95) 100%);
  }

  /* ════ GALLERY STRIP (1050-1230) ════ */
  .gallery {
    position: absolute; top: 1050px; left: 20px; right: 20px; height: 180px;
    z-index: 4;
    display: flex; gap: 12px;
  }
  .gallery-thumb {
    flex: 1; height: 180px;
    border-radius: 14px;
    overflow: hidden;
    border: 2px solid rgba(34,177,76,.5);
    box-shadow: 0 4px 15px rgba(0,0,0,.5);
    background: #161616;
  }
  .gallery-thumb img {
    width: 100%; height: 100%; object-fit: cover;
  }

  /* ════ INFO SECTION (1255-1665) — block layout, fixed heights ════ */
  .info {
    position: absolute;
    top: 1255px;
    left: 60px; right: 60px;
    height: 410px;
    z-index: 5;
  }
  .row1 {
    display: block;
    height: 42px;
    line-height: 42px;
    margin: 0 0 22px 0;
    white-space: nowrap;
  }
  .anio {
    display: inline-block;
    background: linear-gradient(135deg, #22B14C 0%, #3FCB6A 100%);
    color: #0a0a0a;
    height: 42px; line-height: 42px;
    padding: 0 16px;
    border-radius: 8px;
    font-size: 22px; font-weight: 900; letter-spacing: 2px;
    box-shadow: 0 4px 12px rgba(34,177,76,.35);
    vertical-align: top;
  }
  .marca {
    display: inline-block;
    font-size: 26px; font-weight: 700; color: #9ca3af;
    letter-spacing: 4px; text-transform: uppercase;
    height: 42px; line-height: 42px;
    vertical-align: top;
    margin-left: 18px;
  }
  .modelo {
    display: block;
    font-size: 78px; font-weight: 900; color: #fff;
    height: 96px; line-height: 96px;
    letter-spacing: -2px;
    text-transform: uppercase;
    margin: 0 0 16px 0;
    white-space: nowrap;
  }
  .version {
    display: block;
    font-size: 24px; font-weight: 600; color: #d1d5db;
    letter-spacing: 1.5px; text-transform: uppercase;
    height: 32px; line-height: 32px;
    margin: 0 0 22px 0;
    white-space: nowrap;
  }
  .precio-wrap {
    display: block;
    height: 78px; line-height: 78px;
    margin: 0 0 22px 0;
    white-space: nowrap;
  }
  .precio-cur {
    display: inline-block;
    font-size: 28px; font-weight: 700; color: #9ca3af; letter-spacing: 2px;
    line-height: 78px; vertical-align: top;
    margin-right: 14px;
  }
  .precio {
    display: inline-block;
    font-size: 78px; font-weight: 900; color: #fff;
    line-height: 78px; letter-spacing: -2px;
    vertical-align: top;
  }
  .trust-badge {
    display: block;
    width: fit-content;
    height: 36px; line-height: 36px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1.5px solid rgba(34,177,76,.6);
    color: #e5e7eb;
    font-size: 14px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase;
    margin: 0 0 22px 0;
    white-space: nowrap;
  }
  .trust-badge .dot {
    display: inline-block;
    width: 10px; height: 10px; border-radius: 50%;
    background: #3FCB6A;
    vertical-align: middle;
    margin-right: 8px; margin-top: -2px;
  }
  .tags { display: block; margin: 0; font-size: 0; line-height: 0; }
  .tag {
    display: inline-block;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.15);
    color: #f3f4f6;
    height: 52px; line-height: 52px;
    padding: 0 22px;
    border-radius: 999px;
    font-size: 17px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase;
    white-space: nowrap;
    margin: 0 10px 10px 0;
    vertical-align: top;
  }

  /* ════ FOOTER (1710-1920) ════ */
  .footer {
    position: absolute; bottom: 0; left: 0; right: 0; height: 210px;
    background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
    z-index: 6;
    padding: 24px 50px 20px;
  }
  .footer::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(to right, #22B14C, #3FCB6A, #22B14C);
  }
  .wa-cta {
    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
    border-radius: 22px;
    padding: 18px 28px;
    display: flex; align-items: center;
    box-shadow: 0 10px 35px rgba(37,211,102,.45);
    height: 110px;
  }
  .wa-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(255,255,255,.18);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .wa-icon svg { width: 38px; height: 38px; fill: #fff; display: block; }
  .wa-text {
    margin-left: 22px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .wa-label {
    font-size: 13px; color: rgba(255,255,255,.85);
    font-weight: 800; letter-spacing: 3px; text-transform: uppercase;
    line-height: 1; margin-bottom: 8px;
  }
  .wa-number {
    font-size: 34px; color: #fff; font-weight: 900; letter-spacing: 1px;
    line-height: 1;
  }
  .wa-brand {
    margin-left: auto; text-align: right;
    display: flex; flex-direction: column; align-items: flex-end; justify-content: center;
  }
  .wa-brand .b1 {
    font-size: 22px; font-weight: 900; color: #fff; letter-spacing: 1px;
    line-height: 1; margin-bottom: 6px;
  }
  .wa-brand .b2 {
    font-size: 10px; font-weight: 700; color: rgba(255,255,255,.8); letter-spacing: 3px;
    line-height: 1;
  }
  .footer-bottom {
    display: flex; align-items: center; justify-content: center; gap: 16px;
    line-height: 1;
    margin-top: 18px;
  }
  .footer-bottom svg { width: 16px; height: 16px; fill: #9ca3af; display: block; }
  .footer-bottom .handle { font-size: 16px; color: #d1d5db; font-weight: 700; }
  .footer-bottom .sep { color: #4b5563; font-size: 14px; }
  .footer-bottom .ref { font-size: 12px; color: #6b7280; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="canvas">

    <!-- MAIN PHOTO -->
    <div class="main-photo">
      ${fotoP ? `<img src="${e(fotoP)}" alt="">` : `<div class="empty">Sin foto principal</div>`}
    </div>
    <div class="main-fade"></div>

    <!-- TOP BAR -->
    <div class="top-fade"></div>
    <div class="top-bar">
      <div class="top-logo"><img src="${e(logo)}" alt="LCD"></div>
      ${d.tagOferta ? `<div class="badge-oferta">${e(d.tagOferta)}</div>` : ''}
    </div>

    <!-- GALLERY -->
    <div class="gallery">
      <div class="gallery-thumb">${g1 ? `<img src="${e(g1)}" alt="">` : ''}</div>
      <div class="gallery-thumb">${g2 ? `<img src="${e(g2)}" alt="">` : ''}</div>
      <div class="gallery-thumb">${g3 ? `<img src="${e(g3)}" alt="">` : ''}</div>
    </div>

    <!-- INFO -->
    <div class="info">
      <div class="row1">
        <span class="anio">${e(String(d.anio))}</span>
        <span class="marca">${e(d.marca)}</span>
      </div>
      <h1 class="modelo">${e(d.modelo)}</h1>
      ${d.version ? `<p class="version">${e(d.version)}</p>` : ''}
      <div class="precio-wrap">
        <span class="precio-cur">USD</span>
        <span class="precio">${e(d.precio)}</span>
      </div>
      <div class="trust-badge"><span class="dot"></span>Documentación al día</div>
      <div class="tags">
        ${d.km ? `<span class="tag">🛣 ${e(d.km)}</span>` : ''}
        ${d.transmision ? `<span class="tag">⚙ ${e(d.transmision)}</span>` : ''}
        ${d.motor ? `<span class="tag">🔧 ${e(d.motor)}</span>` : ''}
        ${d.traccion ? `<span class="tag">🚙 ${e(d.traccion)}</span>` : ''}
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="wa-cta">
        <div class="wa-icon">
          <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </div>
        <div class="wa-text">
          <div class="wa-label">Escríbenos</div>
          <div class="wa-number">${e(d.whatsapp)}</div>
        </div>
        <div class="wa-brand">
          <div class="b1">${e(d.brandName || 'LCD GROUP')}</div>
          <div class="b2">${e(d.brandTagline || 'AUTOMOTRIZ')}</div>
        </div>
      </div>
      <div class="footer-bottom">
        <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        <span class="handle">${e(d.instagram || '@lcdgroup.automotriz')}</span>
        <span class="sep">·</span>
        <span class="ref">REF: ${e(d.placa)}</span>
      </div>
    </div>

  </div>
</body>
</html>`;
}
