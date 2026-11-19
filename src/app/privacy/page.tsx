import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
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
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Política de Privacidad</h1>
            <p className="text-xs text-zinc-400">CreatorOps Hub • Actualizado: Noviembre 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Datos Recopilados</h2>
            <p>
              CreatorOps Hub solo recopila y procesa métricas públicas y analíticas de desempeño proporcionadas mediante las APIs oficiales con el consentimiento del usuario (seguidores, reproducciones, interacciones).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. Uso de la Información</h2>
            <p>
              La información se utiliza únicamente para calcular resúmenes de rendimiento de 24 horas y 14 días en el panel de control. No vendemos, no comercializamos ni compartimos datos con terceros.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. Seguridad de Credenciales</h2>
            <p>
              Tus claves de API y tokens de acceso se almacenan de manera local y en tu instancia privada de base de datos, transmitiéndose únicamente de forma cifrada a través de HTTPS.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">4. Revocación y Control</h2>
            <p>
              Puedes desconectar cuentas o revocar el acceso en cualquier momento desde los ajustes de la aplicación o directamente en la configuración de seguridad de tu cuenta de TikTok o Google.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
