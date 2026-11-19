import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Dashboard</span>
        </Link>

        <div className="border-b border-zinc-800 pb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Términos de Servicio</h1>
            <p className="text-xs text-zinc-400">CreatorOps Hub • Actualizado: Noviembre 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Descripción del Servicio</h2>
            <p>
              CreatorOps Hub es una solución analítica que permite a los creadores de contenido centralizar, monitorear y comparar métricas de desempeño de sus canales en YouTube y TikTok.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. Uso Autorizado</h2>
            <p>
              La plataforma está diseñada exclusivamente para que los titulares de las cuentas o administradores autorizados consulten estadísticas. Queda prohibido el uso indebido, scraping no autorizado o actividades contrarias a las políticas de los proveedores de API.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. Integraciones de Terceros</h2>
            <p>
              CreatorOps Hub utiliza las APIs oficiales de TikTok for Developers y Google YouTube Data API v3. El servicio respeta las cuotas y términos de cada proveedor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">4. Limitación de Responsabilidad</h2>
            <p>
              La aplicación se ofrece "tal cual". No garantizamos la disponibilidad continua ininterrumpida frente a cambios en las políticas o restricciones de red de terceros.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
