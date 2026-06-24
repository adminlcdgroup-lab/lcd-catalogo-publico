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

export const runtime     = 'nodejs';
export const maxDuration = 30;
export const dynamic     = 'force-dynamic';

// CORS abierto — el CRM corre en otro dominio (github.io)
const corsHeaders = {
  'Access-Control-Allow-Origin'  : '*',
  'Access-Control-Allow-Methods' : 'POST, OPTIONS',
  'Access-Control-Allow-Headers' : 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  let browser = null;
  try {
    const data = (await req.json()) as FlyerData;

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
