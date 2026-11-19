# MEMORY.md — CreatorOps Hub
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- Desplegado y verificado en Vercel: `https://creator-ops-hub-xi.vercel.app/`
- v1.2 con SDD: Panel completo de TikTok for Developers (Client Key, Secret, Access Token con prueba de conexión).
- Activación/desactivación de cuentas con switch Toggle sin borrarlas, enfocando el dashboard y las gráficas en canales activos.
- Logo oficial en alta resolución (`/logo.jpg`), favicon y páginas de conformidad legal (`/terms` y `/privacy`).
- 6/6 tests unitarios en verde (`node --test tests/metrics.test.js`) y tipado estricto sin errores.

## Decisiones (y por qué)
- **Tailwind v4 PostCSS en producción:** Se configuró `@tailwindcss/postcss` con `postcss.config.mjs` y `--webpack` para compilar de forma robusta e idéntica en local y en Vercel.
- **Separación Client/Server en settings:** Los módulos con Node `fs` residen exclusivamente en `/api/*` y `src/lib/server-data.ts`. `data-provider.ts` en cliente consulta `/api/dashboard` vía HTTP y en `next.config.ts` se añadió fallback de `fs: false` para el cliente.
- **SDD Spec-Anchored:** Las specs viven en `specs/` (`spec.md`, `plan.md`, `tasks.md`) y guían la evolución del código para evitar desincronizaciones entre intención y código.
- **Agentes especializados:** Se estructuró `.opencode/agents/` con `coordinator`, `planner`, `implementer` y `reviewer` para garantizar control y calidad por fases.
- **Tests con node --test nativo:** Pruebas unitarias de cálculo de métricas y fechas sin sobrecargar dependencias de testing.

## Aprendizajes y errores a evitar
- En Vercel Serverless (read-only filesystem `EROFS`): no depender de escritura directa en `data/settings.json`; usar memoria de proceso, `/tmp` y `localStorage` en cliente para persistencia de credenciales sin lanzar errores en UI.
- Nunca usar `toISOString()` para agrupar días de analítica local; usar fechas de calendario en zona horaria del usuario.
- En Windows / Turbopack: no importar archivos de servidor que usen `fs` desde componentes `'use client'`.
- Validar siempre el formato JSON en `data/settings.json` para evitar excepciones en arranque.

## Próximos pasos
- [ ] Implementar soporte OAuth2 oficial para TikTok for Developers cuando el usuario reciba sus claves.
- [ ] Integrar alertas matutinas automáticas por email o Telegram al detectar un video viral en las primeras 24h.
