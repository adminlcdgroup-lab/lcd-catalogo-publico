// ════════════════════════════════════════════════════════════════
// API · POST /api/generar-flyer
// Recibe datos del vehículo + URLs de fotos, renderiza el HTML en
// Chrome headless real (Puppeteer + @sparticuz/chromium) y devuelve
// el PNG 1080x1920. Output 100% idéntico al navegador.
// ════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { renderFlyerHTML, type FlyerData } from '@/lib/flyer-template';
import { APPS_SCRIPT_URL } from '@/lib/config';

export const runtime     = 'nodejs';
export const maxDuration = 30;
export const dynamic     = 'force-dynamic';

// R22 · Solo la app del ERP (GitHub Pages) puede pedir flyers, y con una
// sesión válida de admin o tasador. Antes el endpoint estaba abierto a
// cualquiera (CORS *) y cada pedido gastaba ~30 s de Chrome.
const ORIGEN_ERP = 'https://adminlcdgroup-lab.github.io';
const corsHeaders = {
  'Access-Control-Allow-Origin'  : ORIGEN_ERP,
  'Access-Control-Allow-Methods' : 'POST, OPTIONS',
  'Access-Control-Allow-Headers' : 'Content-Type',
  'Vary'                         : 'Origin',
};
const MAX_BYTES = 15 * 1024 * 1024;   // fotos embebidas incluidas

// Pregunta a Apps Script si el token es una sesión viva de quien publica.
async function sesionValida(token: unknown): Promise<boolean> {
  if (typeof token !== 'string' || !/^[0-9a-f-]{36}$/i.test(token) || !APPS_SCRIPT_URL) return false;
  try {
    const r = await fetch(APPS_SCRIPT_URL, {
      method: 'POST', redirect: 'follow', cache: 'no-store',
      body: JSON.stringify({ action: 'validarSesion', payload: { token, sinLlave: true } }),
    });
    const j: any = await r.json();
    return !!(j && j.exito && j.valida && (j.rol === 'admin' || j.rol === 'tasador'));
  } catch { return false; }
}

// Chrome solo puede descargar lo que la plantilla necesita
const RED_PERMITIDA = /^(data:|about:|https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|drive\.google\.com|[a-z0-9-]+\.googleusercontent\.com)\/)/i;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  let browser = null;
  try {
    const largo = Number(req.headers.get('content-length') || 0);
    if (largo > MAX_BYTES) {
      return NextResponse.json({ error: 'El pedido es demasiado grande' }, { status: 413, headers: corsHeaders });
    }
    const cuerpo = (await req.json()) as FlyerData & { _token?: string };
    if (!(await sesionValida(cuerpo && cuerpo._token))) {
      return NextResponse.json({ error: 'Sesión del ERP inválida o vencida' }, { status: 401, headers: corsHeaders });
    }
    const data = cuerpo as FlyerData;

    // Validación mínima
    if (!data || !data.marca || !data.modelo) {
      return NextResponse.json(
        { error: 'Datos incompletos: se requiere al menos marca y modelo' },
        { status: 400, headers: corsHeaders }
      );
    }

    const html = renderFlyerHTML(data);

    // Lanzar Chrome headless (binario empacado en la función serverless)
    browser = await puppeteer.launch({
      args:            chromium.args,
      defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 2 },
      executablePath:  await chromium.executablePath(),
      headless:        true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
    // R22: cualquier otra petición (incluidas redirecciones) se corta
    await page.setRequestInterception(true);
    page.on('request', (r: any) => { RED_PERMITIDA.test(r.url()) ? r.continue() : r.abort(); });

    // Cargar HTML y esperar a que el DOM y la red estén listos
    await page.setContent(html, { waitUntil: ['networkidle0', 'load'] });

    // Esperar a que las fuentes Google estén disponibles
    await page.evaluate(async () => {
      // @ts-ignore
      if (document.fonts && document.fonts.ready) {
        // @ts-ignore
        await document.fonts.ready;
      }
    });

    // Pequeña pausa final para garantizar layout estable
    await new Promise(r => setTimeout(r, 500));

    // Screenshot exacto 1080x1920
    const png = await page.screenshot({
      type:          'png',
      clip:          { x: 0, y: 0, width: 1080, height: 1920 },
      omitBackground: false,
    });

    await browser.close();
    browser = null;

    // Devolver el PNG como respuesta binaria
    return new NextResponse(png as any, {
      status:  200,
      headers: {
        ...corsHeaders,
        'Content-Type'  : 'image/png',
        'Cache-Control' : 'no-store, no-cache',
      },
    });
  } catch (err: any) {
    if (browser) {
      try { await browser.close(); } catch {}
    }
    console.error('[generar-flyer] error:', err);
    return NextResponse.json(
      { error: 'Error al generar el flyer: ' + (err?.message || String(err)) },
      { status: 500, headers: corsHeaders }
    );
  }
}
