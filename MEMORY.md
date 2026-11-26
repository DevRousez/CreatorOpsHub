# MEMORY.md — CreatorOps Hub
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- Sincronización en vivo de YouTube: consulta y actualiza en tiempo real suscriptores, vistas y videos reales de cada canal (eliminado el fallback a videos demo de PCs/monitores).
- Formulario de edición con campos de métricas (seguidores, vistas totales, videos y vistas 24h) para calibrar cuentas de TikTok o canales manualmente.
- PWA (Progressive Web App) lista para instalar en Android e iOS con manifest, iconos y prompt nativo.
- Desplegado y verificado en Vercel: `https://creator-ops-hub-xi.vercel.app/`
- YouTube con auto-detección Zero-Friction y tokens OAuth2 de TikTok listos.
- 6/6 tests unitarios en verde (`node --test tests/*.test.js`) y tipado estricto sin errores.

## Decisiones (y por qué)
- **Cero Mock Leakage en Producción:** `server-data.ts` y `data-provider.ts` nunca deben recurrir a `MOCK_RECENT_CONTENT` cuando `useMockData` es false. Si no hay videos, se entrega una lista vacía con estado vacío amigable.
- **Auto-Sync en vivo de YouTube con caché en memoria:** Se integró consulta en lote a YouTube Data API v3 con caché TTL de 3 min para actualizar métricas reales sin agotar cuotas.
- **TikTok OAuth scopes y Redirect URI:** TikTok v2 rechaza con `• client_key` cuando se solicitan permisos no autorizados previamente (ej. `video.list`) o cuando la Redirect URI no coincide al 100%. Por defecto se solicita `user.info.basic` y se expone la URI exacta en el modal de configuración.
- **Modo Dev con Webpack:** En `package.json` se configuró `"dev": "next dev --webpack"` y `turbopack: {}` en `next.config.ts`, solucionando el conflicto de Next.js 16 entre Turbopack y la configuración personalizada de Webpack en Windows.
- **Tailwind v4 PostCSS en producción:** Se configuró `@tailwindcss/postcss` con `postcss.config.mjs` y `--webpack` para compilar de forma robusta e idéntica en local y en Vercel.
- **Separación Client/Server en settings:** Los módulos con Node `fs` residen exclusivamente en `/api/*` y `src/lib/server-data.ts`. `data-provider.ts` en cliente consulta `/api/dashboard` vía HTTP y en `next.config.ts` se añadió fallback de `fs: false` para el cliente.
- **SDD Spec-Anchored:** Las specs viven en `specs/` (`spec.md`, `plan.md`, `tasks.md`) y guían la evolución del código para evitar desincronizaciones entre intención y código.
- **Agentes especializados:** Se estructuró `.opencode/agents/` con `coordinator`, `planner`, `implementer` y `reviewer` para garantizar control y calidad por fases.
- **Tests con node --test nativo:** Pruebas unitarias de cálculo de métricas y fechas sin sobrecargar dependencias de testing.

## Aprendizajes y errores a evitar
- Reglas de Hooks en React: nunca llamar a `useState` o hooks después de un `if (!isOpen) return null;`; todos los hooks deben ejecutarse incondicionalmente en la parte superior del componente.
- En Vercel Serverless (read-only filesystem `EROFS`): no depender de escritura directa en `data/settings.json`; usar memoria de proceso, `/tmp` y `localStorage` en cliente para persistencia de credenciales sin lanzar errores en UI.
- Nunca usar `toISOString()` para agrupar días de analítica local; usar fechas de calendario en zona horaria del usuario.
- En Windows / Turbopack: no importar archivos de servidor que usen `fs` desde componentes `'use client'`.
- Validar siempre el formato JSON en `data/settings.json` para evitar excepciones en arranque.

## Próximos pasos
- [ ] Implementar soporte OAuth2 oficial para TikTok for Developers cuando el usuario reciba sus claves.
- [ ] Integrar alertas matutinas automáticas por email o Telegram al detectar un video viral en las primeras 24h.
